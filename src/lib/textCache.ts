// Bible text the reader has already opened, kept on the device (IndexedDB) so a chapter read once still opens with no
// signal or when bible-api.com or bolls.life is down. Only the text is kept, and only the most recent entries.

const DB_NAME = "nepsis-texts";
const DB_VERSION = 1;
const STORE = "texts";
const MAX_ENTRIES = 300;
/** How long a kept copy may stand in when the network fails. */
export const TEXT_KEEP_MS = 1000 * 60 * 60 * 24 * 30;

export type KeptText<T = unknown> = { key: string; savedAt: number; data: T };

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB is not available"));
  dbPromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(STORE, { keyPath: "key" });
      store.createIndex("savedAt", "savedAt");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  dbPromise.catch(() => { dbPromise = null; });
  return dbPromise;
}

/** A slow or stuck device store must never hold up reading online, so a lookup gives up after a moment. */
const READ_TIMEOUT_MS = 1500;

export async function readKeptText<T>(key: string): Promise<KeptText<T> | undefined> {
  const lookup = (async () => {
    const db = await openDb();
    return await new Promise<KeptText<T> | undefined>((resolve, reject) => {
      const request = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
      request.onsuccess = () => resolve(request.result as KeptText<T> | undefined);
      request.onerror = () => reject(request.error);
    });
  })();
  const timeout = new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), READ_TIMEOUT_MS));
  try {
    return await Promise.race([lookup, timeout]);
  } catch {
    return undefined;
  }
}

export async function keepText<T>(key: string, data: T): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      store.put({ key, savedAt: Date.now(), data } satisfies KeptText<T>);
      // Past the limit, drop the oldest so the store never grows without bound.
      const count = store.count();
      count.onsuccess = () => {
        let extra = count.result - MAX_ENTRIES;
        if (extra <= 0) return;
        store.index("savedAt").openCursor().onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
          if (!cursor || extra <= 0) return;
          cursor.delete();
          extra -= 1;
          cursor.continue();
        };
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Storage may be unavailable (private mode) or full; the reader still works online.
  }
}

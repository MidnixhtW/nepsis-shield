// Story-sized (1080 x 1920) share images for Instagram, TikTok and messages, drawn on a canvas in the
// current theme's colors. The image is made on the device; only the icon (if any) is fetched.

export type ShareCardInput = {
  /** Small line at the top, e.g. "A word from the Fathers". */
  eyebrow: string;
  /** The main text: a saying, a verse, a saint's name. */
  text: string;
  /** Who said it, or the reference. */
  attribution?: string;
  /** A Wikimedia Commons file name for an icon to show above the text. Left out if it can't be loaded. */
  commonsFile?: string;
};

const WIDTH = 1080;
const HEIGHT = 1920;
const MARGIN = 110;
const FOOTER = 300;

function themeColor(name: string, fallback: string, alpha = 1) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!value) return fallback;
  const [h, s, l] = value.split(/\s+/);
  return `hsla(${h}, ${s}, ${l}, ${alpha})`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    lines.push(line);
  }
  return lines;
}

// Commons' redirect links don't allow drawing into a canvas, but the direct upload.wikimedia.org address does.
async function commonsImage(file: string) {
  try {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url&iiurlwidth=800&titles=${encodeURIComponent(`File:${file}`)}`;
    const data = await fetch(api).then((response) => response.json());
    const page = Object.values(data?.query?.pages ?? {})[0] as { imageinfo?: Array<{ thumburl?: string }> } | undefined;
    const url = page?.imageinfo?.[0]?.thumburl;
    if (!url) return null;
    return await new Promise<HTMLImageElement | null>((resolve) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = url;
      setTimeout(() => resolve(null), 8000);
    });
  } catch {
    return null;
  }
}

// An image without cross-origin permission would block saving the canvas, so test it on a scratch canvas first.
function canExport(image: HTMLImageElement) {
  try {
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    const context = probe.getContext("2d");
    context?.drawImage(image, 0, 0, 1, 1);
    context?.getImageData(0, 0, 1, 1);
    return true;
  } catch {
    return false;
  }
}

export async function renderShareCard(input: ShareCardInput): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  const background = themeColor("--background", "#0c0f15");
  const card = themeColor("--card", "#121722");
  const foreground = themeColor("--foreground", "#ede6d6");
  const muted = themeColor("--muted-foreground", "#a9a59b");
  const accent = themeColor("--accent", "#d6b45e");

  const gradient = ctx.createLinearGradient(0, 0, WIDTH * 0.4, HEIGHT);
  gradient.addColorStop(0, card);
  gradient.addColorStop(1, background);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  for (const [x, y, color] of [[WIDTH * 0.85, 0, themeColor("--primary", "#6f9fd8", 0.25)], [0, HEIGHT * 0.8, themeColor("--accent", "#d6b45e", 0.12)]] as const) {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 950);
    glow.addColorStop(0, color);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  await document.fonts?.ready;
  const image = input.commonsFile ? await commonsImage(input.commonsFile) : null;
  const icon = image && canExport(image) ? image : null;

  // Measure everything first so the whole block can sit in the middle of the card.
  const iconHeight = icon ? Math.min(640, (icon.height / icon.width) * (WIDTH - MARGIN * 2)) : 0;
  const iconWidth = icon ? (icon.width / icon.height) * iconHeight : 0;
  const eyebrowGap = 80;
  const textRoom = HEIGHT - FOOTER - 200 - (icon ? iconHeight + 90 : 0) - eyebrowGap;
  let size = 84;
  let lines: string[] = [];
  for (; size >= 40; size -= 4) {
    ctx.font = `500 ${size}px "Literata", Georgia, serif`;
    lines = wrap(ctx, input.text, WIDTH - MARGIN * 2);
    if (lines.length * size * 1.38 <= textRoom) break;
  }
  ctx.font = '600 42px "Barlow", system-ui, sans-serif';
  const attribution = input.attribution ? wrap(ctx, `— ${input.attribution}`, WIDTH - MARGIN * 2) : [];
  const blockHeight = (icon ? iconHeight + 90 : 0) + eyebrowGap + lines.length * size * 1.38 + (attribution.length ? 30 + attribution.length * 56 : 0);
  let y = Math.max(140, (HEIGHT - FOOTER - blockHeight) / 2);

  if (icon) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 70;
    ctx.shadowOffsetY = 24;
    ctx.drawImage(icon, (WIDTH - iconWidth) / 2, y, iconWidth, iconHeight);
    ctx.restore();
    y += iconHeight + 90;
  }

  ctx.fillStyle = accent;
  ctx.font = '600 40px "Barlow Condensed", "Arial Narrow", sans-serif';
  ctx.fillText(input.eyebrow.toUpperCase().split("").join(String.fromCharCode(8202)), MARGIN, y);
  y += eyebrowGap;

  ctx.fillStyle = foreground;
  ctx.font = `500 ${size}px "Literata", Georgia, serif`;
  for (const line of lines) {
    y += size;
    ctx.fillText(line, MARGIN, y);
    y += size * 0.38;
  }

  if (attribution.length) {
    y += 30;
    ctx.fillStyle = muted;
    ctx.font = '600 42px "Barlow", system-ui, sans-serif';
    for (const line of attribution) {
      y += 42;
      ctx.fillText(line, MARGIN, y);
      y += 14;
    }
  }

  ctx.fillStyle = accent;
  ctx.fillRect(MARGIN, HEIGHT - 210, 80, 6);
  ctx.fillStyle = foreground;
  ctx.font = '700 48px "Barlow Condensed", "Arial Narrow", sans-serif';
  ctx.fillText("Nepsis Shield", MARGIN, HEIGHT - 140);
  ctx.fillStyle = muted;
  ctx.font = '500 34px "Barlow", system-ui, sans-serif';
  ctx.fillText("Orthodox prayer · free and private", MARGIN, HEIGHT - 92);

  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("No image"))), "image/png"));
}

/** Opens the share sheet with the image, or saves it when the device can't share files. */
export async function shareCard(input: ShareCardInput, fileName: string) {
  const blob = await renderShareCard(input);
  const file = new File([blob], fileName, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: input.eyebrow });
    return "shared" as const;
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "saved" as const;
}

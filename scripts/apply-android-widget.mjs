// Adds the "Today" home-screen widget to the generated Android project (run after `capacitor sync`).
// The web app saves two weeks of widget days in Capacitor Preferences (see src/lib/widgetSnapshot.ts);
// the widget reads them, shows today's, refreshes every 30 minutes and whenever the app is left,
// and opens the app when tapped. A "Pray now" line names the prayers for the hour, and its Begin button opens them:
// MainActivity saves the route in Preferences ("widget:route"), which the web app reads and clears (WidgetRouteRouter).
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const root = process.cwd();
const mainDir = join(root, "android", "app", "src", "main");
const resDir = join(mainDir, "res");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart(), "utf8");
}

function findFile(dir, name) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      const found = findFile(path, name);
      if (found) return found;
    } else if (entry === name) {
      return path;
    }
  }
  return null;
}

if (!existsSync(mainDir)) fail("Missing android/app/src/main. Run `npx capacitor add android` first.");

const mainActivity = findFile(join(mainDir, "java"), "MainActivity.java");
if (!mainActivity) fail("Could not find MainActivity.java in the Android project.");
const activitySource = readFileSync(mainActivity, "utf8");
const pkg = activitySource.match(/^package\s+([\w.]+);/m)?.[1];
if (!pkg) fail("Could not read the package name from MainActivity.java.");

write(join(dirname(mainActivity), "TodayWidgetProvider.java"), `
package ${pkg};

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.view.View;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import org.json.JSONArray;
import org.json.JSONObject;

/** Home-screen widget: today's feast or season, today's fast, and a word from the Fathers. */
public class TodayWidgetProvider extends AppWidgetProvider {
    private static final String PREFS = "CapacitorStorage";
    private static final String KEY = "widget:today";
    /** Where Begin goes; read and cleared by the web app (src/components/app/WidgetRouteRouter.tsx). */
    private static final String ROUTE_KEY = "widget:route";
    private static final String EXTRA_ROUTE = "nepsis_route";

    /** Called by MainActivity for every intent: keeps a Begin route for the web app to open. */
    public static void stashRoute(Context context, Intent intent) {
        if (intent == null) return;
        String route = intent.getStringExtra(EXTRA_ROUTE);
        if (route == null || !route.startsWith("/")) return;
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(ROUTE_KEY, route).apply();
        intent.removeExtra(EXTRA_ROUTE);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        RemoteViews views = build(context);
        for (int id : ids) manager.updateAppWidget(id, views);
    }

    /** Called when the app is left, so the widget shows what the app just saved. */
    public static void updateAll(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, TodayWidgetProvider.class));
        if (ids == null || ids.length == 0) return;
        RemoteViews views = build(context);
        for (int id : ids) manager.updateAppWidget(id, views);
    }

    private static RemoteViews build(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_today);
        Date now = new Date();
        String today = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(now);
        String headline = "Open Nepsis Shield to fill in today.";
        String detail = "";
        String saying = "";
        String who = "";
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            JSONArray days = new JSONArray(prefs.getString(KEY, "[]"));
            for (int i = 0; i < days.length(); i++) {
                JSONObject day = days.getJSONObject(i);
                if (today.equals(day.optString("date"))) {
                    headline = day.optString("headline", headline);
                    detail = day.optString("detail", "");
                    saying = day.optString("saying", "");
                    who = day.optString("who", "");
                    break;
                }
            }
        } catch (Exception ignored) {
            // Keep the friendly default text.
        }

        views.setTextViewText(R.id.widget_date, new SimpleDateFormat("EEEE, MMMM d", Locale.getDefault()).format(now));
        views.setTextViewText(R.id.widget_headline, headline);
        setOptional(views, R.id.widget_detail, detail);
        setOptional(views, R.id.widget_saying, saying.isEmpty() ? "" : "\\u201C" + saying + "\\u201D");
        setOptional(views, R.id.widget_who, who);

        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent open = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_root, open);

        // The prayers for the hour, as on the Pray tab: morning until noon, evening until eight, then night.
        // The label can lag a boundary by up to the 30-minute refresh.
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        String begin = hour >= 4 && hour < 12 ? "morning" : hour >= 12 && hour < 20 ? "evening" : "night";
        String label = begin.equals("morning") ? "Morning prayers" : begin.equals("evening") ? "Evening prayers" : "Night prayers";
        views.setTextViewText(R.id.widget_now, label);
        Intent beginIntent = new Intent(context, MainActivity.class);
        beginIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        beginIntent.putExtra(EXTRA_ROUTE, "/pray?tab=daily&begin=" + begin);
        PendingIntent beginPending = PendingIntent.getActivity(context, 1, beginIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_begin, beginPending);
        return views;
    }

    private static void setOptional(RemoteViews views, int id, String text) {
        views.setTextViewText(id, text);
        views.setViewVisibility(id, text.isEmpty() ? View.GONE : View.VISIBLE);
    }
}
`);

write(join(resDir, "layout", "widget_today.xml"), `
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_root"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@drawable/widget_today_background"
    android:orientation="vertical"
    android:padding="14dp">

    <TextView
        android:id="@+id/widget_date"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:letterSpacing="0.08"
        android:textAllCaps="true"
        android:textColor="#C9A85C"
        android:textSize="11sp"
        android:textStyle="bold" />

    <TextView
        android:id="@+id/widget_headline"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"
        android:maxLines="2"
        android:ellipsize="end"
        android:textColor="#EFE8D2"
        android:textSize="16sp"
        android:textStyle="bold" />

    <TextView
        android:id="@+id/widget_detail"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="2dp"
        android:maxLines="2"
        android:ellipsize="end"
        android:textColor="#C8C2AE"
        android:textSize="12sp" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="8dp"
        android:gravity="center_vertical"
        android:orientation="horizontal">

        <TextView
            android:id="@+id/widget_now"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:maxLines="1"
            android:ellipsize="end"
            android:textColor="#EFE8D2"
            android:textSize="14sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/widget_begin"
            android:layout_width="wrap_content"
            android:layout_height="40dp"
            android:background="@drawable/widget_today_button"
            android:gravity="center"
            android:minWidth="72dp"
            android:paddingStart="16dp"
            android:paddingEnd="16dp"
            android:text="Begin"
            android:contentDescription="Begin the prayers for this hour"
            android:textColor="#1C2116"
            android:textSize="14sp"
            android:textStyle="bold" />
    </LinearLayout>

    <TextView
        android:id="@+id/widget_saying"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:layout_marginTop="8dp"
        android:ellipsize="end"
        android:fontFamily="serif"
        android:textColor="#EFE8D2"
        android:textSize="13sp" />

    <TextView
        android:id="@+id/widget_who"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"
        android:maxLines="1"
        android:ellipsize="end"
        android:textColor="#C9A85C"
        android:textSize="11sp" />
</LinearLayout>
`);

write(join(resDir, "drawable", "widget_today_background.xml"), `
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
    <solid android:color="#F21C2116" />
    <stroke android:width="1dp" android:color="#665E5236" />
    <corners android:radius="20dp" />
</shape>
`);

write(join(resDir, "drawable", "widget_today_button.xml"), `
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
    <solid android:color="#C9A85C" />
    <corners android:radius="20dp" />
</shape>
`);

write(join(resDir, "xml", "widget_today_info.xml"), `
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/widget_today_description"
    android:initialLayout="@layout/widget_today"
    android:minWidth="250dp"
    android:minHeight="130dp"
    android:minResizeWidth="180dp"
    android:minResizeHeight="80dp"
    android:previewLayout="@layout/widget_today"
    android:resizeMode="horizontal|vertical"
    android:targetCellWidth="4"
    android:targetCellHeight="2"
    android:updatePeriodMillis="1800000"
    android:widgetCategory="home_screen" />
`);

// Strings for the widget picker.
const stringsPath = join(resDir, "values", "strings.xml");
if (!existsSync(stringsPath)) fail(`Missing ${relative(root, stringsPath)}`);
let strings = readFileSync(stringsPath, "utf8");
if (!strings.includes("widget_today_label")) {
  strings = strings.replace(
    "</resources>",
    '    <string name="widget_today_label">Nepsis Shield: Today</string>\n    <string name="widget_today_description">The feast or fast of the day and a word from the Fathers.</string>\n</resources>',
  );
  writeFileSync(stringsPath, strings, "utf8");
}

// Register the widget in the manifest.
const manifestPath = join(mainDir, "AndroidManifest.xml");
let manifest = readFileSync(manifestPath, "utf8");
if (!manifest.includes("TodayWidgetProvider")) {
  const receiver = `
        <receiver
            android:name=".TodayWidgetProvider"
            android:exported="false"
            android:label="@string/widget_today_label">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/widget_today_info" />
        </receiver>
    </application>`;
  if (!manifest.includes("</application>")) fail("Could not find </application> in AndroidManifest.xml.");
  manifest = manifest.replace("</application>", receiver.trimStart());
  writeFileSync(manifestPath, manifest, "utf8");
}

// Refresh the widget whenever the app is left, so it shows what the app just saved.
if (!activitySource.includes("TodayWidgetProvider.updateAll")) {
  const plain = /public class MainActivity extends BridgeActivity\s*\{\s*\}/;
  if (plain.test(activitySource)) {
    const patched = activitySource.replace(
      plain,
      `public class MainActivity extends BridgeActivity {
    // A widget Begin tap carries a route; keep it for the web app before the page loads or resumes.
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        TodayWidgetProvider.stashRoute(this, getIntent());
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onNewIntent(android.content.Intent intent) {
        super.onNewIntent(intent);
        TodayWidgetProvider.stashRoute(this, intent);
    }

    @Override
    public void onPause() {
        super.onPause();
        TodayWidgetProvider.updateAll(this);
    }
}`,
    );
    writeFileSync(mainActivity, patched, "utf8");
  } else {
    console.warn("MainActivity has custom code; the widget will refresh on its 30-minute schedule only, and Begin opens the app without its prayer.");
  }
}

console.log(`Added the Today widget (package ${pkg}).`);

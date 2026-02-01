package com.nezihdertsiz.sukur360

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import java.util.*
import java.text.SimpleDateFormat

class NamazWidget : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    private fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
        val views = RemoteViews(context.packageName, R.layout.namaz_widget_layout)
        
        val prefs = context.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE)
        val city = prefs.getString("city", "İstanbul")
        val imsak = prefs.getString("imsak", "--:--")
        val iftar = prefs.getString("iftar", "--:--")
        
        views.setTextViewText(R.id.widget_city, "📍 $city")
        views.setTextViewText(R.id.vakit_imsak, imsak)
        views.setTextViewText(R.id.vakit_iftar, iftar)
        
        // Basit bir kalan süre hesaplama (Widget her saat başı güncellenir)
        // Gerçek saniye sayacı için uygulama aktif olmalıdır, bu sadece referans
        views.setTextViewText(R.id.widget_kalan_sure, "Bereketli vakitler")

        appWidgetManager.updateAppWidget(appWidgetId, views)
    }
}

package com.nezihdertsiz.sukur360

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.appwidget.AppWidgetManager
import android.content.Intent

class WidgetBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WidgetBridge"
    }

    @ReactMethod
    fun updateWidgetData(city: String, imsak: String, iftar: String) {
        val context = reactApplicationContext
        val prefs = context.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE)
        val editor = prefs.edit()
        editor.putString("city", city)
        editor.putString("imsak", imsak)
        editor.putString("iftar", iftar)
        editor.apply()

        // Widget'ı güncellemeye zorla
        val intent = Intent(context, NamazWidget::class.java)
        intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        val ids = AppWidgetManager.getInstance(context).getAppWidgetIds(
            android.content.ComponentName(context, NamazWidget::class.java)
        )
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
        context.sendBroadcast(intent)
    }
}

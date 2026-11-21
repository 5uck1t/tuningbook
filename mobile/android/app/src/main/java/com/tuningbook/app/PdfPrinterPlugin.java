package com.tuningbook.app;

import android.content.Context;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Renders the report HTML in an off-screen WebView and hands it to Android's print framework,
 * where the user can pick "Save as PDF" (or a real printer).
 */
@CapacitorPlugin(name = "PdfPrinter")
public class PdfPrinterPlugin extends Plugin {

    // Keep a strong reference until printing has started, otherwise the WebView can be collected.
    private WebView printWebView;

    @PluginMethod
    public void print(PluginCall call) {
        final String html = call.getString("html");
        final String name = call.getString("name", "TuningBook");
        if (html == null) {
            call.reject("Missing html");
            return;
        }

        getActivity().runOnUiThread(() -> {
            WebView webView = new WebView(getContext());
            // Report images are local files in the app's private storage.
            webView.getSettings().setAllowFileAccess(true);
            webView.setWebViewClient(new WebViewClient() {
                private boolean started = false;

                @Override
                public void onPageFinished(WebView view, String url) {
                    if (started) return;
                    started = true;
                    PrintManager printManager = (PrintManager) getActivity().getSystemService(Context.PRINT_SERVICE);
                    PrintDocumentAdapter adapter = view.createPrintDocumentAdapter(name);
                    PrintAttributes attributes = new PrintAttributes.Builder()
                            .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                            .build();
                    printManager.print(name, adapter, attributes);
                    call.resolve();
                }
            });
            printWebView = webView;
            webView.loadDataWithBaseURL("file:///android_asset/", html, "text/html", "utf-8", null);
        });
    }
}

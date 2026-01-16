import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const DeepfakeShieldApp());
}

class DeepfakeShieldApp extends StatelessWidget {
  const DeepfakeShieldApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Deepfake Shield',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0a0a0a),
      ),
      home: const WebViewScreen(),
    );
  }
}

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  InAppWebViewController? webViewController;
  bool isLoading = true;
  String errorMessage = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            if (errorMessage.isEmpty)
              InAppWebView(
                initialUrlRequest: URLRequest(
                  url: WebUri('file:///android_asset/flutter_assets/assets/web/index.html'),
                ),
                initialSettings: InAppWebViewSettings(
                  javaScriptEnabled: true,
                  allowFileAccessFromFileURLs: true,
                  allowUniversalAccessFromFileURLs: true,
                  domStorageEnabled: true,
                  databaseEnabled: true,
                  useOnLoadResource: true,
                  mixedContentMode: MixedContentMode.MIXED_CONTENT_ALWAYS_ALLOW,
                ),
                onWebViewCreated: (controller) {
                  webViewController = controller;
                  print('🚀 WebView created');
                },
                onLoadStart: (controller, url) {
                  print('✅ Loading started: $url');
                  setState(() => isLoading = true);
                },
                onLoadStop: (controller, url) async {
                  print('✅ Loading finished: $url');
                  setState(() => isLoading = false);
                },
                onLoadError: (controller, url, code, message) {
                  print('❌ Load error: $message');
                  setState(() {
                    errorMessage = 'Error $code: $message';
                    isLoading = false;
                  });
                },
                onConsoleMessage: (controller, consoleMessage) {
                  print('📱 Console: ${consoleMessage.message}');
                },
              )
            else
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, color: Colors.red, size: 64),
                      const SizedBox(height: 20),
                      Text(
                        errorMessage,
                        style: const TextStyle(color: Colors.white, fontSize: 16),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            errorMessage = '';
                            isLoading = true;
                          });
                        },
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                ),
              ),
            if (isLoading && errorMessage.isEmpty)
              Container(
                color: const Color(0xFF0a0a0a),
                child: const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircularProgressIndicator(color: Colors.blue),
                      SizedBox(height: 20),
                      Text(
                        'Loading Deepfake Shield...',
                        style: TextStyle(color: Colors.white, fontSize: 18),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

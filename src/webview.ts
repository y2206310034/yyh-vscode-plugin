import * as vscode from 'vscode';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed


function getWebViewContent(body: string, src?: vscode.Uri) {
	return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta http-equiv="X-UA-Compatible" content="ie=edge" />
			<title>Document</title>
		</head>
		<body>
			${body}
			<br />
		</body>
        <script>
            window.open(${src})
        </script>
	</html>
	`;
}

export default function webViewPanel(context: vscode.ExtensionContext) {
	// 1. 使用 createWebviewPanel 创建一个 panel，然后给 panel 放入 html 即可展示 web view

    const panel = vscode.window.createWebviewPanel(
        'helloWorld',
        '这是标题吗',
        vscode.ViewColumn.One, // web view 显示位置
        {
            enableScripts: true, // 允许 JavaScript
            retainContextWhenHidden: true // 在 hidden 的时候保持不关闭
        }
    ); 
    const onDiskPath = vscode.Uri.file(`${vscode.workspace.rootPath}/【运维】洋钱罐VPN使用手册.pdf`);
    const innerHtml = `<h1>Hello Web View${vscode.workspace.rootPath}</h1>`;
    const catGifSrc = panel.webview.asWebviewUri(onDiskPath);
    panel.webview.html = getWebViewContent(innerHtml, catGifSrc);
    return panel;
}
  

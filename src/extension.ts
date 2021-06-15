// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
import * as fs from 'fs';
import {execSync} from 'child_process'; //同步子进程
import * as moment from 'moment';
import webview from './webview';



export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "yyh-vscode-plugin" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('yyh-vscode-plugin.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from yyds!');
	});

	let myCommand = vscode.commands.registerCommand('yyh-vscode-plugin.yyds', () => {
		
		// if(configuration['yyh-vscode-plugin.useCodeSnippetsOnMethodSuggest']) {
		// 	vscode.window.showInformationMessage('啥都不是')
		// } else {
		console.log(vscode.workspace.getConfiguration('yyh-vscode-plugin'));
		vscode.window.showInformationMessage('啥都不是1');
		// }
		// const config = vscode.workspace.getConfiguration('yyh-vscode-plugin').get('tsdk')
		// vscode.window.showInformationMessage(config);
		
	});

	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	let myWebview = vscode.commands.registerCommand('yyh-vscode-plugin.webview', () => {
		const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;
		if(currentPanel) {
			currentPanel.reveal(columnToShowIn);
		} else {
			currentPanel = webview(context);
			currentPanel.onDidDispose(
				() => {
					currentPanel = undefined;
				},
				null,
				context.subscriptions
			  );
		}
	});

	let myFileHeader = vscode.commands.registerCommand('yyh-vscode-plugin.fileHeader', () => {

		const name = execSync('git config user.name').toString().trim();
		const date = moment().format('YYYY-MM-DD hh:mm:ss');
		vscode.window.showInformationMessage(date);

		const headerMap:any = {
			js: `/*
 * @Author: ${name}
 * @Date: ${date} 
 * @Last Modified by: ${name}
 * @Last Modified time: ${date}
*/\n`,
			ts: 'ts',
			vue: `<!-- @Author ${name} -->\n<!-- @Date: ${date} -->\n<!-- @Last Modified by: ${name} -->\n<!-- @Last Modified time: ${date} -->`
		};
		const filePath = vscode.window.activeTextEditor?.document.fileName + '';
		const extName = filePath.split('.').reverse()[0];


		fs.writeFile(`${vscode.window.activeTextEditor?.document.fileName}`, headerMap[extName], { flag: 'w+' }, err => {
			if (err) {
			  console.error(err);
			  return;
			};
			//文件写入成功。
		});
	});

	context.subscriptions.push(disposable, myCommand, myWebview, myFileHeader);
	
	return {
		hello() {
			return "hello world";
		}
	};
}

// this method is called when your extension is deactivated
export function deactivate() {}

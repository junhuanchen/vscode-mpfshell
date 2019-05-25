
import * as vscode from 'vscode';

import Terminal from './terminal';

let term: Terminal,
	subscriptions: vscode.Disposable[];

export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('Mpfshell Revival!');

	term = new Terminal();

	console.log('Congratulations, your extension "mpfshell" is now active!');

    subscriptions = [
		vscode.commands.registerCommand('mpfshell.open', () => {
		
			term.set_open();
	
		}),
		vscode.commands.registerCommand('mpfshell.runfile', () => {
		
			term.runfile();
	
		}),
		vscode.commands.registerCommand('mpfshell.repl', () => {
		
			term.repl();
	
		}),
		vscode.commands.registerCommand('mpfshell.tools', () => {
		
			term.tools();
	
		})
    ];

	context.subscriptions.push(...subscriptions);
	
}

// this method is called when your extension is deactivated
export function deactivate() {
	
}

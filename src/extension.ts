'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "describe-only-toggle" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.onlyThisTest', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World!');
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const txt = editor.document.getText();
        const replacements: number[] = [];
        const isOnly = txt.indexOf('describe.only(') !== -1;
        const word = isOnly ? 'describe.only(' : 'describe(';
        const replacement = isOnly ? 'describe(' : 'describe.only(';
        while (true) {
            const startPos = replacements.length ? replacements[replacements.length - 1] + 1 : 0;
            const found = txt.indexOf(word, startPos);
            if (found === -1) {
                break;
            }
            replacements.push(found);
        }
        editor.edit(editBuilder => {
            replacements.forEach((pos, idx) => {
                const start = editor.document.positionAt(pos);
                const end = editor.document.positionAt(pos + word.length);
                editBuilder.replace(new vscode.Range(start, end), replacement);
            });
        });
        if (replacements.length) {
            if (isOnly) {
                vscode.window.showInformationMessage(`Disabled running only these tests`);
            } else {
                vscode.window.showInformationMessage(`Enabled running only these tests`);
            }
        } else {
            vscode.window.showErrorMessage('Could not find any describe calls, is this a test file?');
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
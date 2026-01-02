
import * as vscode from 'vscode';
import { CodelCompletionProvider } from './completionProvider';
import * as dotenv from "dotenv";

dotenv.config();


export function activate(context: vscode.ExtensionContext) {
    console.log('AI Autocomplete extension activated!');
	const provider = vscode.languages.registerInlineCompletionItemProvider(
		{pattern: '**' },
		new CodelCompletionProvider()
	);
	context.subscriptions.push(provider);
}

export function deactivate() {}

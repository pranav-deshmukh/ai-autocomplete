import * as vscode from "vscode";
import { getCompletion } from "./apiClient";

export class CodelCompletionProvider
  implements vscode.InlineCompletionItemProvider
{
  private debounceTimer: NodeJS.Timeout | undefined;
  private lastRequestId = 0;

  // Cache variables
  private cachedPrefix = "";
  private cachedSuffix = "";
  private cachedCompletion = "";

  async provideInlineCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.InlineCompletionContext,
    token: vscode.CancellationToken
  ): Promise<vscode.InlineCompletionItem[]> {

    const start = Math.max(0, document.offsetAt(position) - 1000);
    const range = new vscode.Range(document.positionAt(start), position);
    const prefix = document.getText(range);

    const suffixStart = position;

    const suffixEnd = document.positionAt(
      Math.min(
        document.offsetAt(position) + 300, 
        document.getText().length
      )
    );
    const suffixRange = new vscode.Range(suffixStart, suffixEnd);
    const suffix = document.getText(suffixRange);

    if (
      this.cachedPrefix &&
      prefix.endsWith(this.cachedPrefix) &&
      suffix === this.cachedSuffix
    ) {
      console.log(" CACHE HIT! Returning instantly");
      return [
        new vscode.InlineCompletionItem(
          this.cachedCompletion,
          new vscode.Range(position, position)
        ),
      ];
    }

    console.log(" CACHE MISS - making API call");

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    const currentRequestId = ++this.lastRequestId;

    return new Promise((resolve) => {
      this.debounceTimer = setTimeout(async () => {
        if (
          currentRequestId !== this.lastRequestId ||
          token.isCancellationRequested
        ) {
          resolve([]);
          return;
        }

        const completion = await getCompletion(prefix, suffix);

        if (
          currentRequestId !== this.lastRequestId ||
          token.isCancellationRequested ||
          !completion
        ) {
          resolve([]);
          return;
        }

        this.cachedPrefix = prefix;
        this.cachedSuffix = suffix;
        this.cachedCompletion = completion;
        console.log("💾 Saved to cache");

        resolve([
          new vscode.InlineCompletionItem(
            completion,
            new vscode.Range(position, position)
          ),
        ]);
      }, 500);
    });
  }
}

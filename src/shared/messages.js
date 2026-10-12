const vscode = require('vscode');

const LAST_VERSION_KEY =
    'Eldiyar-Dev.simpler-flutter-generator:last-version';
const PENDING_FOCUS = 'Eldiyar-Dev.simpler-flutter-generator:pending-focus';


///--- show welcome message
async function showWelcomeOrWhatsNew(context, version, previousVersion) {
    if (previousVersion !== version) {
        if (vscode.window.state.focused) {
            void context.globalState.update(PENDING_FOCUS, undefined);
            void context.globalState.update(LAST_VERSION_KEY, version);
            void showMessage(version, previousVersion);
        } else {
            // Save pending on window getting focus
            await context.globalState.update(PENDING_FOCUS, true);
            const disposable = vscode.window.onDidChangeWindowState(e => {
                if (!e.focused) {
                    return;
                }

                disposable.dispose();

                // If the window is now focused and we are pending the welcome, clear the pending state and show the welcome
                if (context.globalState.get(PENDING_FOCUS) === true) {
                    void context.globalState.update(PENDING_FOCUS, undefined);
                    void context.globalState.update(LAST_VERSION_KEY, version);
                    void showMessage(version, previousVersion);
                }
            });

            context.subscriptions.push(disposable);
        }
    }
}


///--- show message component
async function showMessage(version, previousVersion) {
    const whatsNew = { title: "What's New" };
    const writeReview = { title: '★ Write a review' };
    const actions = [writeReview];

    if (previousVersion) {
        actions.unshift(whatsNew);
    }

    const message = previousVersion
        ? `Simpler Flutter Generator 😅 has been updated to v${version}!!`
        : 'Thanks for using Simpler Flutter Generator — have a great day at work! 😉 Brooo,';

    const result = await vscode.window.showInformationMessage(message, ...actions);

    if (result !== null) {
        if (result === whatsNew) {
            await vscode.env.openExternal(
                vscode.Uri.parse(
                    'https://marketplace.visualstudio.com/items/Eldiyar-Dev.simpler-flutter-generator/changelog'
                )
            );
        } else if (result === writeReview) {
            await vscode.env.openExternal(
                vscode.Uri.parse('https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-generator')
            );
        }
    }
}


function informAboutNewVersion() {
	vscode.window.showInformationMessage('🔥A new version of "Simpler Flutter Generator" 🔥 is available. Please update for the latest features and improvements.✅', 'Update Now')
	  .then(selection => {
		if (selection === 'Update Now') {
			vscode.commands.executeCommand('workbench.extensions.search', 'Eldiyar-Dev.simpler-flutter-generator');
		}
	  });
  }
module.exports = {
    LAST_VERSION_KEY: LAST_VERSION_KEY,
    showWelcomeOrWhatsNew: showWelcomeOrWhatsNew,
    informAboutNewVersion: informAboutNewVersion,
}
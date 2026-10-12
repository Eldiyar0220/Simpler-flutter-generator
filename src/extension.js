const vscode = require('vscode');
const helperMessage = require('./shared/messages');
const { registerCommands } = require('./commands');
const { codeLens } = require('./features/code_lens/code_lens');

function activate(context) {
	registerCommands(context);

	const currentSimplerTasksVersion = '1.3.2';
	const previousVersion = context.globalState.get(helperMessage.LAST_VERSION_KEY);
	const extensionData = vscode.extensions.getExtension('Eldiyar-Dev.simpler-flutter-generator');
	const currentVersion = extensionData.packageJSON.version;
	if (currentVersion != currentSimplerTasksVersion) {
		vscode.window.showInformationMessage(`Update Simpler Flutter Generator -> v: ${currentSimplerTasksVersion}`);
		helperMessage.informAboutNewVersion();
	}
	helperMessage.showWelcomeOrWhatsNew(context, currentVersion, previousVersion);

	codeLens(context);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate,
};

const vscode = require('vscode');
const helperMessage = require('./shared/messages');
const { registerCommands } = require('./commands');
const { codeLens } = require('./features/code_lens/code_lens');

const LATEST_VERSION = '2.0.0';

function isNewer(latest, current) {
	const a = String(latest).split('.').map(Number);
	const b = String(current).split('.').map(Number);
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		const diff = (a[i] || 0) - (b[i] || 0);
		if (diff !== 0) {
			return diff > 0;
		}
	}
	return false;
}

function activate(context) {
	registerCommands(context);

	const previousVersion = context.globalState.get(helperMessage.LAST_VERSION_KEY);
	const currentVersion = context.extension.packageJSON.version;
	if (isNewer(LATEST_VERSION, currentVersion)) {
		vscode.window.showInformationMessage(`Update Simpler Flutter Generator -> v: ${LATEST_VERSION}`);
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

const vscode = require('vscode');

const TASKS_EXTENSION_ID = 'Eldiyar-Dev.simpler-flutter-tasks';

const TASKS_PAGES = {
	settings: ['flutter-tasks.openSettingsPanel'],
	statusBar: ['flutter-tasks.openSettingsPanel', { section: 'statusBar' }],
	customCommands: ['flutter-tasks.openSettingsPanel', { section: 'customCommands' }],
	menu: ['flutter-tasks.commandsMenu'],
	sidebar: ['workbench.view.extension.flutter-commands-container'],
};

function isTasksInstalled() {
	return vscode.extensions.all.some((extension) => extension.id.toLowerCase() === TASKS_EXTENSION_ID.toLowerCase());
}

async function openTasksMarketplace() {
	await vscode.commands.executeCommand('workbench.extensions.search', `@id:${TASKS_EXTENSION_ID}`);
	try {
		await vscode.commands.executeCommand('extension.open', TASKS_EXTENSION_ID);
	} catch (_error) {
		// The details page needs the extension in the editor's gallery; the Extensions view stays open anyway.
	}
}

async function openTasks(page) {
	if (!isTasksInstalled()) {
		await openTasksMarketplace();
		vscode.window.showInformationMessage('Установите Simpler Flutter Tasks, чтобы открыть этот раздел.');
		return;
	}
	const [command, ...args] = TASKS_PAGES[page] || TASKS_PAGES.settings;
	await vscode.commands.executeCommand(command, ...args);
}

/** Returns true when the message belonged to the Simpler Flutter Tasks card. */
async function handleTasksMessage(message) {
	switch (message.type) {
		case 'openTasks':
			await openTasks(message.page);
			return true;
		case 'openTasksMarketplace':
			await openTasksMarketplace();
			return true;
		default:
			return false;
	}
}

module.exports = {
	isTasksInstalled,
	handleTasksMessage,
};

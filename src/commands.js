const vscode = require('vscode');
const { generatorAssets } = require('./features/assets/generate');
const { buildRunnerWithFilter } = require('./features/build_runner/build_runner');
const { generateFilesAndFolders } = require('./features/architecture/generate');
const { openMenu, openConfigurator } = require('./features/configurator/panel');
const { isTasksInstalled } = require('./features/configurator/tasks');

const folderDialogOptions = {
	canSelectMany: false,
	canSelectFiles: false,
	canSelectFolders: true,
};

async function pickFolder(inUri) {
	if (inUri !== undefined) {
		return inUri;
	}

	const userUri = await vscode.window.showOpenDialog(folderDialogOptions);
	if (userUri === undefined) {
		vscode.window.showErrorMessage('Aborted');
		return undefined;
	}

	return userUri[0];
}

function registerCommands(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand('simpler_flutter_generator.generateImages', generatorAssets)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('simpler_flutter_generator.build_runner_with_filter', async (inUri) => {
			const uri = await pickFolder(inUri);
			if (!uri) {
				return;
			}
			buildRunnerWithFilter(uri.fsPath, false);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('simpler_flutter_generator.build_runner_with_filter_editor', async (inUri) => {
			const uri = await pickFolder(inUri);
			if (!uri) {
				return;
			}

			const lastIndex = uri.fsPath.lastIndexOf('/');
			const result = uri.fsPath.substring(0, lastIndex);
			buildRunnerWithFilter(result, true);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('simpler_flutter_generator.openMenu', () => {
			openMenu(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('simpler_flutter_generator.openConfigurator', () => {
			openConfigurator(context);
		})
	);

	const studioButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	studioButton.text = '$(home) GENERATOR';
	studioButton.tooltip = 'Simpler Flutter Generator — главное меню';
	studioButton.command = 'simpler_flutter_generator.openMenu';
	context.subscriptions.push(studioButton);

	const syncStudioButton = () => {
		if (isTasksInstalled()) {
			studioButton.hide();
		} else {
			studioButton.show();
		}
	};
	syncStudioButton();
	context.subscriptions.push(vscode.extensions.onDidChange(syncStudioButton));

	context.subscriptions.push(
		vscode.commands.registerCommand('simpler_flutter_generator.generateFromYaml', async (inUri) => {
			const uri = await pickFolder(inUri);
			if (!uri) {
				return;
			}
			generateFilesAndFolders(uri);
		})
	);
}

module.exports = {
	registerCommands,
};

const vscode = require('vscode');
const path = require('path');


/**
 * @param {vscode.ExtensionContext} context
 */


const helperMessage = require('./flutter_helpers/utils/helper_message/helper.message');
const { generatorAssets } = require('./flutter_helpers/assets_generator/out_put_code');
const { buildRunnerWithFilter } = require('./flutter_helpers/build_runner_with_filter/build_runner_with_filter');
const { generateFilesAndFolders } = require('./flutter_helpers/dynamic_generator/dynamic_generator');
const { codeLens } = require('./flutter_helpers/code_lens/code_lens');


getWorkspace = () => {
	const folders = vscode.workspace.workspaceFolders ?? []
	const rootPath = path.normalize(folders[0]?.uri?.path ?? ``)
	// fix win32 path bug
	if (process.platform === "win32" && rootPath.startsWith(path.sep)) {
		return rootPath.slice(1)
	} else {
		return rootPath
	}
};

function activate(context) {
	///---- generator assets	
	context.subscriptions.push(
		vscode.commands.registerCommand('simpler_flutter_generator.generateImages', generatorAssets,)
	)

	context.subscriptions.push(
		vscode.commands.registerCommand('simpler_flutter_generator.build_runner_with_filter', async (inUri) => {
			const openOpts = { canSelectMany: false, canSelectFiles: false, canSelectFolders: true };
			let uri;
			if (inUri === undefined) {
				const userUri = await vscode.window.showOpenDialog(openOpts);
				if (userUri === undefined) {
					vscode.window.showErrorMessage("Aborted");
					return;
				}
				uri = userUri[0];
			} else {
				uri = inUri;
			}
			buildRunnerWithFilter(uri.fsPath, false)
		},
		)
	)

	context.subscriptions.push(
		vscode.commands.registerCommand('simpler_flutter_generator.build_runner_with_filter_editor', async (inUri) => {
			const openOpts = { canSelectMany: false, canSelectFiles: false, canSelectFolders: true };
			let uri;
			if (inUri === undefined) {
				const userUri = await vscode.window.showOpenDialog(openOpts);
				if (userUri === undefined) {
					vscode.window.showErrorMessage("Aborted");
					return;
				}
				uri = userUri[0];
			} else {
				uri = inUri;
			}
			let lastIndex = uri.fsPath.lastIndexOf('/');

			// Extract the substring up to the last '/'
			let result = uri.fsPath.substring(0, lastIndex);

			// Extract the substring up to the last '/'

			console.log(`result ${result}`)
			buildRunnerWithFilter(result, true)
			//file:///Users/admin/Desktop/Eldar/learning_language/lib/feature/settings/presentation/widgets/courses

		},
		)
	)
	///---- show welcome message and update // do not forget
	const currentSimplerTasksVersion = '1.3.3';
	const previousVersion = context.globalState.get(helperMessage.LAST_VERSION_KEY);
	const extensionData = vscode.extensions.getExtension('Eldiyar-Dev.simpler-flutter-generator');
	const currentVersion = extensionData.packageJSON.version;
	if (currentVersion != currentSimplerTasksVersion) {
		vscode.window.showInformationMessage(`Update Simpler Flutter Generator -> v: ${currentSimplerTasksVersion}`);
		helperMessage.informAboutNewVersion()
	}
	helperMessage.showWelcomeOrWhatsNew(context, currentVersion, previousVersion);

	///---- Generate From Yaml File
	context.subscriptions.push(
		vscode.commands.registerCommand('simpler_flutter_generator.generateFromYaml', async (inUri) => {
			const openOpts = { canSelectMany: false, canSelectFiles: false, canSelectFolders: true };
			let uri;
			if (inUri === undefined) {
				const userUri = await vscode.window.showOpenDialog(openOpts);
				if (userUri === undefined) {
					vscode.window.showErrorMessage("Aborted");
					return;
				}
				uri = userUri[0];
			} else {
				uri = inUri;
			}

			generateFilesAndFolders(uri)

		})
	);

	/// Code Lens 
	codeLens(context)


	// let disposable = vscode.commands.registerCommand('simpler_flutter_generator.enableCodeLensCommand', function () {
	// 	vscode.window.showInformationMessage('CodeLens Command Executed');
	// });

	// context.subscriptions.push(disposable);

	// // Dynamically change title based on active editor
	// vscode.window.onDidChangeActiveTextEditor(editor => {
	// 	if (editor) {
	// 		const fileName = editor.document.fileName;

	// 		if (editor.document.languageId === 'dart') {
	// 			vscode.commands.executeCommand('setContext', 'CustomTitle', false);
	// 		} else if (editor.document.languageId === 'yaml' && fileName.includes('simpler_generator_images.yaml')) {
	// 			vscode.commands.executeCommand('setContext', 'CustomTitle', true);
	// 		}
	// 	}
	// });



}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}







// https://dev.azure.com/ebolotov904/
// token 
// zfblp7ncmthfvas43dpkkzgckbdf43shjzlwjcjvsv53jvnbvm7ja
// node_modules/.bin/vsce login Eldiyar-Dev
// node_modules/.bin/vsce publish 
// 



// npm 

// npm install -g @vscode/vsce

// npm install vsce or npm install vsce -g

// node_modules/.bin/vsce login


// vscode.commands.executeCommand('setContext', 'explorerResourceIsFolder', true).then(() => {
//   console.log('Set explorerResourceIsFolder context to true');
// }, (error) => {
//   console.error('Error setting explorerResourceIsFolder context:', error);
// });


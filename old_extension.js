// const vscode = require('vscode');

// /**
//  * @param {vscode.ExtensionContext} context
//  */

// const path = require('path');
// const fs = require('fs');
// const yaml = require('js-yaml');

// const { flutterRepository } = require('./flutter_helpers/data/repository/repository');
// const { flutterDomain } = require('./flutter_helpers/domain/domain');
// const { flutterBlocList } = require('./flutter_helpers/presentation/bloc/bloc');
// const { flutterPages } = require('./flutter_helpers/presentation/pages/presentation');
// const { toSnake, toPascalCase } = require('./flutter_helpers/utils/re_case/re_cases');
// const helperMessage = require('./flutter_helpers/utils/helper_message/helper.message');
// const { generatorAssets } = require('./flutter_helpers/assets_generator/out_put_code');
// const { flutterRepositoryMega } = require('./flutter_helpers/data/repository');


// const { generateFilesAndFolders } = require('./flutter_helpers/dynamic_generator/dynamic_generator');


// getWorkspace = () => {
// 	const folders = vscode.workspace.workspaceFolders ?? []
// 	const rootPath = path.normalize(folders[0]?.uri?.path ?? ``)
// 	// fix win32 path bug
// 	if (process.platform === "win32" && rootPath.startsWith(path.sep)) {
// 		return rootPath.slice(1)
// 	} else {
// 		return rootPath
// 	}
// };

// function activate(context) {
// 	const commandSimplerFlutterGenerator = vscode.workspace.getConfiguration('SimplerFlutterGenerator')
// 	///---- generator assets	
// 	context.subscriptions.push(
// 		vscode.commands.registerCommand('simpler_flutter_generator.generateImages', generatorAssets)
// 	)
// 	///---- show welcome message
// 	const previousVersion = context.globalState.get(helperMessage.LAST_VERSION_KEY);
// 	const extensionData = vscode.extensions.getExtension('Eldiyar-Dev.simpler-flutter-generator');
// 	const currentVersion = extensionData.packageJSON.version;
// 	helperMessage.showWelcomeOrWhatsNew(context, currentVersion, previousVersion);

// 	///---- Create Folders simpler_flutter_generator.createSimpleFolders
// 	context.subscriptions.push(
// 		vscode.commands.registerCommand('simpler_flutter_generator.createSimpleFolders', async (inUri) => {

// 			const nameOpts = {
// 				prompt: "Choose a name for your class",
// 				validateInput: async (value) => {
// 					return /^[0-9a-zA-Z_]+$/g.test(value) ? null : "It is not a valid class name !";
// 				}
// 			};
// 			const name = await vscode.window.showInputBox(nameOpts);
// 			if (name === undefined) {
// 				vscode.window.showErrorMessage("Aborted");
// 				return;
// 			}

// 			const openOpts = { canSelectMany: false, canSelectFiles: false, canSelectFolders: true };
// 			let uri;
// 			if (inUri === undefined) {
// 				const userUri = await vscode.window.showOpenDialog(openOpts);
// 				if (userUri === undefined) {
// 					vscode.window.showErrorMessage("Aborted");
// 					return;
// 				}
// 				uri = userUri[0];
// 			} else {
// 				uri = inUri;
// 			}

// 			const folderNames = ['data', 'data/models', 'data/repository', 'domain', 'presentation', 'presentation/pages', 'presentation/bloc'];
// 			const blocType = commandSimplerFlutterGenerator.get('Generator');
// 			const architectureHehe = commandSimplerFlutterGenerator.get('not');
// 			let interactorPath
// 			let repoPath
// 			console.log(`architectureHehe ${architectureHehe}`)
// 			folderNames.forEach((folderName) => {
// 				const folderPath = path.join(uri.fsPath, folderName);

// 				try {
// 					if (!fs.existsSync(folderPath)) {
// 						fs.mkdirSync(folderPath);
// 					}
// 					switch (folderName) {
// 						case 'data/repository':
// 							const fileName2 = `${toSnake(name)}_repository.dart`;
// 							const filePath2 = path.join(uri.fsPath, folderName, fileName2);
// 							fs.writeFileSync(filePath2, architectureHehe === true ? flutterRepositoryMega(name) : '');
// 							repoPath = filePath2
// 							break;
// 						case 'presentation/pages' || 'presentation/ui':
// 							const pageFileName = `${toSnake(name)}_page.dart`;
// 							const pageFilePath = path.join(uri.fsPath, folderName, pageFileName);
// 							fs.writeFileSync(pageFilePath, '');
// 							vscode.window.showInformationMessage(`Created file and added Dart code: ${pageFilePath}`);
// 							break;
// 						case 'domain':
// 							const liber = vscode.workspace.workspaceFolders[0].uri.fsPath + '/lib'
// 							const pahtProject = vscode.workspace.workspaceFolders[0].uri.fsPath
// 							const mainUrlIndexes = repoPath.indexOf(liber);
							
// 							let importPath2;
// 							if (mainUrlIndexes !== -1) {
// 								importPath2 = repoPath.substring(mainUrlIndexes + liber.length);
// 							} else {
// 								vscode.window.showInformationMessage(`Main URL not found in the filePath`);
// 							}

// 							const dist2 = vscode.workspace.workspaceFolders[0].uri.fsPath;

// 							//Pabspec
// 							const yamlFilePathPabspecDomain = path.join(dist2, 'pubspec.yaml');
// 							let yamlConfigPabspecDomain
// 							if (fs.existsSync(yamlFilePathPabspecDomain)) {
// 								yamlConfigPabspecDomain = yaml.load(fs.readFileSync(yamlFilePathPabspecDomain, 'utf8'));
// 							}

// 							console.log(`domain ${importPath2}`)

// 							const fileName1 = `${toSnake(name)}_interactor.dart`;
// 							const filePath1 = path.join(uri.fsPath, folderName, fileName1);
// 							fs.writeFileSync(filePath1, architectureHehe === true ? flutterDomain(name, yamlConfigPabspecDomain != undefined ? yamlConfigPabspecDomain.name : '', importPath2) : '');
// 							interactorPath = filePath1
// 							break;
// 						case 'data/models':
// 							const fileName3 = `${toSnake(name)}_response.dart`;
// 							const filePath3 = path.join(uri.fsPath, folderName, fileName3);
// 							fs.writeFileSync(filePath3, '');
// 							break;
// 						case 'presentation/bloc':
// 							console.log(`heeey  ${interactorPath}`)
// 							const path45 = vscode.workspace.workspaceFolders[0].uri.fsPath + '/lib'
// 							const path46 = vscode.workspace.workspaceFolders[0].uri.fsPath
// 							const mainUrlIndex = interactorPath.indexOf(path45);
// 							console.log(`heeey 2 ${mainUrlIndex}`)
// 							const parts = path46.split('/');
// 							const projectName = parts[parts.length - 1];
// 							let importPath;
// 							if (mainUrlIndex !== -1) {
// 								importPath = interactorPath.substring(mainUrlIndex + path45.length);
// 							} else {
// 								vscode.window.showInformationMessage(`Main URL not found in the filePath`);
// 							}

// 							const dist = vscode.workspace.workspaceFolders[0].uri.fsPath;

// 							//Pabspec
// 							const yamlFilePathPabspec = path.join(dist, 'pubspec.yaml');
// 							let yamlConfigPabspec
// 							if (fs.existsSync(yamlFilePathPabspec)) {
// 								yamlConfigPabspec = yaml.load(fs.readFileSync(yamlFilePathPabspec, 'utf8'));
// 							}

// 							// console.log(`Project Name ${yamlConfigPabspec.name}`)

// 							console.log(`heeey 3 ${importPath}`)
// 							if (blocType !== 'do not create bloc') {
// 								flutterBlocList(blocType ?? 'simpleBloc', name, importPath, yamlConfigPabspec != undefined ? yamlConfigPabspec.name : '').forEach(({ fileName, dartCode }) => {
// 									const filePath = path.join(uri.fsPath, folderName, fileName);
// 									try {
// 										fs.writeFileSync(filePath, architectureHehe === true ? dartCode : '');
// 									} catch (err) {
// 										vscode.window.showErrorMessage(`Error creating file: ${fileName} - ${err.message}`);
// 									}
// 								});
// 							}

// 							break;
// 					}
// 				} catch (err) {
// 					vscode.window.showErrorMessage(`Error creating ${folderName === 'presentation/pages' ? 'file' : 'folder'}: ${folderName} - ${err.message}`);
// 				}
// 			});
// 		})
// 	);

// 	///----

// 	context.subscriptions.push(
// 		vscode.commands.registerCommand('simpler_flutter_generator.generateFromYaml', async (inUri) => {
// 			const openOpts = { canSelectMany: false, canSelectFiles: false, canSelectFolders: true };
// 			let uri;
// 			if (inUri === undefined) {
// 				const userUri = await vscode.window.showOpenDialog(openOpts);
// 				if (userUri === undefined) {
// 					vscode.window.showErrorMessage("Aborted");
// 					return;
// 				}
// 				uri = userUri[0];
// 			} else {
// 				uri = inUri;
// 			}

// 			generateFilesAndFolders(uri)

// 		})
// 	);

// }

// function deactivate() { }

// module.exports = {
// 	activate,
// 	deactivate
// }






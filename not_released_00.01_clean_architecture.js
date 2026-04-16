// const fs = require('fs');
// const path = require('path');
// const yaml = require('js-yaml');
// const vscode = require('vscode');

// async function generateFilesAndFolders(uri) {
//     try {
       

//         const dist = vscode.workspace.workspaceFolders[0].uri.fsPath;

//         const yamlFilePath = path.join(dist, 'test_dynamic_generator.yaml');
//         if (fs.existsSync(yamlFilePath)) {
//             const nameOpts = {
//                 prompt: "Choose a name for your Feature",
//                 validateInput: async (value) => {
//                     return /^[0-9a-zA-Z_]+$/g.test(value) ? null : "It is not a valid class name!";
//                 }
//             };
//             const name = await vscode.window.showInputBox(nameOpts);
//             if (name === undefined) {
//                 vscode.window.showErrorMessage("Aborted");
//                 return;
//             }
//             const yamlConfig = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));
//             if (yamlConfig.generate) {
//                 for (const entry of yamlConfig.generate) {
//                     if (entry.category) {
//                         const categoryPath = path.join(uri.fsPath, entry.category);
//                         createFolderRecursively(categoryPath); // Create category folder

//                         if (entry.contents) {
//                             processContents(entry.contents, categoryPath, name); // Pass 'name'
//                         }
//                     }
//                 }
//             }
//         } else {
//             const options = {
//                 modal: true,
//             };
//             vscode.window.showInformationMessage('test_dynamic_generator.yaml\ndoes not exist in the project directory.', options, 'Create File')
//                 .then(async (selectedButton) => {
//                     if (selectedButton === 'Create File') {
//                         const newFilePath = path.join(dist, 'test_dynamic_generator.yaml');
//                         fs.writeFileSync(newFilePath, templateYAML);
//                         vscode.window.showInformationMessage(`Yaml File Successfully Created 😜`);
//                     }
//                 });
//         }
//     } catch (error) {
//         vscode.window.showInformationMessage(`error: ${error}`);
//     }
// }

// function processContents(contents, baseDir, name) {
//     for (const entry of contents) {
//         if (entry.folder) {
//             const folderPath = path.join(baseDir, entry.folder.replace(/NAME/g, name)); // Replace 'NAME' with 'name'
//             createFolderRecursively(folderPath); // Create content folder

//             if (entry.contents) {
//                 processContents(entry.contents, folderPath, name); // Pass 'name'
//             }
//         }
//         if (entry.file) {
//             createFile(entry.file.replace(/NAME/g, name), baseDir); // Replace 'NAME' with 'name'
//         }
//     }
// }

// function createFolderRecursively(folderPath) {
//     if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath, { recursive: true });
//         console.log(`Created folder: ${folderPath}`);
//     }
// }

// function createFile(fileName, folderPath) {
//     const filePath = path.join(folderPath, fileName);
//     fs.writeFileSync(filePath, '');
//     console.log(`Created file: ${filePath}`);
// }

// module.exports = {
//     generateFilesAndFolders
// }

// const templateYAML = `
// # ------------------------------------------------------------- start
// generate:
// # --Data------------------------------------------------------
//   - category: data
//     contents:
//       - folder: data_source
//         contents:
//           - file: NAME_local_data_source.dart
//           - file: NAME_remote_data_source.dart
//       - folder: models
//         contents:
//           - file: NAME_model.dart
//       - folder: repositories
//         contents:
//           - file: NAME_repository.dart
// # ---Domain----------------------------------------------------          
//   - category: domain
//     contents:
//       - folder: entities
//         contents:
//           - file: NAME_entity.dart
//       - folder: repositories
//         contents:
//           - file: NAME_repository.dart
//       - folder: usecase
//         contents:
//           - file: NAME_usecase.dart
// # --Presentation-----------------------------------------------
//   - category: presentation
//     contents:
//       - folder: widgets
//       - folder: pages
//         contents:
//           - file: NAME_page.dart
//       - folder: bloc
//         contents:
//           - file: NAME_bloc.dart
//           - file: NAME_event.dart
//           - file: NAME_state.dart
// # ------------------------------------------------------------- end

// `;

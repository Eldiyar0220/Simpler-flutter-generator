
const vscode = require('vscode');
const { PubspecCodeLensProvider, openPackageUrl } = require('./pubspec_provider');
const { BuildrunnerCodeLensProvider } = require('./build_runner_provider');
const { buildRunnerWithFilter } = require('../build_runner/build_runner');
const { showInformationWithProgressAndTimeout } = require("../../shared/loading");
const codeLensConfig = vscode.workspace.getConfiguration('SimplerFlutterGenerator');
let changeTheCodeLens = codeLensConfig.get('enableCodeLens')


function toggleCodeLens(context) {
    changeTheCodeLens = !changeTheCodeLens
    codeLensConfig.update('enableCodeLens', changeTheCodeLens, vscode.ConfigurationTarget.Global);
    showInformationWithProgressAndTimeout(`Updating enableCodeLens ${changeTheCodeLens ? '✅' : '❌'}`, 10)
}

let pubspecCodeLensProvider;
let buildRunnerCodeLensProvider;

function codeLens(context) {
    vscode.commands.registerCommand('simpler_flutter_generator.enableCodeLensCommand', () => {
        toggleCodeLens(context);
    });

    pubspecCodeLensProvider = new PubspecCodeLensProvider();
    buildRunnerCodeLensProvider = new BuildrunnerCodeLensProvider();

    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider('yaml', pubspecCodeLensProvider)
    );


    ///Open Urls fo Packages
    vscode.commands.registerTextEditorCommand(
        'simplerFlutterGenerator.viewDependencyFlutter',
        async (textEditor, edit, ...args) => {
            let [packageName] = args;

            if (!packageName || typeof packageName !== 'string') {
                vscode.window.showErrorMessage('Invalid package name.');
                return;
            }

            openPackageUrl(packageName);
        }
    );
    
    vscode.commands.registerTextEditorCommand(
        'simplerFlutterGenerator.updateDependency',
        async (textEditor, edit, packageName, currentVersion, version, documentUri) => {
            if (!packageName || typeof packageName !== 'string') {
                vscode.window.showErrorMessage('Invalid package name.');
                return;
            }
    
            // Открываем документ
            const document = await vscode.workspace.openTextDocument(documentUri);
            const text = document.getText();
    
            // Ищем строку с зависимостью, учитывая знак `+` в версии
            const regex = new RegExp(`(${packageName}: \\^${currentVersion.replace(/\+/g, '\\+')})`);
            const newText = text.replace(regex, `${packageName}: ^${version}`);
    
            if (newText === text) {
                vscode.window.showErrorMessage(`Dependency ${packageName} with version ^${currentVersion} not found.`);
                return;
            }
    
            // Начинаем редактирование
            const workspaceEdit = new vscode.WorkspaceEdit();
            workspaceEdit.replace(
                documentUri,
                new vscode.Range(document.positionAt(0), document.positionAt(text.length)),
                newText
            );
            await vscode.workspace.applyEdit(workspaceEdit);
    
            // Сохраняем изменения
            await document.save();
            vscode.window.showInformationMessage(`Updated ${packageName} to version ${version}`);
        }
    );

    /// code lens build runner
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider('dart', buildRunnerCodeLensProvider)
    );


    vscode.commands.registerTextEditorCommand(
        'simpler_flutter_generator.build_runner_with_filter_from_code_lens',
        async (textEditor, edit, ...args) => {
            const { document } = textEditor;
            if (document.languageId !== 'dart') {
                vscode.window.showErrorMessage('This command is only available for Dart files.');
                return;
            }

            const fsPath = document.uri.fsPath;

            let lastIndex = fsPath.lastIndexOf('/');

            // Extract the substring up to the last '/'
            let result = fsPath.substring(0, lastIndex);
            // Now you have fsPath, you can use it as needed
            buildRunnerWithFilter(result, true);
        }
    );
}

module.exports = {
    codeLens
}
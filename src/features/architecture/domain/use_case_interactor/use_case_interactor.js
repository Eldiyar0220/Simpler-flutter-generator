const { toPascalCase } = require('../../../../shared/case');

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const vscode = require('vscode');
const dist = vscode.workspace.workspaceFolders[0].uri.fsPath;

const yamlFilePath = path.join(dist, 'simpler_generator_folders.yaml');

const flutterUseCaseInteractor = (className, name) => {
    const yamlConfig = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));
    let isUsecase = yamlConfig.usecase ?? false
    let page
    if (isUsecase === true) {
        page = `
class ${toPascalCase(className)} {
\t${toPascalCase(className)}({required this.repository});
\tfinal ${toPascalCase(name)}Repository repository;
}
            `
    } else {
        page = ``
    }

    return page;
}


module.exports = {
    flutterUseCaseInteractor
};
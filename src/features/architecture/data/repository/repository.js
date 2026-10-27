const { toPascalCase } = require('../../../../shared/case');

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const vscode = require('vscode');


const yamlFilePath = () => path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'simpler_generator_folders.yaml');

const flutterRepository = (className, inputBox) => {
    const yamlConfig = yaml.load(fs.readFileSync(yamlFilePath(), 'utf8'));
    let dataRepository = yamlConfig.dataRepository ?? false
    let page
    if (dataRepository === true) {

        page = `
class ${toPascalCase(className)} implements ${toPascalCase(inputBox)}Repository {
    final ${toPascalCase(inputBox)}RemoteDataSource remoteDataSource;
    final ${toPascalCase(inputBox)}LocalDataSource localDataSource;
}
          `
    } else {
        page = ``
    }

    return page;
}


module.exports = {
    flutterRepository
};

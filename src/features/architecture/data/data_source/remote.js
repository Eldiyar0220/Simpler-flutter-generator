const { toPascalCase } = require('../../../../shared/case');

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const vscode = require('vscode');
const dist = vscode.workspace.workspaceFolders[0].uri.fsPath;


const yamlFilePath = path.join(dist, 'simpler_generator_folders.yaml');

const dataRemote = (className, inputBox) => {
    const yamlConfig = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));
    let dataSource = yamlConfig.dataSource ?? false
    let page
    if (dataSource === true) {

        page = `
abstract class ${toPascalCase(className)} {}
  
class ${toPascalCase(className)}Impl implements ${toPascalCase(className)} {}
          `
    } else {
        page = ``
    }

    return page;
}


module.exports = {
    dataRemote
};

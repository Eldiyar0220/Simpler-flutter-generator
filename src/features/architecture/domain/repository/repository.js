const { toPascalCase } = require('../../../../shared/case');

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const vscode = require('vscode');
const dist = vscode.workspace.workspaceFolders[0].uri.fsPath;


const yamlFilePath = path.join(dist, 'simpler_generator_folders.yaml');

const flutterDomainRepository = (className) => {
    const yamlConfig = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));
    let domainRepository = yamlConfig.domainRepository ?? false
    let page
    if (domainRepository === true) {

        page = `abstract class ${toPascalCase(className)} {}`
    } else {
        page = ``
    }

    return page;
}


module.exports = {
    flutterDomainRepository
};
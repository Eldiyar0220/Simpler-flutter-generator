const { toPascalCase } = require('../../../../shared/case');

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const vscode = require('vscode');


const yamlFilePath = () => path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'simpler_generator_folders.yaml');

const dataModel = (className, inputbox) => {
    const yamlConfig = yaml.load(fs.readFileSync(yamlFilePath(), 'utf8'));
    let dataModel = yamlConfig.dataModel ?? false
    let page
    if (dataModel === true) {

        page = `
class ${toPascalCase(className)} extends ${toPascalCase(inputbox)}Entity {
    ${toPascalCase(className)}({
    required String data,
    }) : super(data: data);

    factory ${toPascalCase(className)}.fromJson(Map<String, dynamic> json) {
    return ${toPascalCase(className)}(
        data: json['data'],
    );
    }

    Map<String, dynamic> toJson() {
    return {
        'data': data,
    };
    }
}
        
          `
    } else {
        page = ``
    }

    return page;
}


module.exports = {
    dataModel
};

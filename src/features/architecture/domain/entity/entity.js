const { toPascalCase } = require('../../../../shared/case');

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const vscode = require('vscode');
const dist = vscode.workspace.workspaceFolders[0].uri.fsPath;


const yamlFilePath = path.join(dist, 'simpler_generator_folders.yaml');

const entityModel = (className) => {
    const yamlConfig = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));
    let entityModel = yamlConfig.entityModel ?? false
    let page
    if (entityModel === true) {

        page = `
import 'package:equatable/equatable.dart';

class ${toPascalCase(className)} extends Equatable {
    ${toPascalCase(className)}({
      required this.data,
    });
    final String data;
  
  
    @override
    List<Object> get props => [data];
  }
  
          `
    } else {
        page = ``
    }

    return page;
}


module.exports = {
    entityModel
};

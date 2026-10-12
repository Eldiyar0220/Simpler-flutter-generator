
const { toPascalCase } = require('../../../../shared/case');

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const vscode = require('vscode');
const dist = vscode.workspace.workspaceFolders[0].uri.fsPath;
const { showInformationWithProgressAndTimeout } = require('../../../../shared/loading');

let stateWIdgetConfig = vscode.workspace.getConfiguration('SimplerFlutterGenerator').get('stateWidget');
let createStateWidgetVariable = vscode.workspace.getConfiguration('SimplerFlutterGenerator').get('createStateWidget');


vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('SimplerFlutterGenerator.stateWidget')) {
        stateWIdgetConfig = vscode.workspace.getConfiguration('SimplerFlutterGenerator').get('stateWidget');
        showInformationWithProgressAndTimeout(`Widget Type ${stateWIdgetConfig} 👍`, 15)
    }
    if (e.affectsConfiguration('SimplerFlutterGenerator.createStateWidget')) {
        createStateWidgetVariable = vscode.workspace.getConfiguration('SimplerFlutterGenerator').get('createStateWidget');
        showInformationWithProgressAndTimeout(`Create Widget ${createStateWidgetVariable} 👍`, 15)
    }
});
const yamlFilePath = path.join(dist, 'simpler_generator_folders.yaml');
const flutterPages = (className) => {
    const yamlConfig = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));

    let page

    if (createStateWidgetVariable) {
        if (stateWIdgetConfig.toLowerCase() === 'statefullwidget') {
            page = `
import 'package:flutter/material.dart';

class ${toPascalCase(className)} extends StatefulWidget {
\t\tconst ${toPascalCase(className)}({super.key});
\t\t@override
\t\tState<${toPascalCase(className)}> createState() => _${toPascalCase(className)}State();
}

class _${toPascalCase(className)}State extends State<${toPascalCase(className)}> {
\t@override
\tWidget build(BuildContext context) {
\t\treturn Scaffold(
\t\t\tappBar: AppBar(
\t\t\t\ttitle: const Text('${toPascalCase(className)}'),
\t\t\t),
\t\t\tbody: Column(
\t\t\t\tchildren: [
\t\t\t\t\tContainer(),
\t\t\t\t],
\t\t\t),
\t\t);
\t}
}
        `
        } else if (stateWIdgetConfig.toLowerCase() === 'statelesswidget') {


            page = `

import 'package:flutter/material.dart';

class ${toPascalCase(className)} extends StatelessWidget {
\tconst ${toPascalCase(className)}({super.key});
\t@override
\tWidget build(BuildContext context) {
\t\treturn Scaffold(
\t\t\tappBar: AppBar(
\t\t\t\ttitle: const Text('${toPascalCase(className)}'),
\t\t\t),
\t\t\tbody: Column(
\t\t\t\tchildren: [
\t\t\t\t\tContainer(),
\t\t\t\t],
\t\t\t),
\t\t);
\t}
}
    `
        } else if (stateWIdgetConfig.toLowerCase() === 'empty') {
            page = ``
        } else {
            page = `//Create Page`

        }
    } else {
        page = ``
    }
    return page;
}


module.exports = {
    flutterPages
};
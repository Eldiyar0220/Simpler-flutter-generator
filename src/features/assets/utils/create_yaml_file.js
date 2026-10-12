const vscode = require("vscode");
const fs = require("fs");
const { yamlTemplate } = require("../templates/yaml_template");
const customPath = require("../../../shared/root_path");

function createYamlFile() {
    const options = {
        modal: true,
    };
    vscode.window.showInformationMessage('simpler_generator_images.yaml\ndoes not exist in the project directory.', options, 'Create File')
        .then((selectedButton) => {
            if (selectedButton === 'Create File') {
                const newFilePath = customPath.join(customPath.rootPath, 'simpler_generator_images.yaml');
                fs.writeFileSync(newFilePath, yamlTemplate);
                vscode.window.showInformationMessage(`Yaml File Successfully Created 😜`);
            }
        });
}



function checkYamlFile(yamlFilePath) {
    return fs.existsSync(yamlFilePath)
}


function checkForNull(path, outputPath, className) {
    if (path === undefined) {
      vscode.window.showErrorMessage(`Generator -> [ - path ] 👍 write correctly`);
  
    }
    if (outputPath === undefined) {
      vscode.window.showErrorMessage(`No outputPath defined in the configuration yaml ❌\n\nDefault path: 'lib/themes/image'`);
  
    }
    if (className === undefined) {
      vscode.window.showErrorMessage(`No ClassName defined in the configuration yaml ❌`);
  
    }
  }



module.exports = {
    createYamlFile, checkYamlFile, checkForNull
}
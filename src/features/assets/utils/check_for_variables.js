const vscode = require('vscode');
const fs = require('fs/promises');

function checkForVariable(className, variablesToCheck) {
  return vscode.workspace.findFiles('lib/**/*.dart', null, 10000)
    .then((dartFiles) => {
      const referencedVariables = new Set();

      return Promise.all(
        dartFiles.map((dartFile) =>
          fs.readFile(dartFile.fsPath, 'utf-8').then((dartContent) => {
            const lines = dartContent.split('\n');

            for (const variable of variablesToCheck) {
              const variableDefinition = `${className}.${variable}`;
              const regex = new RegExp(`\\b${variableDefinition}\\b`);
              for (const line of lines) {
                if (regex.test(line) && !line.trim().startsWith('//')) {
                  referencedVariables.add(variable);
                  break;
                }
              }
            }
          })
        )
      ).then(() => variablesToCheck.filter((variable) => !referencedVariables.has(variable)));
    });
}

module.exports = {
  checkForVariable,
};

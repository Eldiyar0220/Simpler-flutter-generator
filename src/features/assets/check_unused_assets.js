const vscode = require('vscode');
const path = require('path');
const fs = require('fs').promises; // Use 'fs.promises' for async file operations
const customPath = require('../../shared/root_path');
const { getTemplateForUnused } = require('./utils/get_template');

class Resource {
  constructor(name, fsPath) {
    this.name = name;
    this.fsPath = fsPath;
  }
}

async function findUnreferencedAssets(outputPathFromGenerate) {
  const [assetFiles, dartFiles] = await Promise.all([
    vscode.workspace.findFiles('assets/**/*', 'assets/fonts/**/*', 10000),
    vscode.workspace.findFiles('lib/**/*.dart', null, 10000),
  ]);

  const assetNames = assetFiles.map((asset) => path.basename(asset.fsPath));

  const referencedAssets = new Set();

  for (const dartFile of dartFiles) {
    const dartContent = await fs.readFile(dartFile.fsPath, 'utf-8');
    for (const asset of assetNames) {
      const assetReference = `${asset}`;
      if (dartContent.includes(assetReference) && !dartContent.includes(`//500Name`)) {
        referencedAssets.add(asset);
      }
    }
  }

  const unreferencedAssets = [];
  for (const asset of assetFiles) {
    const assetName = path.basename(asset.fsPath);
    if (!referencedAssets.has(assetName)) {
      unreferencedAssets.push(new Resource(assetName, asset.fsPath));
    }
  }

  const directoryPath = customPath.join(customPath.rootPath, outputPathFromGenerate);
  const logContent = unreferencedAssets
    .map((asset) => `//500Name: ${asset.name}, --> Path: ${asset.fsPath}`)
    .join('\n');
  const getTemplate = getTemplateForUnused();
  const result = getTemplate.replace('__CODE_TEMPLATE_CONTENTS_REPLACEMENT__', logContent);

  const outputPath = customPath.join(directoryPath, 'UNUSED_ASSETS.dart');
  try {
    if (result) {

      await fs.writeFile(outputPath, result, 'utf-8');
    }
  } catch (error) {
    console.error(`Error writing the file: ${error}`);
  }

  return unreferencedAssets;
}

module.exports = {
  findUnreferencedAssets,
};

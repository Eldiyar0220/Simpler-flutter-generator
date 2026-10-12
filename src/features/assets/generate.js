


const fs = require("fs");
const vscode = require("vscode");
const customPath = require("../../shared/root_path");
const yaml = require("js-yaml");
const { VNodeSimple, VNodeWithCheck } = require("./utils/vn_code");
const { codeTamplate } = require("../../shared/constants");
const { getTemplate } = require("./utils/get_template");
const { hasEmptySpace } = require("./utils/has_empty_space");
const { transformToCamelCase } = require("./utils/transform_to_camel_case");
const { toSnake, toPascalCaseForAssets } = require("../../shared/case");
const { createYamlFile, checkYamlFile, checkForNull } = require("./utils/create_yaml_file");
const { showInformationWithProgressAndTimeout } = require("../../shared/loading");
const { findUnreferencedAssets } = require("./check_unused_assets");


///--------------------Outputs 😜 Assets--------------------
async function generatorAssets() {
  const yamlFilePath = customPath.join(customPath.rootPath, 'simpler_generator_images.yaml');

  if (checkYamlFile(yamlFilePath)) {
    try {
      const yamlConfig = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));

      if (!Array.isArray(yamlConfig.groups)) {
        vscode.window.showErrorMessage('No *groups* defined in the configuration. ❌');
      } else {
        const groupNames = yamlConfig.groups.map(group => group.class_name)

        // If generateAll is false, ask for confirmation to generate only one asset
        if (!yamlConfig.generateAll) {
          const choice = await vscode.window.showWarningMessage(
            `Simpler Flutter Generator\nChoose to generate`,
            { modal: true },
            ...groupNames
          );

          if (!choice) {
            return; // Skip this group if the user chooses 'No'
          }

          const selectedGroup = yamlConfig.groups.find(group => group.class_name == choice);
          if (selectedGroup) {
            generateByName({ yamlConfig: yamlConfig, className: selectedGroup.class_name, })
            return;
          }
        }


        for (const group of yamlConfig.groups) {
          checkForNull(group.path, group.outputPath, group.class_name);
          const paths = Array.isArray(group.path) ? group.path : [group.path];
          const codeToAppendArray = [];

          for (const path of paths) {
            const pathv2 = customPath.join(customPath.rootPath, path);
            const files = fs.readdirSync(pathv2);

            const typeOf = group.types ?? ['.png', '.jpg', '.jpeg', '.webp', '.webm', '.bmp', '.svg', '.gif', '.riv', '.json'];
            const list = files.filter(file => typeOf.includes(customPath.extname(file).toLowerCase()));
            // --> body from Yaml
            const assetsPathV2Dynamic = {
              assetsPath: path,
              outputPath: group.outputPath ?? 'lib/core/constant',
              className: group.class_name ?? 'class_name',
              types: typeOf,
              warning: group.warnings ?? true,
              checkUnusedVariables: group.checkUnusedVariables ?? false,
              checkUnusedAssets: group.checkUnusedAssets ?? false,
            };

            if (assetsPathV2Dynamic.checkUnusedAssets) {
              findUnreferencedAssets(assetsPathV2Dynamic.outputPath)
            }

            // --> filter types to generate
            const allowedExtensions = assetsPathV2Dynamic.types;
            const filteredList = list.filter(item => allowedExtensions.includes(customPath.extname(item)));

            if (assetsPathV2Dynamic.checkUnusedVariables) {
              Promise.all(
                filteredList.map(async (item) => {
                  const transformedItem = transformToCamelCase(item, typeOf);
                  const hasEmptySpaceResult = await hasEmptySpace(item, assetsPathV2Dynamic.warning);
                  const pascalCaseItem = toPascalCaseForAssets(assetsPathV2Dynamic.className);
                  const genResult = await new VNodeWithCheck(item, transformedItem, hasEmptySpaceResult, pascalCaseItem).gen(assetsPathV2Dynamic.assetsPath);
                  return genResult;
                })
              )
                .then((contentArray) => {
                  const contentV1 = contentArray.join('\n');
                  codeToAppendArray.push(contentV1);
                  const codeToAppend = codeToAppendArray.join('\n');
                  const checkTypesErrorMessage = '\tWarnings Empty assets!!\n\n\t//Check -> \n\t//types: [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]'
                  const temp = getTemplate();
                  const result = temp
                    .replace(codeTamplate, assetsPathV2Dynamic.warning ? codeToAppend.trim() === '' ? checkTypesErrorMessage : codeToAppend : codeToAppend)
                    .replace('AssetsClass', toPascalCaseForAssets(assetsPathV2Dynamic.className))
                    .replace('AssetsClass._();', `${toPascalCaseForAssets(assetsPathV2Dynamic.className)}._();`);
                  const directoryPath = customPath.join(customPath.rootPath, assetsPathV2Dynamic.outputPath);
                  if (!fs.existsSync(directoryPath)) {
                    fs.mkdirSync(directoryPath, { recursive: true });
                  }
                  const outputPath = customPath.join(directoryPath, `${toSnake(assetsPathV2Dynamic.className)}.dart`);
                  if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                  }
                  fs.writeFileSync(outputPath, result);
                })
                .catch((error) => {
                  console.error("An error occurred:", error);
                });
            } else {
              const contentV2 = filteredList.map(item =>
                new VNodeSimple(item, transformToCamelCase(item, typeOf), hasEmptySpace(item, assetsPathV2Dynamic.warning), toPascalCaseForAssets(assetsPathV2Dynamic.className)).gen(assetsPathV2Dynamic.assetsPath)
              ).join('\n');

              codeToAppendArray.push(contentV2);
              const codeToAppend = codeToAppendArray.join('\n');
              const checkTypesErrorMessage = '\tWarnings Empty assets!!\n\n\t//Check -> \n\t//types: [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]'
              const temp = getTemplate();
              const result = temp
                .replace(codeTamplate, assetsPathV2Dynamic.warning ? codeToAppend.trim() === '' ? checkTypesErrorMessage : codeToAppend : codeToAppend)
                .replace('AssetsClass', toPascalCaseForAssets(assetsPathV2Dynamic.className))
                .replace('AssetsClass._();', `${toPascalCaseForAssets(assetsPathV2Dynamic.className)}._();`);
              const directoryPath = customPath.join(customPath.rootPath, assetsPathV2Dynamic.outputPath);
              if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
              }
              const outputPath = customPath.join(directoryPath, `${toSnake(assetsPathV2Dynamic.className)}.dart`);
              if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
              }
              fs.writeFileSync(outputPath, result);
            }




            // -- appending dart code

          }
        }
        showInformationWithProgressAndTimeout(`Generating...... Assets ✅`, 13);
      }
    } catch (error) {
      vscode.window.showInformationMessage(`Generator Assets: ❌ -> ${error}`);
    }
  } else {
    createYamlFile()
  }
}


module.exports = {
  generatorAssets: generatorAssets
}







function generateByName({ yamlConfig, className }) {
  const group = yamlConfig.groups.find(group => group.class_name === className);
  checkForNull(group.path, group.outputPath, group.class_name);
  const paths = Array.isArray(group.path) ? group.path : [group.path];
  const codeToAppendArray = [];

  for (const path of paths) {
    const pathv2 = customPath.join(customPath.rootPath, path);
    const files = fs.readdirSync(pathv2);

    const typeOf = group.types ?? ['.png', '.jpg', '.jpeg', '.webp', '.webm', '.bmp', '.svg', '.gif', '.riv', '.json'];
    const list = files.filter(file => typeOf.includes(customPath.extname(file).toLowerCase()));
    // --> body from Yaml
    const assetsPathV2Dynamic = {
      assetsPath: path,
      outputPath: group.outputPath ?? 'lib/core/constant',
      className: group.class_name ?? 'class_name',
      types: typeOf,
      warning: group.warnings ?? true,
      checkUnusedVariables: group.checkUnusedVariables ?? false,
      checkUnusedAssets: group.checkUnusedAssets ?? false,
    };

    if (assetsPathV2Dynamic.checkUnusedAssets) {
      findUnreferencedAssets(assetsPathV2Dynamic.outputPath)
    }

    // --> filter types to generate
    const allowedExtensions = assetsPathV2Dynamic.types;
    const filteredList = list.filter(item => allowedExtensions.includes(customPath.extname(item)));

    if (assetsPathV2Dynamic.checkUnusedVariables) {
      Promise.all(
        filteredList.map(async (item) => {
          const transformedItem = transformToCamelCase(item, typeOf);
          const hasEmptySpaceResult = await hasEmptySpace(item, assetsPathV2Dynamic.warning);
          const pascalCaseItem = toPascalCaseForAssets(assetsPathV2Dynamic.className);
          const genResult = await new VNodeWithCheck(item, transformedItem, hasEmptySpaceResult, pascalCaseItem).gen(assetsPathV2Dynamic.assetsPath);
          return genResult;
        })
      )
        .then((contentArray) => {
          const contentV1 = contentArray.join('\n');
          codeToAppendArray.push(contentV1);
          const codeToAppend = codeToAppendArray.join('\n');
          const checkTypesErrorMessage = '\tWarnings Empty assets!!\n\n\t//Check -> \n\t//types: [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]'
          const temp = getTemplate();
          const result = temp
            .replace(codeTamplate, assetsPathV2Dynamic.warning ? codeToAppend.trim() === '' ? checkTypesErrorMessage : codeToAppend : codeToAppend)
            .replace('AssetsClass', toPascalCaseForAssets(assetsPathV2Dynamic.className))
            .replace('AssetsClass._();', `${toPascalCaseForAssets(assetsPathV2Dynamic.className)}._();`);
          const directoryPath = customPath.join(customPath.rootPath, assetsPathV2Dynamic.outputPath);
          if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
          }
          const outputPath = customPath.join(directoryPath, `${toSnake(assetsPathV2Dynamic.className)}.dart`);
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
          fs.writeFileSync(outputPath, result);
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    } else {
      const contentV2 = filteredList.map(item =>
        new VNodeSimple(item, transformToCamelCase(item, typeOf), hasEmptySpace(item, assetsPathV2Dynamic.warning), toPascalCaseForAssets(assetsPathV2Dynamic.className)).gen(assetsPathV2Dynamic.assetsPath)
      ).join('\n');

      codeToAppendArray.push(contentV2);
      const codeToAppend = codeToAppendArray.join('\n');
      const checkTypesErrorMessage = '\tWarnings Empty assets!!\n\n\t//Check -> \n\t//types: [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]'
      const temp = getTemplate();
      const result = temp
        .replace(codeTamplate, assetsPathV2Dynamic.warning ? codeToAppend.trim() === '' ? checkTypesErrorMessage : codeToAppend : codeToAppend)
        .replace('AssetsClass', toPascalCaseForAssets(assetsPathV2Dynamic.className))
        .replace('AssetsClass._();', `${toPascalCaseForAssets(assetsPathV2Dynamic.className)}._();`);
      const directoryPath = customPath.join(customPath.rootPath, assetsPathV2Dynamic.outputPath);
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }
      const outputPath = customPath.join(directoryPath, `${toSnake(assetsPathV2Dynamic.className)}.dart`);
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      fs.writeFileSync(outputPath, result);
    }
    showInformationWithProgressAndTimeout(`Generating...... Assets ✅`, 13);
  }
}
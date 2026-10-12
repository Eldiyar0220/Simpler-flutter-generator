const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const vscode = require('vscode');

const customPath = require('../../shared/root_path');
const { flutterBlocList } = require('./presentation/bloc/bloc');
const { flutterPages } = require('./presentation/pages/presentation');
const { flutterUseCaseInteractor } = require('./domain/use_case_interactor/use_case_interactor');
const { flutterDomainRepository } = require('./domain/repository/repository');
const { flutterRepository } = require('./data/repository/repository');
const { dataLocal } = require('./data/data_source/local');
const { dataRemote } = require('./data/data_source/remote');
const { entityModel } = require('./domain/entity/entity');
const { dataModel } = require('./data/models/models');
const { toPascalCase, toPascalCaseFunc } = require('../../shared/case');
const { showInformationWithProgressAndTimeout } = require("../../shared/loading");
const { mvvmTemplateYaml } = require('./templates/mvvm');

//bloc.newBlocTemplate.type
let blocType = vscode.workspace.getConfiguration('bloc').get('newBlocTemplate.type');


vscode.workspace.onDidChangeConfiguration(e => {
  if (e.affectsConfiguration('bloc.newBlocTemplate.type')) {
    blocType = vscode.workspace.getConfiguration('bloc').get('newBlocTemplate.type');
    showInformationWithProgressAndTimeout(`Bloc Type ${blocType} 👍`, 15)
  }
});

async function generateFilesAndFolders(uri) {
  try {
    const dist = vscode.workspace.workspaceFolders[0].uri.fsPath;

    const yamlFilePath = path.join(dist, 'simpler_generator_folders.yaml');
    if (fs.existsSync(yamlFilePath)) {
      const nameOpts = {
        prompt: "Choose a name for your Feature",
        validateInput: async (value) => {
          return /^[0-9a-zA-Z_]+$/g.test(value) ? null : "It is not a valid class name!";
        }
      };
      const name = (await vscode.window.showInputBox(nameOpts)).toLowerCase();
      if (name === undefined) {
        vscode.window.showErrorMessage("Aborted");
        return;
      }
      const yamlConfig = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));


      if (yamlConfig.generate) {
        for (const entry of yamlConfig.generate) {
          if (entry.category) {
            const categoryPath = path.join(uri.fsPath, entry.category);
            createFolderRecursively(categoryPath); // Create category folder

            if (entry.contents) {
              processContents(entry.contents, categoryPath, name, blocType ?? 'auto', ''); // Pass 'name'
            }
          }
        }
      }
      showInformationWithProgressAndTimeout('Generated SuccessFully ✅')
    } else {
      const options = {
        modal: true,
      };
      vscode.window.showInformationMessage('simpler_generator_folders.yaml\ndoes not exist in the project directory.', options, 'Create File')
        .then(async (selectedButton) => {
          if (selectedButton === 'Create File') {
            const newFilePath = path.join(dist, 'simpler_generator_folders.yaml');
            fs.writeFileSync(newFilePath, mvvmTemplateYaml());
            vscode.window.showInformationMessage(`Yaml File Successfully Created ✅`);
          }
        });
    }
  } catch (error) {
    vscode.window.showInformationMessage(`Error: ❌ ${error}`);
  }
}

function processContents(contents, baseDir, name, blocType, projectName) {
  for (const entry of contents) {
    if (entry.folder) {
      const folderPath = path.join(baseDir, entry.folder.replace(/NAME/g, name)); // Replace 'NAME' with 'name'
      createFolderRecursively(folderPath); // Create content folder

      if (entry.contents) {
        processContents(entry.contents, folderPath, name, blocType, ''); // Pass 'name'
      }
    }
    if (entry.file) {
      if (entry.code) {
        const generatedCode = entry.code.replace(/NAME/g, toPascalCase(name)).replace(/LOWER_CASE/g, name.toLowerCase()).replace(/funcCase/g, toPascalCaseFunc(name));
        createFile(entry.file.replace(/NAME/g, name), baseDir, entry.file, name, generatedCode);
      } else {
        createFile(entry.file.replace(/NAME/g, name), baseDir, entry.file, name);
      }
    }
  }
}

function createFolderRecursively(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });

  }
}


function generateBlocDartCode(folderPath, name, blocType, projectName) {
  flutterBlocList(blocType, name, ' --> ', projectName).forEach(({ fileName, dartCode }) => {
    const filePath = path.join(folderPath, fileName);
    try {
      fs.writeFileSync(filePath, dartCode);
    } catch (err) {
      vscode.window.showErrorMessage(`Error creating file: ${fileName} - ${err.message}`);
    }
  });
}

function createFile(fileName, folderPath, checkFile, inputBox, code) {
  const filePath = path.join(folderPath, fileName);

  const yamlFilePath = path.join(customPath.rootPath, 'simpler_generator_folders.yaml');
  const yamlConfig = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));
  let dataSource = yamlConfig.dataSource ?? false
  let dataModels = yamlConfig.dataModel ?? false
  let dataRepository = yamlConfig.dataRepository ?? false
  let entityModels = yamlConfig.entityModel ?? false
  let domainRepository = yamlConfig.domainRepository ?? false
  let usecase = yamlConfig.usecase ?? false
  let stateWidget = yamlConfig.stateWidget ?? false

  //*------ PAGE

  if (dataSource &&
    dataModels &&
    dataRepository &&
    entityModels &&
    domainRepository &&
    usecase &&
    stateWidget) {

    fs.writeFileSync(filePath, '');




    //*------ Domain
    if (checkFile === 'NAME_usecase.dart') {
      fileName = fileName.replaceAll('.dart', '');
      fs.writeFileSync(filePath, flutterUseCaseInteractor(fileName, inputBox));
    }

    //*------ Repository / Repo
    if (checkFile === 'NAME_repository.dart') {

      fileName = fileName.replaceAll('.dart', '');
      fs.writeFileSync(filePath, flutterDomainRepository(fileName));
    }

    //*------ data
    if (checkFile === 'NAME_repository_impl.dart') {

      fileName = fileName.replaceAll('.dart', '');
      fs.writeFileSync(filePath, flutterRepository(fileName, inputBox));
    }
    //*------ data Source local
    if (checkFile === 'NAME_local_data_source.dart') {

      fileName = fileName.replaceAll('.dart', '');
      fs.writeFileSync(filePath, dataLocal(fileName, inputBox));
    }
    //*------ data Source remote
    if (checkFile === 'NAME_remote_data_source.dart') {

      fileName = fileName.replaceAll('.dart', '');
      fs.writeFileSync(filePath, dataRemote(fileName, inputBox));
    }
    //*------ entity
    if (checkFile === 'NAME_entity.dart') {

      fileName = fileName.replaceAll('.dart', '');
      fs.writeFileSync(filePath, entityModel(fileName, inputBox));
    }
    //*------ data Model
    if (checkFile === 'NAME_model.dart') {

      fileName = fileName.replaceAll('.dart', '');
      fs.writeFileSync(filePath, dataModel(fileName, inputBox));
    }

  } else {

    if (code) {
      fs.writeFileSync(filePath, code);
    } else {
      if (checkFile === 'NAME_page.dart' || checkFile === 'NAME_screen.dart') {
        fileName = fileName.replaceAll('.dart', '');
        fs.writeFileSync(filePath, flutterPages(fileName));
      } else {
        fs.writeFileSync(filePath, '');
      }
    }
  }


}

module.exports = {
  generateFilesAndFolders
}


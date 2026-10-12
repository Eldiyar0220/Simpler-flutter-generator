const fs = require("fs");
const vscode = require("vscode");
const path = require("../../shared/root_path");
const { exec } = require("child_process");
const { showInformationWithProgressAndTimeout } = require("../../shared/loading");


const startSegment = 'lib';


function buildRunnerWithFilter(uri, isEditor) {
  const relativePath = uri.substring(uri.indexOf(startSegment));

  try {

    fs.readdir(uri, (err, files) => {
      if (err) {
        console.error(`Unable to scan directory: ${err}`);
        return;
      }

      // Filter for .dart files
      const dartFiles = files.filter(file => path.extname(file) === '.dart');

      if (dartFiles.length > 0) {
        const workspaceFolder = vscode.workspace.workspaceFolders[0]; // Assuming the first workspace folder
        const workspaceFolderPath = workspaceFolder.uri.fsPath;
        // dart pub run build_runner build --delete-conflicting-outputs --build-filter 'lib/features/bonus/data/models/bonus_balance/*.dart'
        executeFlutterCommand(`dart run build_runner build --delete-conflicting-outputs --build-filter '${relativePath}/*.dart'`,
          workspaceFolderPath,
          dartFiles,
        )

      } else {
        showInformationWithProgressAndTimeout(`There is No DART File ❌`, 50);
      }
    });
  } catch (error) {
    vscode.window.showErrorMessage(`Unable to run build_runner: ${error}`);
  }
}



async function executeFlutterCommand(command, workingDirectory, fileNames) {
  const startTime = Date.now();  // Record start time

  try {
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Running build_runner",
      cancellable: true
    }, async (progress, token) => {
      let showFilesItem = { title: "Show Files", isButton: true };
      progress.report({ message: "Starting build..." });

      await new Promise((resolve, reject) => {
        const process = exec(command, { cwd: workingDirectory });
        process.stdout.on('data', (data) => {
          progress.report({ message: data.trim() });
        });

        process.stderr.on('data', (data) => {
          console.error(`Error output: ${data}`);
          vscode.window.showErrorMessage(`Error output: ${data}`);
          reject(new Error(data));
        });

        process.on('close', (code) => {
          if (code !== 0) {
            reject(new Error(`Command exited with code ${code}`));
          } else {
            const endTime = Date.now();  // Record end time
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2);  // Calculate time taken in seconds
            let message = `Build completed successfully in ${timeTaken} seconds! ✅`;
            vscode.window.showInformationMessage(message, showFilesItem).then(selection => {
              if (selection && selection.title === showFilesItem.title) {
                const filteredFileNames = fileNames
                  .filter(fileName => fileName.endsWith('.dart') && !fileName.endsWith('.g.dart') && !fileName.endsWith('.freezed.dart'))
                  .map((fileName, index) => `${index + 1}) ${fileName}`)
                  .join('\n');
                
                // Show the formatted file names in an information message
                vscode.window.showInformationMessage(`Processed files:\n${filteredFileNames}`, {modal: true});
              }
            });
            resolve();
          }
        });

        token.onCancellationRequested(() => {
          process.kill();
          vscode.window.showWarningMessage("Build was cancelled");
          resolve();
        });
      });
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}


module.exports = {
  buildRunnerWithFilter: buildRunnerWithFilter
}








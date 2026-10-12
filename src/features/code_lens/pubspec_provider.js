const vscode = require('vscode');
const axios = require('axios');

let codeLensConfig = vscode.workspace.getConfiguration('SimplerFlutterGenerator').get('enableCodeLens');


vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('SimplerFlutterGenerator.enableCodeLens')) {
        codeLensConfig = vscode.workspace.getConfiguration('SimplerFlutterGenerator').get('enableCodeLens');
    }
});


function getLeftSpaceWidth(text) {
    let width = 0;
    for (let i = 0; i < text.length; i += 1) {
        if (text.charAt(i) === ' ') {
            width += 1;
        } else {
            break;
        }
    }
    return width;
}

function readDocumentLines(document) {
    if (!document.fileName.endsWith('pubspec.yaml')) {
        return [];
    }

    let inDependencyScope = false;
    let lastItemOK = false;
    let lastItemLeftSpaceWidth = 0;

    return new Array(document.lineCount)
        .fill('')
        .map((line, idx) => ({ line: document.lineAt(idx), idx }))
        .filter(({ line, idx }) => {
            const { text } = line;

            if (text.trim().length === 0) {
                return false; // Ignore empty lines
            }

            if (text.startsWith(' ') && inDependencyScope) {
                if (!text.includes(':')) {
                    return false; // Skip invalid lines without a `:`
                }

                if (lastItemOK) {
                    let currentWidth = getLeftSpaceWidth(text);
                    if (currentWidth > lastItemLeftSpaceWidth) {
                        return false; // Child item, ignore
                    }
                }

                lastItemOK = true;
                lastItemLeftSpaceWidth = getLeftSpaceWidth(text);

                // Check for `git:` in subsequent lines
                if (
                    idx + 1 < document.lineCount &&
                    document.lineAt(idx + 1).text.trim().startsWith('git:')
                ) {
                    line.isGitDependency = true; // Mark as a git dependency
                } else {
                    line.isGitDependency = false;
                }

                return true;
            }

            // Detect `dependencies:` or `dev_dependencies:` scope
            if (
                text.startsWith('dependencies:') &&
                text.trim() === 'dependencies:'
            ) {
                inDependencyScope = true;
            } else if (
                text.startsWith('dev_dependencies:') &&
                text.trim() === 'dev_dependencies:'
            ) {
                inDependencyScope = true;
            } else {
                inDependencyScope = false;
            }

            lastItemOK = false;
            return false;
        })
        .map(({ line }) => line);
}


function openPackageUrl(packageName) {
    if (packageName.startsWith('#')) {
        packageName = packageName.trim().replace(/^#/, '');
    }

    let packageUrl =
        vscode.workspace
            .getConfiguration()
            .get('search.baseUrl', 'https://pub.dev/') + 'packages/' +
        encodeURI(String(packageName.trim()));
    vscode.env.openExternal(vscode.Uri.parse(packageUrl));
}

class PubspecCodeLensProvider {

    async provideCodeLenses(document, token) {

        let lines = readDocumentLines(document);
        const excludedPackages = ['flutter', 'flutter_test'];
        // Create an array of promises for getting package versions
        const codeLenses = await Promise.all(lines.map(async (line) => {
            let currentVersion = line.text.trim().split(':')[1].trim().replace('^', '');
            let packageName = line.text.trim().split(':')[0].trim();
            if (packageName.startsWith('#')) {
                packageName = packageName.trim().replace(/^#/, '').replace('"', '');
            }

            const codeLensList = [];
            const version = await this.getPackageVersion(packageName);
            let title;
            if (excludedPackages.includes(packageName) || !codeLensConfig) {
                // If the package is excluded, just show the package name
                return null
            } else {
                let symbolAdd = line.isGitDependency ? '-- ✔︎' : '-- ⤴️'
                // Otherwise, show the pub.dev link with the version
                title = version && currentVersion != version
                    ? `Open ${packageName} ${symbolAdd}`
                    : `Open ${packageName} -- ✔︎`;
            }

            const pubDevLens = new vscode.CodeLens(line.range, {
                title: title,
                command: 'simplerFlutterGenerator.viewDependencyFlutter',
                arguments: [packageName],
            });

            codeLensList.push(pubDevLens);

            if (!line.isGitDependency && version && currentVersion !== version) {
                const updateLens = new vscode.CodeLens(line.range, {
                    title: `update to [${version}]`,
                    command: 'simplerFlutterGenerator.updateDependency',
                    arguments: [packageName, currentVersion, version, document.uri],
                });
                codeLensList.push(updateLens);
            }

            return codeLensList;
        }));

        return codeLenses.flat().filter(codeLens => codeLens !== null);
    }

    async getPackageVersion(packageName) {
        try {
            const encodedPackageName = encodeURIComponent(packageName);
            const apiUrl = `https://pub.dev/api/packages/${encodedPackageName}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json(); // Parse the JSON data

            return data.latest.version;
        } catch (error) {
            return null; // Return null if there's an error
        }
    }
}


module.exports = {
    PubspecCodeLensProvider, openPackageUrl
}

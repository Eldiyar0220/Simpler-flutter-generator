const vscode = require('vscode');

function readDocumentLines(document) {
    if (!document.fileName.endsWith('.dart')) {
        return [];
    }

    let inFreezedAnnotation = false;
    let inJsonSerializableAnnotation = false;
    let inRestApiAnnotation = false;
    let inBlocExtends = false;

    let hasFreezedDart = false;

    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const { text } = line;

        if (text.includes('.freezed.dart')) {
            hasFreezedDart = true;
            break;
        }
    }

    return new Array(document.lineCount)
        .fill('')
        .map((line, idx) => document.lineAt(idx))
        .filter((line) => {
            const { text } = line;


            // Detect @freezed annotation
            if (text.includes('@freezed')) {
                inFreezedAnnotation = true;
                return true;
            } else if (inFreezedAnnotation) {
                // Detect end of @freezed annotation block
                if (text.trim().startsWith('class')) {
                    inFreezedAnnotation = false;
                    return false;
                }
                // Return true to include lines within @freezed block
                return true;
            }

            // Detect @JsonSerializable() annotation
            if (text.includes('@JsonSerializable()') || text.includes('@JsonSerializable(')) {
                inJsonSerializableAnnotation = true;
                return true;
            } else if (inJsonSerializableAnnotation) {
                // Return false to exclude lines after @JsonSerializable()
                inJsonSerializableAnnotation = false;
                return false;
            }

            // Detect @RestApi() annotation
            if (text.includes('@RestApi()') || text.includes('@rest.RestApi()')) {
                inRestApiAnnotation = true;
                return true;
            } else if (inRestApiAnnotation) {
                // Return false to exclude lines after @RestApi()
                inRestApiAnnotation = false;
                return false;
            }

            if (text.includes('Bloc extends') || text.includes('.freezed.dart')) {
                inBlocExtends = true;
                return true;
            } else if (inBlocExtends) {
                // Stop including lines after Bloc extends
                inBlocExtends = false;
                return false;
            }

            return false;
        });
}

class BuildrunnerCodeLensProvider {
    provideCodeLenses(document, token) {
        let lines = readDocumentLines(document);
        let codeLenses = [];

        // Iterate through filtered lines to generate CodeLenses
        lines.forEach((line) => {
            const { text } = line;

            // Default CodeLens with Generate Freezed title
            let title = '';
            let command = 'simpler_flutter_generator.build_runner_with_filter_from_code_lens';

            // Check for @JsonSerializable() annotation
            if (text.includes('@freezed')) {
                title = 'Generate Freezed';
            }
            if (text.includes('@JsonSerializable()') || text.includes('@JsonSerializable(')) {
                title = 'Generate JsonSerializable';
            }

            // Check for @RestApi() annotation
            if (text.includes('@RestApi()') || text.includes('@rest.RestApi()')) {
                title = 'Generate RestApi';
            }
            if (text.includes('bloc.freezed.dart')) {
                title = 'Generate Freezed Bloc';
            }
            if (title.trim() !== '') {
                let codeLens = new vscode.CodeLens(line.range, {
                    title: title,
                    command: command,
                    arguments: [document.uri.fsPath],
                });
                codeLenses.push(codeLens);
            }
            // Create a new CodeLens object and push to array
        });

        return codeLenses;
    }
}

module.exports = {
    BuildrunnerCodeLensProvider
};
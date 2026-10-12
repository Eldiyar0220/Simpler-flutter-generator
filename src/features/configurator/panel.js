const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { mvvmTemplate } = require('../architecture/templates/mvvm');

let homePanel;
let currentPage = 'menu';

function openMenu(context) {
	const panel = ensurePanel(context);
	panel.reveal(vscode.ViewColumn.Active);
	showPage(panel, context, 'menu');
}

function openConfigurator(context) {
	const panel = ensurePanel(context);
	panel.reveal(vscode.ViewColumn.Active);
	showPage(panel, context, 'studio');
}

function ensurePanel(context) {
	if (homePanel) {
		return homePanel;
	}

	homePanel = vscode.window.createWebviewPanel(
		'simplerFlutterHome',
		'Simpler Flutter',
		vscode.ViewColumn.Active,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [
				vscode.Uri.joinPath(context.extensionUri, 'media'),
				vscode.Uri.joinPath(context.extensionUri, 'images'),
			],
		}
	);

	homePanel.onDidDispose(() => {
		homePanel = undefined;
	});

	homePanel.webview.onDidReceiveMessage(async (message) => {
		if (message.type === 'ready') {
			if (currentPage === 'images') {
				homePanel.webview.postMessage({
					type: 'init',
					yaml: readImagesYaml(),
				});
				return;
			}
			if (currentPage === 'studio') {
				homePanel.webview.postMessage({
					type: 'init',
					settings: readSettings(),
					yaml: readProjectYaml(),
					template: mvvmTemplate(),
				});
			}
			return;
		}

		if (message.type === 'back') {
			showPage(homePanel, context, 'menu');
			return;
		}

		if (message.type === 'navigate') {
			if (message.command === 'studio') {
				showPage(homePanel, context, 'studio');
				return;
			}
			if (message.command === 'images') {
				showPage(homePanel, context, 'images');
				return;
			}
			await vscode.commands.executeCommand(message.command);
			return;
		}

		if (message.type === 'applySettings') {
			await writeSettings(message.settings);
			return;
		}

		if (message.type === 'saveYaml' || message.type === 'saveImagesYaml') {
			const fileName = message.type === 'saveImagesYaml'
				? 'simpler_generator_images.yaml'
				: 'simpler_generator_folders.yaml';
			const root = vscode.workspace.workspaceFolders?.[0];
			if (!root) {
				vscode.window.showErrorMessage('Открой папку проекта, чтобы сохранить yaml');
				return;
			}
			const target = vscode.Uri.joinPath(root.uri, fileName);
			await vscode.workspace.fs.writeFile(target, Buffer.from(message.yaml, 'utf8'));
			vscode.window.showInformationMessage(`${fileName} сохранён`);
			return;
		}

		if (message.type === 'importArchitectureYaml') {
			const picked = await vscode.window.showOpenDialog({
				canSelectMany: false,
				canSelectFiles: true,
				canSelectFolders: false,
				filters: { YAML: ['yaml', 'yml'] },
				title: 'Импорт yaml архитектуры',
			});
			if (!picked || !picked[0] || !homePanel) {
				return;
			}
			let doc;
			try {
				const bytes = await vscode.workspace.fs.readFile(picked[0]);
				doc = yaml.load(Buffer.from(bytes).toString('utf8'));
			} catch (error) {
				vscode.window.showErrorMessage(`Не удалось прочитать yaml: ${error.message}`);
				return;
			}
			if (!doc || typeof doc !== 'object' || !Array.isArray(doc.generate)) {
				vscode.window.showErrorMessage('В файле нет списка generate. Это не yaml архитектуры.');
				return;
			}
			if (message.replace) {
				const fileName = path.basename(picked[0].fsPath);
				const choice = await vscode.window.showWarningMessage(
					`Заменить текущую структуру файлом ${fileName}?`,
					{ modal: true },
					'Заменить'
				);
				if (choice !== 'Заменить' || !homePanel) {
					return;
				}
			}
			homePanel.webview.postMessage({ type: 'applyImportedYaml', yaml: doc });
			return;
		}

		if (message.type === 'exportArchitectureYaml') {
			const root = vscode.workspace.workspaceFolders?.[0];
			const target = await vscode.window.showSaveDialog({
				defaultUri: root ? vscode.Uri.joinPath(root.uri, 'simpler_generator_folders.yaml') : undefined,
				filters: { YAML: ['yaml', 'yml'] },
				title: 'Экспорт yaml архитектуры',
				saveLabel: 'Экспорт',
			});
			if (!target) {
				return;
			}
			await vscode.workspace.fs.writeFile(target, Buffer.from(message.yaml || '', 'utf8'));
			vscode.window.showInformationMessage(`YAML экспортирован: ${path.basename(target.fsPath)}`);
			return;
		}

		if (message.type === 'confirmDelete') {
			const name = message.name || 'этот элемент';
			const choice = await vscode.window.showWarningMessage(
				`Удалить ${name}?`,
				{ modal: true },
				'Удалить'
			);
			if (choice === 'Удалить' && homePanel) {
				homePanel.webview.postMessage({ type: 'applyDelete', id: message.id });
			}
			return;
		}

		if (message.type === 'confirmArchitectureTemplate') {
			const choice = await vscode.window.showWarningMessage(
				'В simpler_generator_folders.yaml уже есть свои настройки, не шаблон. Заменить их шаблоном MVVM?',
				{ modal: true },
				'Заменить'
			);
			if (choice === 'Заменить' && homePanel) {
				homePanel.webview.postMessage({ type: 'applyArchitectureTemplate' });
			}
			return;
		}

		if (message.type === 'confirmImagesTemplate') {
			const choice = await vscode.window.showWarningMessage(
				'В simpler_generator_images.yaml уже есть свои настройки, не шаблон. Заменить их шаблоном?',
				{ modal: true },
				'Заменить'
			);
			if (choice === 'Заменить' && homePanel) {
				homePanel.webview.postMessage({ type: 'applyImagesTemplate' });
			}
			return;
		}

		if (message.type === 'copy') {
			await vscode.env.clipboard.writeText(message.yaml);
			vscode.window.showInformationMessage('YAML скопирован');
		}
	});

	return homePanel;
}

function showPage(panel, context, page) {
	currentPage = page;
	const folders = {
		studio: 'configurator',
		images: 'images',
		menu: 'menu',
	};
	const titles = {
		studio: 'Architecture Studio',
		images: 'Images Studio',
		menu: 'Simpler Flutter',
	};
	const folder = folders[page] || 'menu';
	const mediaDir = vscode.Uri.joinPath(context.extensionUri, 'media', folder);
	const cssUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(mediaDir, 'styles.css'));
	const jsUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(mediaDir, 'app.js'));
	const htmlPath = path.join(context.extensionPath, 'media', folder, 'index.html');
	const gifUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'images', 'generator_image_gii.gif'));
	panel.title = titles[page] || 'Simpler Flutter';
	panel.webview.html = fs.readFileSync(htmlPath, 'utf8')
		.replace('<!--CSP-->', `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${panel.webview.cspSource}; style-src ${panel.webview.cspSource}; script-src ${panel.webview.cspSource};">`)
		.replace('href="styles.css"', `href="${cssUri}"`)
		.replace('src="app.js"', `src="${jsUri}"`)
		.replace('src="demo.gif"', `src="${gifUri}"`);
}

function readSettings() {
	const simpler = vscode.workspace.getConfiguration('SimplerFlutterGenerator');
	const bloc = vscode.workspace.getConfiguration('bloc');
	return {
		stateMachine: simpler.get('stateMachine') === 'cubit' ? 'cubit' : 'bloc',
		blocType: bloc.get('newBlocTemplate.type') || 'freezed',
		cubitType: bloc.get('newCubitTemplate.type') || 'freezed',
		stateWidget: simpler.get('stateWidget') || 'StateFullWidget',
		createStateWidget: simpler.get('createStateWidget') !== false,
	};
}

function readYamlFile(fileName) {
	const root = vscode.workspace.workspaceFolders?.[0];
	if (!root) {
		return null;
	}
	const filePath = path.join(root.uri.fsPath, fileName);
	if (!fs.existsSync(filePath)) {
		return null;
	}
	try {
		return yaml.load(fs.readFileSync(filePath, 'utf8'));
	} catch (error) {
		vscode.window.showWarningMessage(`Не удалось прочитать ${fileName}: ${error.message}`);
		return null;
	}
}

function readProjectYaml() {
	return readYamlFile('simpler_generator_folders.yaml');
}

function readImagesYaml() {
	return readYamlFile('simpler_generator_images.yaml');
}

async function writeSettings(settings) {
	const target = vscode.workspace.workspaceFolders?.length
		? vscode.ConfigurationTarget.Workspace
		: vscode.ConfigurationTarget.Global;
	const simpler = vscode.workspace.getConfiguration('SimplerFlutterGenerator');
	const bloc = vscode.workspace.getConfiguration('bloc');
	await simpler.update('stateMachine', settings.stateMachine === 'cubit' ? 'cubit' : 'bloc', target);
	await simpler.update('stateWidget', settings.stateWidget, target);
	await simpler.update('createStateWidget', !!settings.createStateWidget, target);
	await bloc.update('newBlocTemplate.type', settings.blocType, target);
	await bloc.update('newCubitTemplate.type', settings.cubitType, target);
}

module.exports = {
	openMenu,
	openConfigurator,
};

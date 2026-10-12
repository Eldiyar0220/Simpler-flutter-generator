const TEMPLATE_TYPES = [
	{ value: 'Auto', label: 'Auto', hint: 'тип не задан, генератор возьмёт equatable' },
	{ value: 'simple', label: 'simple', hint: 'обычные классы event и state' },
	{ value: 'equatable', label: 'equatable', hint: 'state сравнивается через Equatable' },
	{ value: 'freezed', label: 'freezed', hint: 'when / map, нужен build_runner' },
];
const WIDGET_TYPES = [
	{ value: 'StateLessWidget', label: 'State Less Widget' },
	{ value: 'StateFullWidget', label: 'State Full Widget' },
	{ value: 'Empty', label: 'Do Not Create' },
];
const LAYER_FLAGS = [
	['dataSource', 'Data source', 'NAME_local / remote data source'],
	['dataModel', 'Data model', 'NAME_model.dart'],
	['dataRepository', 'Data repository', 'NAME_repository_impl.dart'],
	['entityModel', 'Entity', 'NAME_entity.dart'],
	['domainRepository', 'Domain repository', 'NAME_repository.dart'],
	['usecase', 'Use case', 'NAME_usecase.dart'],
	['stateWidget', 'State widget', 'встроенный шаблон страницы'],
];

let seq = 1;
const uid = () => `n${seq++}`;

const state = {
	settings: {
		stateMachine: 'bloc',
		cubitType: 'freezed',
		blocType: 'freezed',
		createStateWidget: true,
		stateWidget: 'StateFullWidget',
	},
	flags: {
		dataSource: false,
		dataModel: false,
		dataRepository: false,
		entityModel: false,
		domainRepository: false,
		usecase: false,
		stateWidget: false,
	},
	generate: [],
};

let selectedId = null;
let projectFileLoaded = false;
let templateDocument = null;
let vscodeApi = null;
try {
	vscodeApi = acquireVsCodeApi();
} catch (error) {
	vscodeApi = null;
}

const modelCode = `import 'package:freezed_annotation/freezed_annotation.dart';

part 'LOWER_CASE_model.freezed.dart';
part 'LOWER_CASE_model.g.dart';

@freezed
class NAMEModel with _$NAMEModel {
  const factory NAMEModel({
    String? status,
    String? data,
    String? message,
    bool? blocked,
    bool? popup,
  }) = _NAMEModel;

  factory NAMEModel.fromJson(Map<String, dynamic> json) =>
      _$NAMEModelFromJson(json);
}
`;

const repositoryImplCode = `import 'package:injectable/injectable.dart';

@Singleton(as: NAMERepository)
class NAMERepositoryImpl implements NAMERepository {
  NAMERepositoryImpl(this._dioGenerator);
  final DioGenerator _dioGenerator;

  final String _getList = ' API ';

  @override
  Future<String> exampleFuncRepo() async {
    final response = await _dioGenerator.dio.get(_getList);
    return NAMEModel.fromJson(response.data).data;
  }
}
`;

const interactorCode = `@singleton()
class NAMEInteractor {
  NAMEInteractor(this._repository);
  final NAMERepository _repository;

  @override
  Future<void> exampleFunc() async {
    try {
      await _repository.exampleFuncRepo();
    } catch (e) {
      rethrow;
    }
  }
}
`;

const repositoryCode = `abstract class NAMERepository {
  Future<void> exampleFuncRepo();
}
`;

const blocCode = `import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'LOWER_CASE_bloc.freezed.dart';
part 'LOWER_CASE_event.dart';
part 'LOWER_CASE_state.dart';

class NAMEBloc extends Bloc<NAMEEvent, NAMEState> {
  NAMEBloc(this._interactor) : super(const _Loading()) {
    on<NAMEEvent>(_onEvent);
  }

  final NAMEInteractor _interactor;

  Future<void> _onEvent(
    NAMEEvent events,
    Emitter<NAMEState> emit,
  ) {
    return events.map(
      check: (event) async {
        try {
          emit(const NAMEState.loading());
          // _interactor.
          emit(const NAMEState.success());
        } catch (e) {
          emit(NAMEState.error(e));
        }
      },
    );
  }
}
`;

const eventCode = `part of 'LOWER_CASE_bloc.dart';

@freezed
class NAMEEvent with _$NAMEEvent {
  const factory NAMEEvent.check() = _check;
}
`;

const stateCode = `part of 'LOWER_CASE_bloc.dart';

@freezed
class NAMEState with _$NAMEState {
  const factory NAMEState.loading() = _Loading;
  const factory NAMEState.success() = _Success;
  const factory NAMEState.error(dynamic e) = _Error;
}
`;

function file(name, code) {
	return { id: uid(), kind: 'file', name, code: code || '' };
}

function folder(name, contents) {
	return { id: uid(), kind: 'folder', name, contents: contents || [], expanded: false };
}

function category(name, contents) {
	return { id: uid(), category: name, contents: contents || [], expanded: false };
}

function mvpTree() {
	return [
		category('data', [
			folder('models', [file('NAME_model.dart', modelCode)]),
			folder('repository', [file('NAME_repository_impl.dart', repositoryImplCode)]),
		]),
		category('domain', [
			folder('interactor', [file('NAME_interactor.dart', interactorCode)]),
			folder('repository', [file('NAME_repository.dart', repositoryCode)]),
		]),
		category('presentation', [
			folder('widgets', []),
			folder('bloc', [
				file('NAME_bloc.dart', blocCode),
				file('NAME_event.dart', eventCode),
				file('NAME_state.dart', stateCode),
			]),
			folder('pages', [file('NAME_page.dart', '')]),
		]),
	];
}

function findContainer(id, list) {
	for (const node of list) {
		if (node.id === id) {
			return node;
		}
		if (node.contents) {
			const nested = findContainer(id, node.contents);
			if (nested) {
				return nested;
			}
		}
	}
	return null;
}

function removeNode(id, list) {
	const index = list.findIndex((node) => node.id === id);
	if (index >= 0) {
		list.splice(index, 1);
		return true;
	}
	for (const node of list) {
		if (node.contents && removeNode(id, node.contents)) {
			return true;
		}
	}
	return false;
}

function findPath(id, list, trail) {
	const path = trail || [];
	for (const node of list) {
		const next = path.concat(node);
		if (node.id === id) {
			return next;
		}
		if (node.contents) {
			const nested = findPath(id, node.contents, next);
			if (nested) {
				return nested;
			}
		}
	}
	return null;
}

function findFile(id, list) {
	for (const node of list) {
		if (node.kind === 'file' && node.id === id) {
			return node;
		}
		if (node.contents) {
			const nested = findFile(id, node.contents);
			if (nested) {
				return nested;
			}
		}
	}
	return null;
}

function setExpanded(list, expanded) {
	list.forEach((node) => {
		if (node.contents) {
			node.expanded = expanded;
			setExpanded(node.contents, expanded);
		}
	});
}

function branchesOpen(list) {
	return list.every((node) => {
		if (!node.contents) {
			return true;
		}
		return node.expanded !== false && branchesOpen(node.contents);
	});
}

function syncTreeToggle() {
	const button = document.getElementById('toggle-tree');
	if (!button) {
		return;
	}
	const open = state.generate.length > 0 && branchesOpen(state.generate);
	button.textContent = open ? 'Свернуть' : 'Развернуть';
	button.setAttribute('aria-pressed', String(open));
}

function paintBranch(branch, expanded) {
	branch.classList.toggle('collapsed', !expanded);
	const twist = branch.querySelector(':scope > .node-bar > .twist, :scope > .category-bar > .twist');
	if (!twist) {
		return;
	}
	twist.setAttribute('aria-expanded', String(expanded));
	twist.setAttribute('aria-label', expanded ? 'Свернуть' : 'Развернуть');
}

function twistButton(node) {
	const open = node.expanded !== false;
	const label = open ? 'Свернуть' : 'Развернуть';
	return `<button type="button" class="twist" data-action="toggle" data-id="${node.id}" aria-expanded="${open}" aria-label="${label}">${open ? '▾' : '▸'}</button>`;
}

function indent(level) {
	return ' '.repeat(level);
}

function emitCode(lines, code, level) {
	const body = String(code).replace(/\s+$/, '');
	if (!body) {
		return;
	}
	lines.push(`${indent(level)}code: |`);
	body.split('\n').forEach((line) => {
		lines.push(`${indent(level + 2)}${line}`);
	});
}

function emitContents(lines, contents, level) {
	contents.forEach((node) => {
		if (node.kind === 'folder') {
			lines.push(`${indent(level)}- folder: ${node.name || 'folder'}`);
			if (node.contents.length) {
				lines.push(`${indent(level + 2)}contents:`);
				emitContents(lines, node.contents, level + 4);
			}
			return;
		}
		lines.push(`${indent(level)}- file: ${node.name || 'NAME.dart'}`);
		emitCode(lines, node.code, level + 2);
	});
}

function toYaml() {
	const lines = [
		'# **************************************************************************',
		'# * ArchitectureGenerator - Simpler Flutter Generator -',
		'# **************************************************************************',
		'',
		'# ----MVVM clean architecture----------------------------------> start',
		'generate:',
	];
	state.generate.forEach((section) => {
		lines.push(`  - category: ${section.category || 'feature'}`);
		if (section.contents.length) {
			lines.push('    contents:');
			emitContents(lines, section.contents, 6);
		}
	});
	lines.push('# ------------------------------------------------------------- end');
	lines.push('');
	return lines.join('\n');
}

function choiceGroup(title, key, options, note) {
	const current = state.settings[key];
	const picked = options.find((option) => option.value === current) || options[0];
	const items = options.map((option) => {
		const on = current === option.value ? ' on' : '';
		return `<label class="choice${on}">
			<input type="radio" name="${key}" value="${option.value}" ${current === option.value ? 'checked' : ''}>
			<span>${option.label}${option.hint ? `<small>${option.hint}</small>` : ''}</span>
		</label>`;
	}).join('');
	return `<section class="card">
		<h3>${title}</h3>
		${note ? `<p class="hint">${note}</p>` : ''}
		<div class="choices">${items}</div>
		<p class="picked">Сейчас: <strong>${picked.label}</strong> — ${picked.hint}</p>
	</section>`;
}

function modeSwitch() {
	const machine = state.settings.stateMachine === 'cubit' ? 'cubit' : 'bloc';
	const modes = [
		{ value: 'bloc', title: 'Use Bloc', hint: 'event, bloc и state' },
		{ value: 'cubit', title: 'Use Cubit', hint: 'cubit и state, без event' },
	];
	return `<section class="card">
		<h3>Что генерировать</h3>
		<div class="modes">
			${modes.map((mode) => `
				<label class="mode${machine === mode.value ? ' on' : ''}">
					<input type="radio" name="stateMachine" value="${mode.value}" ${machine === mode.value ? 'checked' : ''}>
					<strong>${mode.title}</strong>
					<small>${mode.hint}</small>
				</label>`).join('')}
		</div>
	</section>`;
}
function renderSettings() {
	const machine = state.settings.stateMachine === 'cubit' ? 'cubit' : 'bloc';
	const typeKey = machine === 'cubit' ? 'cubitType' : 'blocType';

	document.getElementById('settings').innerHTML = `
		${modeSwitch()}
		${choiceGroup(machine === 'cubit' ? 'Use Cubit' : 'Use Bloc', typeKey, TEMPLATE_TYPES, machine === 'cubit' ? 'Тип для Use Cubit.' : 'Тип для Use Bloc.')}
		<section class="card">
			<h3>State Widget</h3>
			<label class="switch-row">
				<span>Create State Widget<small>страница из настройки расширения</small></span>
				<input type="checkbox" data-setting="createStateWidget" ${state.settings.createStateWidget ? 'checked' : ''}>
			</label>
			<div class="choices">
				${WIDGET_TYPES.map((option) => `
					<label class="choice${state.settings.stateWidget === option.value ? ' on' : ''}">
						<input type="radio" name="stateWidget" value="${option.value}" ${state.settings.stateWidget === option.value ? 'checked' : ''}>
						${option.label}
					</label>`).join('')}
			</div>
		</section>
		<section class="card">
			<h3>File yaml</h3>
			<div class="card-actions">
				<button type="button" class="btn" id="reset-preset">Шаблон MVVM</button>
				<button type="button" class="btn" id="copy-yaml">Копировать</button>
			</div>
		</section>
		<p class="standalone-note">Копирование yaml работает и в браузере. Запись в проект работает из VS Code.</p>`;
}

function renderNode(node) {
	if (node.kind === 'file') {
		const selected = node.id === selectedId ? ' selected' : '';
		const fresh = isJustAdded(node) ? ' fresh' : '';
		return `<div class="file${selected}${fresh}">
			<div class="node-bar">
				<span class="tag">file</span>
				<input class="name-input" data-rename="${node.id}" value="${escapeAttr(node.name)}">
				<button type="button" class="btn tiny" data-action="edit" data-id="${node.id}">код</button>
				<button type="button" class="btn tiny danger" data-action="delete" data-id="${node.id}">×</button>
			</div>
		</div>`;
	}
	const open = node.expanded !== false;
	const children = (node.contents || []).map(renderNode).join('');
	const fresh = isJustAdded(node) ? ' fresh' : '';
	return `<div class="folder${open ? '' : ' collapsed'}${fresh}">
		<div class="node-bar">
			${twistButton(node)}
			<span class="tag">folder</span>
			<input class="name-input" data-rename="${node.id}" value="${escapeAttr(node.name)}">
			<button type="button" class="btn tiny" data-action="add-folder" data-id="${node.id}">+ папка</button>
			<button type="button" class="btn tiny" data-action="add-file" data-id="${node.id}">+ файл</button>
			<button type="button" class="btn tiny danger" data-action="delete" data-id="${node.id}">×</button>
		</div>
		<div class="contents"><div class="contents-clip">${children}</div></div>
	</div>`;
}

function renderTree() {
	document.getElementById('tree').innerHTML = state.generate.map((section) => {
		const open = section.expanded !== false;
		const children = section.contents.map(renderNode).join('');
		return `
		<section class="category${open ? '' : ' collapsed'}">
			<div class="category-bar">
				${twistButton(section)}
				<span class="tag">layer</span>
				<input class="name-input" data-rename="${section.id}" value="${escapeAttr(section.category)}">
				<button type="button" class="btn tiny" data-action="add-folder" data-id="${section.id}">+ папка</button>
				<button type="button" class="btn tiny" data-action="add-file" data-id="${section.id}">+ файл</button>
				<button type="button" class="btn tiny danger" data-action="delete" data-id="${section.id}">×</button>
			</div>
			<div class="contents"><div class="contents-clip">${children}</div></div>
		</section>`;
	}).join('');
	syncTreeToggle();
}

function renderYaml() {
	document.getElementById('yaml').textContent = toYaml();
}

function render() {
	renderSettings();
	renderTree();
	renderYaml();
	syncEditor();
}

function syncEditor() {
	const editor = document.getElementById('editor');
	const fileNode = selectedId ? findFile(selectedId, state.generate) : null;
	if (!fileNode) {
		editor.hidden = true;
		return;
	}
	editor.hidden = false;
	renderEditorPath();
	const area = document.getElementById('editor-code');
	if (area.value !== fileNode.code && document.activeElement !== area) {
		area.value = fileNode.code;
	}
}

function renderEditorPath() {
	const path = selectedId ? findPath(selectedId, state.generate) : null;
	const box = document.getElementById('editor-path');
	if (!path) {
		box.innerHTML = '';
		return;
	}
	box.innerHTML = pathTree(path, 0);
}

function pathTree(nodes, index) {
	const node = nodes[index];
	const kind = node.kind || 'layer';
	const name = escapeHtml(node.name || node.category || 'файл');
	const last = index === nodes.length - 1;
	const mark = last ? '' : '<span class="path-twist" aria-hidden="true"></span>';
	const child = last ? '' : pathTree(nodes, index + 1);
	return `<div class="path-branch">
		<div class="path-row${last ? ' current' : ''}">${mark}<span class="tag">${kind}</span><strong>${name}</strong></div>
		${child}
	</div>`;
}

function escapeHtml(value) {
	return String(value || '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function escapeAttr(value) {
	return escapeHtml(value).replace(/"/g, '&quot;');
}

function loadYamlDocument(doc) {
	if (!doc || typeof doc !== 'object' || !Array.isArray(doc.generate)) {
		return false;
	}
	LAYER_FLAGS.forEach(([key]) => {
		state.flags[key] = !!doc[key];
	});
	state.generate = doc.generate.map((section) => category(section.category || 'feature', normalizeContents(section.contents)));
	selectedId = null;
	return true;
}

function normalizeContents(list) {
	if (!Array.isArray(list)) {
		return [];
	}
	return list.map((item) => {
		if (item.folder) {
			return folder(item.folder, normalizeContents(item.contents));
		}
		if (item.file) {
			return file(item.file, typeof item.code === 'string' ? item.code : '');
		}
		return null;
	}).filter(Boolean);
}

function applyMvp() {
	if (templateDocument && loadYamlDocument(templateDocument)) {
		selectedId = null;
		render();
		return;
	}
	state.flags = {
		dataSource: false,
		dataModel: false,
		dataRepository: false,
		entityModel: false,
		domainRepository: false,
		usecase: false,
		stateWidget: false,
	};
	state.generate = mvpTree();
	selectedId = null;
	render();
}

function isTemplateState() {
	if (!templateDocument) {
		return false;
	}
	const flagsBackup = { ...state.flags };
	const generateBackup = state.generate;
	const selectedBackup = selectedId;
	const current = currentYaml();
	const loaded = loadYamlDocument(templateDocument);
	const templateYaml = loaded ? currentYaml() : '';
	state.flags = flagsBackup;
	state.generate = generateBackup;
	selectedId = selectedBackup;
	return loaded && current === templateYaml;
}

function currentYaml() {
	return toYaml();
}

function isSection(node) {
	return Boolean(node && node.category !== undefined && node.kind === undefined);
}

function isJustAdded(node) {
	return Boolean(node && node.createdAt && Date.now() - node.createdAt < 2800);
}

function isFresh(node) {
	return Boolean(node && node.createdAt && Date.now() - node.createdAt < 5000);
}

function deleteNode(id) {
	removeNode(id, state.generate);
	if (selectedId === id) {
		selectedId = null;
	}
	render();
}

document.getElementById('settings').addEventListener('change', (event) => {
	if (event.target.dataset.setting === 'createStateWidget') {
		state.settings.createStateWidget = event.target.checked;
		renderYaml();
		persistSettings();
		return;
	}
	if (event.target.name && event.target.name in state.settings) {
		state.settings[event.target.name] = event.target.value;
		renderSettings();
		persistSettings();
	}
});

document.getElementById('tree').addEventListener('click', (event) => {
	const button = event.target.closest('[data-action]');
	if (!button) {
		return;
	}
	const id = button.dataset.id;
	if (button.dataset.action === 'toggle') {
		const node = findContainer(id, state.generate);
		const branch = button.closest('.folder, .category');
		if (node && branch) {
			node.expanded = node.expanded === false;
			paintBranch(branch, node.expanded !== false);
			syncTreeToggle();
		}
		return;
	}
	if (button.dataset.action === 'delete') {
		const node = findContainer(id, state.generate);
		const name = node ? (node.name || node.category || 'элемент') : 'элемент';
		if (!isSection(node) && isFresh(node)) {
			deleteNode(id);
			return;
		}
		if (vscodeApi) {
			vscodeApi.postMessage({ type: 'confirmDelete', id, name });
			return;
		}
		if (confirm(`Удалить ${name}?`)) {
			deleteNode(id);
		}
		return;
	}
	if (button.dataset.action === 'add-folder' || button.dataset.action === 'add-file') {
		const parent = findContainer(id, state.generate);
		if (!parent) {
			return;
		}
		parent.contents = parent.contents || [];
		parent.expanded = true;
		const node = button.dataset.action === 'add-folder'
			? folder('folder', [])
			: file('NAME.dart', '');
		node.createdAt = Date.now();
		parent.contents.push(node);
		if (node.kind === 'file') {
			selectedId = node.id;
		}
		render();
		const born = document.querySelector(`[data-rename="${node.id}"]`);
		if (born) {
			born.closest('.file, .folder').scrollIntoView({ block: 'nearest' });
		}
		return;
	}
	if (button.dataset.action === 'edit') {
		selectedId = id;
		renderTree();
		syncEditor();
		document.getElementById('editor').scrollIntoView({ block: 'nearest' });
		document.getElementById('editor-code').focus();
	}
});

document.getElementById('tree').addEventListener('input', (event) => {
	const id = event.target.dataset.rename;
	if (!id) {
		return;
	}
	const node = findContainer(id, state.generate);
	if (!node) {
		return;
	}
	if (node.category !== undefined && node.kind === undefined) {
		node.category = event.target.value;
	} else {
		node.name = event.target.value;
	}
	renderYaml();
	if (selectedId) {
		renderEditorPath();
	}
});

document.getElementById('add-category').addEventListener('click', () => {
	state.generate.push(category('feature', []));
	render();
});

document.getElementById('toggle-tree').addEventListener('click', () => {
	const open = state.generate.length > 0 && branchesOpen(state.generate);
	setExpanded(state.generate, !open);
	document.querySelectorAll('#tree .folder, #tree .category').forEach((branch) => {
		const twist = branch.querySelector(':scope > .node-bar > .twist, :scope > .category-bar > .twist');
		const node = twist && findContainer(twist.dataset.id, state.generate);
		paintBranch(branch, node ? node.expanded !== false : !open);
	});
	syncTreeToggle();
});

document.getElementById('editor-code').addEventListener('input', (event) => {
	const fileNode = findFile(selectedId, state.generate);
	if (!fileNode) {
		return;
	}
	fileNode.code = event.target.value;
	renderYaml();
});

document.getElementById('editor-close').addEventListener('click', () => {
	selectedId = null;
	renderTree();
	syncEditor();
});

document.getElementById('settings').addEventListener('click', async (event) => {
	const button = event.target.closest('button');
	if (!button) {
		return;
	}
	if (button.id === 'reset-preset') {
		if (projectFileLoaded && !isTemplateState()) {
			if (vscodeApi) {
				vscodeApi.postMessage({ type: 'confirmArchitectureTemplate' });
				return;
			}
			if (!confirm('В simpler_generator_folders.yaml уже есть свои настройки, не шаблон. Заменить их шаблоном MVVM?')) {
				return;
			}
		}
		applyMvp();
		return;
	}
	if (button.id === 'copy-yaml') {
		const yaml = currentYaml();
		if (vscodeApi) {
			vscodeApi.postMessage({ type: 'copy', yaml });
			return;
		}
		await navigator.clipboard.writeText(yaml);
	}
});

document.getElementById('toggle-structure').addEventListener('click', () => {
	const layout = document.getElementById('layout');
	const button = document.getElementById('toggle-structure');
	const full = layout.classList.toggle('structure-full');
	button.setAttribute('aria-pressed', String(full));
	button.textContent = full ? 'Вернуть' : 'На весь';
	document.getElementById('settings').setAttribute('aria-hidden', String(full));
	document.getElementById('yaml-pane').setAttribute('aria-hidden', String(full));
});

document.getElementById('toggle-yaml').addEventListener('click', () => {
	const layout = document.getElementById('layout');
	const pane = document.getElementById('yaml-pane');
	const button = document.getElementById('toggle-yaml');
	const hidden = layout.classList.toggle('yaml-hidden');
	pane.classList.toggle('collapsed', hidden);
	button.setAttribute('aria-expanded', String(!hidden));
	button.textContent = hidden ? 'YAML' : 'Скрыть';
	button.setAttribute('aria-label', hidden ? 'Показать yaml' : 'Скрыть yaml');
});

document.getElementById('import-yaml').addEventListener('click', () => {
	if (!vscodeApi) {
		return;
	}
	vscodeApi.postMessage({
		type: 'importArchitectureYaml',
		replace: !isTemplateState(),
	});
});

document.getElementById('export-yaml').addEventListener('click', () => {
	const yaml = currentYaml();
	if (vscodeApi) {
		vscodeApi.postMessage({ type: 'exportArchitectureYaml', yaml });
		return;
	}
	const blob = new Blob([yaml], { type: 'text/yaml' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = 'simpler_generator_folders.yaml';
	link.click();
	URL.revokeObjectURL(link.href);
});

function persistSettings() {
	if (!vscodeApi) {
		return;
	}
	vscodeApi.postMessage({ type: 'applySettings', settings: state.settings });
}

document.getElementById('save-yaml').addEventListener('click', () => {
	const yaml = currentYaml();
	if (vscodeApi) {
		projectFileLoaded = true;
		vscodeApi.postMessage({ type: 'saveYaml', yaml });
		return;
	}
	const blob = new Blob([yaml], { type: 'text/yaml' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = 'simpler_generator_folders.yaml';
	link.click();
	URL.revokeObjectURL(link.href);
});

document.getElementById('back-menu').addEventListener('click', () => {
	if (vscodeApi) {
		vscodeApi.postMessage({ type: 'back' });
	}
});

window.addEventListener('message', (event) => {
	const message = event.data;
	if (!message || (message.type !== 'init' && message.type !== 'applyArchitectureTemplate' && message.type !== 'applyDelete' && message.type !== 'applyImportedYaml')) {
		return;
	}
	if (message.type === 'applyImportedYaml') {
		if (!loadYamlDocument(message.yaml)) {
			return;
		}
		projectFileLoaded = true;
		render();
		return;
	}
	if (message.type === 'applyDelete' && message.id) {
		deleteNode(message.id);
		return;
	}
	if (message.type === 'applyArchitectureTemplate') {
		applyMvp();
		return;
	}
	if (message.template) {
		templateDocument = message.template;
	}
	if (message.settings) {
		state.settings = { ...state.settings, ...message.settings };
	}
	if (!loadYamlDocument(message.yaml)) {
		projectFileLoaded = false;
		applyMvp();
		return;
	}
	projectFileLoaded = true;
	render();
});

if (vscodeApi) {
	document.body.classList.add('vscode');
	vscodeApi.postMessage({ type: 'ready' });
} else {
	document.body.classList.add('browser');
	state.generate = mvpTree();
	render();
}

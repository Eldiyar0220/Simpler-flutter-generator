const FILE_TYPES = ['.png', '.jpg', '.jpeg', '.webp', '.webm', '.bmp', '.svg', '.gif', '.riv', '.json'];

let seq = 1;
const uid = () => `g${seq++}`;

const state = {
	generateAll: false,
	groups: [],
};

let openId = 'general';
let projectFileLoaded = false;
let vscodeApi = null;
try {
	vscodeApi = acquireVsCodeApi();
} catch (error) {
	vscodeApi = null;
}

function presetGroup() {
	return {
		id: uid(),
		paths: ['assets/images'],
		className: 'AppImages',
		types: FILE_TYPES.slice(),
		outputPath: 'lib/core/constant',
		warnings: true,
		checkUnusedVariables: false,
		checkUnusedAssets: false,
	};
}

function applyPreset() {
	seq = 1;
	state.generateAll = false;
	state.groups = [presetGroup()];
	openId = 'general';
	render();
}

function isTemplateState() {
	if (state.generateAll || state.groups.length !== 1) {
		return false;
	}
	const group = state.groups[0];
	const same = (left, right) => left.length === right.length && left.every((item, index) => item === right[index]);
	return group.className === 'AppImages'
		&& group.outputPath === 'lib/core/constant'
		&& group.warnings === true
		&& !group.checkUnusedVariables
		&& !group.checkUnusedAssets
		&& same(group.paths, ['assets/images'])
		&& same(group.types, FILE_TYPES);
}

function enabledCount(group) {
	return [group.warnings, group.checkUnusedVariables, group.checkUnusedAssets].filter(Boolean).length;
}

function yamlScalar(value) {
	const text = String(value ?? '');
	if (
		text === ''
		|| /[:#\n'"{}\[\],&*!|>%@`]/.test(text)
		|| /^(true|false|null|yes|no|~)$/i.test(text)
		|| /^\s|\s$/.test(text)
	) {
		return JSON.stringify(text);
	}
	return text;
}

function toYaml() {
	const lines = [
		'# **************************************************************************',
		'# * ImagesGenerator - Simpler FLutter Generator - Enjoy bro 😜👍',
		'# **************************************************************************',
		'',
		`generateAll: ${state.generateAll} # default [false]`,
		'',
		'groups:',
	];

	state.groups.forEach((group) => {
		const paths = group.paths.length ? group.paths : ['assets/images'];
		if (paths.length === 1) {
			lines.push(`  - path: ${yamlScalar(paths[0])}`);
		} else {
			lines.push('  - path:');
			paths.forEach((item) => lines.push(`      - ${yamlScalar(item)}`));
		}
		lines.push(`    class_name: ${yamlScalar(group.className || 'AppImages')}`);
		lines.push(`    types: [${group.types.join(', ')}]`);
		lines.push(`    outputPath: ${yamlScalar(group.outputPath || 'lib/core/constant')}`);
		lines.push(`    warnings: ${!!group.warnings}`);
		lines.push('');
		lines.push('    # Warning do not put to true both, it will take very long analyze your project!!');
		lines.push(`    checkUnusedVariables: ${!!group.checkUnusedVariables}`);
		lines.push(`    checkUnusedAssets: ${!!group.checkUnusedAssets}`);
		lines.push('');
	});

	return lines.join('\n');
}

function loadDocument(doc) {
	if (!doc || !Array.isArray(doc.groups) || doc.groups.length === 0) {
		return false;
	}
	state.generateAll = !!doc.generateAll;
	state.groups = doc.groups.map((group) => {
		const rawPaths = Array.isArray(group.path) ? group.path : [group.path];
		const types = Array.isArray(group.types)
			? group.types.map((type) => {
			const text = String(type).toLowerCase();
			return text.startsWith('.') ? text : `.${text}`;
			})
			: FILE_TYPES.slice();
		return {
			id: uid(),
			paths: rawPaths.filter((item) => item != null && String(item).trim() !== '').map(String),
			className: group.class_name ? String(group.class_name) : 'AppImages',
			types: types.filter((type) => FILE_TYPES.includes(type)),
			outputPath: group.outputPath ? String(group.outputPath) : 'lib/core/constant',
			warnings: group.warnings !== false,
			checkUnusedVariables: !!group.checkUnusedVariables,
			checkUnusedAssets: !!group.checkUnusedAssets,
		};
	});
	state.groups.forEach((group) => {
		if (group.paths.length === 0) {
			group.paths.push('assets/images');
		}
		if (group.types.length === 0) {
			group.types = FILE_TYPES.slice();
		}
	});
	return true;
}

function groupById(id) {
	return state.groups.find((group) => group.id === id);
}

function renderNav() {
	const generalCount = state.generateAll ? '1/1' : '0/1';
	const items = [
		`<button type="button" class="nav-item${openId === 'general' ? ' on' : ''}" data-target="general"><span>General</span><em>${generalCount}</em></button>`,
	];
	state.groups.forEach((group, index) => {
		const title = group.className.trim() || `Группа ${index + 1}`;
		items.push(
			`<button type="button" class="nav-item${openId === group.id ? ' on' : ''}" data-target="${group.id}"><span>${escapeHtml(title)}</span><em>${enabledCount(group)}/3</em></button>`
		);
	});
	items.push('<button type="button" class="add-group" id="add-group">+ группа</button>');
	document.getElementById('nav').innerHTML = items.join('');
}

function switchRow(title, note, field, checked, groupId) {
	const groupAttr = groupId ? ` data-group-field="1"` : '';
	return `<div class="row">
		<div><strong>${title}</strong><small>${note}</small></div>
		<label class="switch">
			<input type="checkbox" data-field="${field}"${groupAttr}${checked ? ' checked' : ''}>
			<i></i>
		</label>
	</div>`;
}

function renderCards() {
	const query = document.getElementById('search').value.trim().toLowerCase();
	const generalHidden = query && !'general generate all'.includes(query) && !'generateall'.includes(query) ? ' hidden' : '';
	const cards = [`<section class="block${openId === 'general' ? ' open' : ''}${generalHidden}" data-id="general" data-title="general generate all">
		<button type="button" class="block-head" data-toggle="general">
			<div>
				<strong>General</strong>
				<em>${state.generateAll ? '1/1' : '0/1'}</em>
				<p>Общие параметры simpler_generator_images.yaml.</p>
			</div>
			<span class="chevron" aria-hidden="true"></span>
		</button>
		<div class="block-body"><div class="clip">
			${switchRow(
				'Generate all',
				'Включено — собирает все группы. Выключено — спросит один class_name.',
				'generateAll',
				state.generateAll
			)}
		</div></div>
	</section>`];

	state.groups.forEach((group, index) => {
		const title = group.className.trim() || `Группа ${index + 1}`;
		const haystack = `${title} ${group.paths.join(' ')} ${group.outputPath}`.toLowerCase();
		const hidden = query && !haystack.includes(query) ? ' hidden' : '';
		const both = group.checkUnusedVariables && group.checkUnusedAssets;
		const paths = group.paths.map((path, pathIndex) => `<div class="path-row">
			<input data-field="path" data-index="${pathIndex}" value="${escapeAttr(path)}" spellcheck="false">
			<button type="button" class="btn tiny danger" data-action="remove-path" data-index="${pathIndex}"${group.paths.length === 1 ? ' disabled' : ''}>×</button>
		</div>`).join('');
		const chips = FILE_TYPES.map((type) => {
			const on = group.types.includes(type) ? ' on' : '';
			return `<button type="button" class="chip${on}" data-action="toggle-type" data-type="${type}">${type}</button>`;
		}).join('');
		cards.push(`<section class="block${openId === group.id ? ' open' : ''}${hidden}" data-id="${group.id}" data-group="${group.id}">
			<button type="button" class="block-head" data-toggle="${group.id}">
				<div>
					<strong>${escapeHtml(title)}</strong>
					<em>${enabledCount(group)}/3</em>
					<p>${escapeHtml(group.paths.filter(Boolean).join(', ') || 'путь не задан')}</p>
				</div>
				<span class="chevron" aria-hidden="true"></span>
			</button>
			<div class="block-body"><div class="clip">
				<label class="field"><span>Class name</span><input data-field="className" value="${escapeAttr(group.className)}" spellcheck="false"></label>
				<label class="field"><span>Output path</span><input data-field="outputPath" value="${escapeAttr(group.outputPath)}" spellcheck="false"></label>
				<div class="field">
					<span>Path</span>
					<div class="paths">${paths}</div>
					<button type="button" class="btn tiny" data-action="add-path">+ путь</button>
				</div>
				<div class="field">
					<span>Types</span>
					<div class="chips">${chips}</div>
				</div>
				${switchRow('Warnings', 'Пустое имя файла помечается предупреждением.', 'warnings', group.warnings, group.id)}
				${switchRow('Check unused variables', 'Ищет переменные класса, которые нигде не используются.', 'checkUnusedVariables', group.checkUnusedVariables, group.id)}
				${switchRow('Check unused assets', 'Пишет UNUSED_ASSETS.dart для файлов без ссылок.', 'checkUnusedAssets', group.checkUnusedAssets, group.id)}
				<p class="warn${both ? ' show' : ''}">Обе проверки сразу долго обходят проект. Оставь включённой одну.</p>
				<div class="card-tools">
					<button type="button" class="btn tiny danger" data-action="delete-group"${state.groups.length === 1 ? ' disabled' : ''}>Удалить группу</button>
				</div>
			</div></div>
		</section>`);
	});

	document.getElementById('cards').innerHTML = cards.join('');
}

function renderYaml() {
	document.getElementById('yaml').textContent = toYaml();
}

function render() {
	renderNav();
	renderCards();
	renderYaml();
}

function select(id) {
	openId = id;
	renderNav();
	document.querySelectorAll('.block').forEach((block) => {
		block.classList.toggle('open', block.dataset.id === id);
	});
	const block = document.querySelector(`.block[data-id="${id}"]`);
	if (block) {
		block.scrollIntoView({ block: 'nearest' });
	}
}

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function escapeAttr(value) {
	return escapeHtml(value).replace(/"/g, '&quot;');
}

function download(name) {
	const blob = new Blob([toYaml()], { type: 'text/yaml' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = name;
	link.click();
	URL.revokeObjectURL(link.href);
}

document.getElementById('nav').addEventListener('click', (event) => {
	if (event.target.closest('#add-group')) {
		const group = presetGroup();
		group.className = `AppImages${state.groups.length + 1}`;
		group.paths = ['assets/images'];
		state.groups.push(group);
		openId = group.id;
		render();
		return;
	}
	const item = event.target.closest('[data-target]');
	if (!item) {
		return;
	}
	select(item.dataset.target);
});

document.getElementById('cards').addEventListener('click', (event) => {
	const toggle = event.target.closest('[data-toggle]');
	if (toggle && event.target.closest('.block-head')) {
		const id = toggle.dataset.toggle;
		openId = openId === id ? '' : id;
		renderNav();
		document.querySelectorAll('.block').forEach((block) => {
			block.classList.toggle('open', block.dataset.id === openId);
		});
		return;
	}

	const action = event.target.closest('[data-action]');
	if (!action) {
		return;
	}
	const section = action.closest('[data-group]');
	const group = groupById(section.dataset.group);
	if (!group) {
		return;
	}
	if (action.dataset.action === 'add-path') {
		group.paths.push('');
	} else if (action.dataset.action === 'remove-path' && group.paths.length > 1) {
		group.paths.splice(Number(action.dataset.index), 1);
	} else if (action.dataset.action === 'toggle-type') {
		const type = action.dataset.type;
		if (group.types.includes(type)) {
			if (group.types.length === 1) {
				return;
			}
			group.types = group.types.filter((item) => item !== type);
		} else {
			group.types = FILE_TYPES.filter((item) => group.types.includes(item) || item === type);
		}
	} else if (action.dataset.action === 'delete-group') {
		if (state.groups.length === 1) {
			return;
		}
		state.groups = state.groups.filter((item) => item.id !== group.id);
		openId = 'general';
	}
	render();
});

document.getElementById('cards').addEventListener('input', (event) => {
	const input = event.target;
	const field = input.dataset.field;
	if (!field || input.type === 'checkbox') {
		return;
	}
	const section = input.closest('[data-group]');
	const group = section ? groupById(section.dataset.group) : null;
	if (!group) {
		return;
	}
	if (field === 'path') {
		group.paths[Number(input.dataset.index)] = input.value;
		const note = section.querySelector('.block-head p');
		if (note) {
			note.textContent = group.paths.filter(Boolean).join(', ') || 'путь не задан';
		}
	} else if (field === 'className') {
		group.className = input.value;
		const head = section.querySelector('.block-head strong');
		if (head) {
			head.textContent = input.value.trim() || 'Группа';
		}
	} else if (field === 'outputPath') {
		group.outputPath = input.value;
	}
	renderNav();
	renderYaml();
});

document.getElementById('cards').addEventListener('change', (event) => {
	const input = event.target;
	if (input.type !== 'checkbox') {
		return;
	}
	if (input.dataset.field === 'generateAll') {
		state.generateAll = input.checked;
		renderNav();
		const count = document.querySelector('[data-id="general"] .block-head em');
		if (count) {
			count.textContent = state.generateAll ? '1/1' : '0/1';
		}
		renderYaml();
		return;
	}
	const section = input.closest('[data-group]');
	const group = section ? groupById(section.dataset.group) : null;
	if (!group) {
		return;
	}
	group[input.dataset.field] = input.checked;
	const count = section.querySelector('.block-head em');
	if (count) {
		count.textContent = `${enabledCount(group)}/3`;
	}
	section.querySelector('.warn').classList.toggle('show', group.checkUnusedVariables && group.checkUnusedAssets);
	renderNav();
	renderYaml();
});

document.getElementById('search').addEventListener('input', () => {
	const query = document.getElementById('search').value.trim().toLowerCase();
	document.querySelectorAll('.block').forEach((block) => {
		if (block.dataset.id === 'general') {
			block.classList.toggle('hidden', query.length > 0 && !'general generate all'.includes(query));
			return;
		}
		const group = groupById(block.dataset.group);
		const haystack = group
			? `${group.className} ${group.paths.join(' ')} ${group.outputPath}`.toLowerCase()
			: '';
		block.classList.toggle('hidden', query.length > 0 && !haystack.includes(query));
	});
});

document.getElementById('help-examples').addEventListener('click', () => {
	document.getElementById('examples').hidden = false;
});

document.getElementById('examples-close').addEventListener('click', () => {
	document.getElementById('examples').hidden = true;
});

document.getElementById('examples').addEventListener('click', (event) => {
	if (event.target.id === 'examples') {
		event.currentTarget.hidden = true;
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		document.getElementById('examples').hidden = true;
	}
});

document.getElementById('reset-preset').addEventListener('click', () => {
	if (projectFileLoaded && !isTemplateState()) {
		if (vscodeApi) {
			vscodeApi.postMessage({ type: 'confirmImagesTemplate' });
			return;
		}
		if (!confirm('В simpler_generator_images.yaml уже есть свои настройки, не шаблон. Заменить их шаблоном?')) {
			return;
		}
	}
	applyPreset();
});

document.getElementById('copy-yaml').addEventListener('click', async () => {
	const yaml = toYaml();
	if (vscodeApi) {
		vscodeApi.postMessage({ type: 'copy', yaml });
		return;
	}
	await navigator.clipboard.writeText(yaml);
});

document.getElementById('download-yaml').addEventListener('click', () => {
	download('simpler_generator_images.yaml');
});

document.getElementById('save-yaml').addEventListener('click', () => {
	const yaml = toYaml();
	if (vscodeApi) {
		projectFileLoaded = true;
		vscodeApi.postMessage({ type: 'saveImagesYaml', yaml });
		return;
	}
	download('simpler_generator_images.yaml');
});

document.getElementById('back-menu').addEventListener('click', () => {
	if (vscodeApi) {
		vscodeApi.postMessage({ type: 'back' });
	}
});

window.addEventListener('message', (event) => {
	const message = event.data;
	if (!message || (message.type !== 'init' && message.type !== 'applyImagesTemplate')) {
		return;
	}
	if (message.type === 'applyImagesTemplate') {
		applyPreset();
		return;
	}
	if (!loadDocument(message.yaml)) {
		projectFileLoaded = false;
		applyPreset();
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
	applyPreset();
}

// eslint-disable-next-line no-undef
window.createTasksCard = function createTasksCard({ vscodeApi, root }) {
	const IMAGES_URL = 'https://raw.githubusercontent.com/Eldiyar0220/simpler-flutter-tasks/main/images';

	const FEATURES = [
		{
			text: 'Кнопки в статус-баре: Flutter clean, Pub get, Build APK / IPA, Build Runner — в один клик',
			gif: 'simpler_flutter_tasks_first.gif',
			page: 'statusBar',
			en: 'Everyday Flutter commands live in the status bar. One click runs flutter clean, pub get, build_runner or a release build in the terminal.',
			ru: 'Повседневные команды Flutter живут в статус-баре. Один клик — и в терминале запускается flutter clean, pub get, build_runner или сборка.',
		},
		{
			text: 'Меню команд 🚀 — все команды в одном списке, 📌 закрепляет кнопку в статус-баре',
			gif: 'menu_commands.gif',
			page: 'menu',
			en: 'One quick pick with every command: pinned first, then recent, custom commands and the rest. The pin button adds or removes a status bar button.',
			ru: 'Один список со всеми командами: сначала закреплённые, потом недавние, свои команды и остальные. Кнопка 📌 добавляет или убирает кнопку в статус-баре.',
		},
		{
			text: 'Боковая панель: Build Runner, Flutter, Android, iOS, Git, Firebase',
			gif: 'menu_explorer_video.gif',
			page: 'sidebar',
			en: 'The Simpler Flutter Tasks view in the activity bar and in the Explorer groups commands by platform, so nothing has to be typed.',
			ru: 'Панель Simpler Flutter Tasks в боковой панели и в Explorer группирует команды по платформам — ничего не нужно набирать руками.',
		},
		{
			text: 'Open Build… — папка с APK / AAB / IPA любого flavor',
			gif: 'open_apk_folder.gif',
			page: 'menu',
			en: 'After a build, open the folder with the APK, AAB, IPA or .app of any flavor straight from the editor.',
			ru: 'После сборки открывает папку с APK, AAB, IPA или .app любого flavor прямо из редактора.',
		},
		{
			text: 'Свои команды: цвет, позиция, подтверждение, ввод аргумента, цепочки и группы',
			gif: 'custom_commands_v2.gif',
			page: 'customCommands',
			en: 'Turn any terminal command into a button: pick a label, color and side, ask for confirmation or an argument, chain commands and sort them into groups.',
			ru: 'Любая команда терминала превращается в кнопку: название, цвет и сторона, подтверждение или ввод аргумента, цепочки команд и группы.',
		},
		{
			text: 'Показать или скрыть любую иконку статус-бара без settings.json',
			gif: 'old_hide_show_video.gif',
			page: 'statusBar',
			en: 'Every status bar button can be shown or hidden with a toggle in the settings panel.',
			ru: 'Каждую кнопку статус-бара можно показать или скрыть переключателем в панели настроек.',
		},
		{ text: 'Flutter Flavor (Alt+F), Easy Localization, Git pull и Flutter install' },
	];

	const LINKS = [
		{ page: 'settings', title: 'Settings Panel', description: 'Все настройки Tasks на одной странице' },
	];

	let installed = false;

	function h(tag, attrs, ...children) {
		const element = document.createElement(tag);
		for (const [key, value] of Object.entries(attrs || {})) {
			if (key.startsWith('on')) {
				element.addEventListener(key.slice(2), value);
			} else if (value !== undefined && value !== false) {
				element.setAttribute(key, value === true ? '' : value);
			}
		}
		element.append(...children.flat().filter((child) => child !== null && child !== undefined && child !== false));
		return element;
	}

	function openPage(page) {
		vscodeApi.postMessage(installed ? { type: 'openTasks', page } : { type: 'openTasksMarketplace' });
	}

	function actionLabel() {
		return installed ? 'Open ↗' : 'Install ↗';
	}

	function lessonMedia(gif) {
		const media = h('div', { class: 'tasks-lesson__media' }, h('div', { class: 'tasks-lesson__spin' }));
		const image = h('img', {
			src: `${IMAGES_URL}/${gif}`,
			alt: '',
			onload: () => media.classList.add('is-loaded'),
			onerror: () => media.replaceChildren(h('div', { class: 'tasks-lesson__error' }, 'Запись не загрузилась — нужен интернет.')),
		});
		media.append(image);
		return media;
	}

	function showLesson(feature) {
		const close = () => {
			overlay.remove();
			document.removeEventListener('keydown', onKey);
		};
		const onKey = (event) => event.key === 'Escape' && close();
		const box = h('div', { class: 'tasks-lesson' },
			h('div', { class: 'tasks-lesson__title' }, 'Simpler Flutter Tasks'),
			lessonMedia(feature.gif),
			h('p', { class: 'tasks-lesson__en' }, feature.en),
			h('p', { class: 'tasks-lesson__ru' }, feature.ru),
			h('div', { class: 'tasks-lesson__actions' },
				h('button', { type: 'button', class: 'tasks-button tasks-button--ghost', onclick: () => openPage(feature.page) },
					installed ? 'Открыть в Tasks ↗' : 'Установить ↗'),
				h('button', { type: 'button', class: 'tasks-button', onclick: close }, 'Got it / Понятно')));
		const overlay = h('div', { class: 'tasks-overlay', onclick: (event) => event.target === overlay && close() }, box);
		document.addEventListener('keydown', onKey);
		document.body.append(overlay);
	}

	function featureItem(feature) {
		return h('li', { class: 'tasks-notice__item' },
			h('span', null, feature.text),
			feature.gif && h('button', { type: 'button', class: 'tasks-chip', onclick: () => showLesson(feature) }, '▶ Подробнее · More'));
	}

	function linkRow(link) {
		return h('div', { class: 'tasks-link' },
			h('div', null,
				h('strong', null, link.title),
				h('p', null, link.description)),
			h('button', { type: 'button', class: 'tasks-link__action', onclick: () => openPage(link.page) }, actionLabel()));
	}

	function render() {
		root.replaceChildren(
			h('div', { class: 'tasks-head' },
				h('div', null,
					h('div', { class: 'tasks-head__title' },
						h('strong', null, 'Simpler Flutter Tasks'),
						h('span', { class: 'ext-badge' }, 'Другое расширение · Another extension')),
					h('p', null, 'Flutter-команды в один клик: статус-бар, меню команд, свои кнопки и сборки.')),
				h('span', { class: `tasks-status${installed ? ' tasks-status--on' : ''}` },
					installed ? '✓ Установлено' : 'Не установлено')),
			h('div', { class: 'tasks-notice' },
				h('div', { class: 'tasks-notice__title' }, 'Что умеет · What it does'),
				h('ul', { class: 'tasks-notice__list' }, FEATURES.map(featureItem)),
				!installed && h('div', { class: 'tasks-notice__footer' },
					h('span', null, 'Чтобы пользоваться, установите расширение.'),
					h('button', { type: 'button', class: 'tasks-button', onclick: () => vscodeApi.postMessage({ type: 'openTasksMarketplace' }) },
						'Установить Simpler Flutter Tasks'))),
			h('div', { class: 'tasks-links' }, LINKS.map(linkRow)));
	}

	render();

	return {
		setInstalled(value) {
			installed = Boolean(value);
			render();
		},
	};
};

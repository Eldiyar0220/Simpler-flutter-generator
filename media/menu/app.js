const vscodeApi = acquireVsCodeApi();
// eslint-disable-next-line no-undef
const tasksCard = window.createTasksCard({ vscodeApi, root: document.getElementById('tasksCard') });

window.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'tasksState') {
		tasksCard.setInstalled(event.data.installed);
	}
});

function select(id) {
	document.querySelectorAll('.nav-item').forEach((item) => {
		item.classList.toggle('on', item.dataset.target === id);
	});
	document.querySelectorAll('.block').forEach((block) => {
		block.classList.toggle('open', block.dataset.id === id);
	});
	const block = document.querySelector(`.block[data-id="${id}"]`);
	if (block) {
		block.scrollIntoView({ block: 'nearest' });
	}
}

document.getElementById('nav').addEventListener('click', (event) => {
	const item = event.target.closest('[data-target]');
	if (!item) {
		return;
	}
	select(item.dataset.target);
});

document.querySelector('main').addEventListener('click', (event) => {
	const command = event.target.closest('[data-command]');
	if (!command) {
		const block = event.target.closest('.block');
		if (block) {
			select(block.dataset.id);
		}
		return;
	}
	const block = command.closest('.block');
	if (block) {
		select(block.dataset.id);
	}
	vscodeApi.postMessage({
		type: 'navigate',
		command: command.dataset.command,
	});
});

document.getElementById('search').addEventListener('input', (event) => {
	const query = event.target.value.trim().toLowerCase();
	document.querySelectorAll('.block').forEach((block) => {
		const title = block.dataset.title || '';
		block.classList.toggle('hidden', query.length > 0 && !title.includes(query));
	});
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeBrandTitle() {
	const title = document.querySelector('.brand__title');
	if (!title) {
		return;
	}
	const text = title.dataset.type || 'Simpler Flutter';
	if (reducedMotion) {
		title.textContent = text;
		title.classList.add('is-typed');
		return;
	}
	let index = 0;
	const tick = () => {
		index += 1;
		title.textContent = text.slice(0, index);
		if (index < text.length) {
			setTimeout(tick, 48);
		} else {
			setTimeout(() => title.classList.add('is-typed'), 900);
		}
	};
	setTimeout(tick, 180);
}

function setupLogoMotion() {
	const wrap = document.querySelector('.logo');
	const logo = wrap && wrap.querySelector('.logo__img');
	if (!wrap || !logo || reducedMotion) {
		return;
	}
	const setTilt = (rx, ry, tz, sc) => {
		logo.style.setProperty('--rx', `${rx}deg`);
		logo.style.setProperty('--ry', `${ry}deg`);
		logo.style.setProperty('--tz', `${tz}px`);
		logo.style.setProperty('--sc', String(sc));
	};
	wrap.addEventListener('pointermove', (event) => {
		const box = wrap.getBoundingClientRect();
		const x = (event.clientX - box.left) / box.width;
		const y = (event.clientY - box.top) / box.height;
		wrap.style.setProperty('--mx', `${x * 100}%`);
		wrap.style.setProperty('--my', `${y * 100}%`);
		wrap.classList.add('is-hot');
		setTilt((0.5 - y) * 24, (x - 0.5) * 32, 14, 1.1);
	});
	wrap.addEventListener('pointerleave', () => {
		wrap.classList.remove('is-hot');
		setTilt(0, 0, 0, 1);
	});
}

typeBrandTitle();
setupLogoMotion();

vscodeApi.postMessage({ type: 'ready' });

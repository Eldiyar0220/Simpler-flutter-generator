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

vscodeApi.postMessage({ type: 'ready' });

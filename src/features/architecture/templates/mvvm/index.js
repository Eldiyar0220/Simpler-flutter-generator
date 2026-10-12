const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function mvvmTemplate() {
	return yaml.load(fs.readFileSync(path.join(__dirname, 'simpler_generator_folders.yaml'), 'utf8'));
}

function mvvmTemplateYaml() {
	return fs.readFileSync(path.join(__dirname, 'simpler_generator_folders.yaml'), 'utf8');
}

module.exports = {
	mvvmTemplate,
	mvvmTemplateYaml,
};

const fs = require("fs");
const customPath = require("../../../shared/root_path");
const { templateName, unusedTxt } = require("../../../shared/constants");

class templateCache {
    static temp = ``;
}

function getTemplate() {
    if (templateCache.temp) return templateCache.temp;
    const templatePath = customPath.join(__dirname, `../templates/${templateName}`);
    const templateStr = fs.readFileSync(templatePath, { encoding: "utf8" });
    return templateStr;
}

function getTemplateForUnused() {
    if (templateCache.temp) return templateCache.temp;
    const templatePath = customPath.join(__dirname, `../templates/${unusedTxt}`);
    const templateStr = fs.readFileSync(templatePath, { encoding: "utf8" });
    return templateStr;
}


module.exports = {
    getTemplate, getTemplateForUnused
}
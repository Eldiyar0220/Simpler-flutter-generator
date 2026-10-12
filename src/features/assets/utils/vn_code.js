

class VNodeSimple {
  constructor(imageName, tab, fix = '', className) {
    this.imageName = imageName;
    this.tab = tab;
    this.fix = fix;
    this.className = className;
  }

  gen(assetsPath) {
    try {
      return `  static const String ${this.tab} = '${normalizePath(assetsPath)}/${this.imageName}'; ${this.fix} `;
    } catch (error) {
      console.error(`Error in VNode.gen: ${error}`);
      return ''; // Handle the error case as needed
    }
  }
}



const { checkForVariable } = require("./check_for_variables");

class VNodeWithCheck {
  constructor(imageName, tab, fix = '', className) {
    this.imageName = imageName;
    this.tab = tab;
    this.fix = fix;
    this.className = className;
  }

  gen(assetsPath) {
    return Promise.all([checkForVariable(this.className, [this.tab])])
      .then((results) => {
        return `  static const String ${this.tab} = '${normalizePath(assetsPath)}/${this.imageName}'; ${this.fix} ${results[0] != '' ? `//check it {${results[0]}} is Unused in Project maybe` : ''}`;
      })
      .catch((error) => {
        console.error(`Error in VNode.gen: ${error}`);
        return ''; // Handle the error case as needed
      });
  }

}



function normalizePath(inputPath) {

  // Remove trailing slashes
  inputPath = inputPath.replace(/\/+$/, '');


  // Split the path into parts
  const pathParts = inputPath.split('/');




  // Filter out empty parts and join them back with a single forward slash
  const normalizedPath = pathParts.filter(part => part !== '').join('/');


  // Add the desired filename at the end
  return normalizedPath;
}
module.exports = {
  VNodeSimple,
  VNodeWithCheck
};



function hasEmptySpace(str, warning) {
    const whitespacePattern = /\s/;
    if (whitespacePattern.test(str) && warning) {
        return `!<-Empty_Space!, //!Warning -> [${str}]`;
    } else {
        return '';
    }
}


module.exports = {
    hasEmptySpace
}
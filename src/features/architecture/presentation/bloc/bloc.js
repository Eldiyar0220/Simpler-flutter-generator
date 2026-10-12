const equatablebloc = require('./templates/equatable_bloc/equatable_bloc');
const simplebloc = require('./templates/simple_bloc/simple_bloc');
const freezedbloc = require('./templates/freezed_bloc/freezed_bloc');

const flutterBlocList = (typeOfBloc, name, importPath, projectName) => {
    switch (typeOfBloc) {
        case 'equatable':
            return equatablebloc(name, importPath, projectName)
        case 'simple':
            return simplebloc(name)
        case 'freezed':
            return freezedbloc(name)
        default:
            return equatablebloc(name)
    }
}


module.exports = {
    flutterBlocList
};



const { toPascalCase } = require('../../../../../../shared/case');

const equatablebloc = (name, importPath, projectName) => {
    return [
        {
            fileName: `${name.toLowerCase()}_bloc.dart`,
            dartCode:
                `
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
${projectName != '' ? `import 'package:${projectName}${importPath}';` : ''}


part '${name.toLowerCase()}_event.dart';
part '${name.toLowerCase()}_state.dart';

class ${toPascalCase(name)}Bloc extends Bloc<${toPascalCase(name)}Event, ${toPascalCase(name)}State> {
\t${toPascalCase(name)}Bloc(this._interactor) : super(${toPascalCase(name)}InitialState()) {
\t\ton<First${toPascalCase(name)}Event>(_exampleFunc);
\t}

\tfinal ${toPascalCase(name)}Interactor _interactor;

\tFuture<void> _exampleFunc(
\t\tFirst${toPascalCase(name)}Event event,
\t\tEmitter<${toPascalCase(name)}State> emit,
\t) async {
\ttry {
\t\temit(${toPascalCase(name)}LoadingState());
\t\t//await _interactor.exampleFunc();
\t\temit(${toPascalCase(name)}SuccessState());
\t} catch (e) {
\t\temit(${toPascalCase(name)}ExceptionState(e));
\t\t}
\t}
}

`,
        },
        {
            fileName: `${name.toLowerCase()}_event.dart`,
            dartCode: `
part of '${name.toLowerCase()}_bloc.dart';

abstract class ${toPascalCase(name)}Event extends Equatable {
\tconst ${toPascalCase(name)}Event();

\t@override
\tList<Object> get props => [];
}	

class First${toPascalCase(name)}Event extends ${toPascalCase(name)}Event {}
`,
        },
        {
            fileName: `${name.toLowerCase()}_state.dart`,
            dartCode: `
part of '${name.toLowerCase()}_bloc.dart';

abstract class ${toPascalCase(name)}State extends Equatable {
\tconst ${toPascalCase(name)}State();

\t@override
\tList<Object> get props => [];
}

class ${toPascalCase(name)}InitialState extends ${toPascalCase(name)}State {}		

class ${toPascalCase(name)}LoadingState extends ${toPascalCase(name)}State {}

class ${toPascalCase(name)}SuccessState extends ${toPascalCase(name)}State {}

class ${toPascalCase(name)}ExceptionState extends ${toPascalCase(name)}State {
\tconst ${toPascalCase(name)}ExceptionState(this.exception);
\tfinal dynamic exception;

\t@override
\tList<Object> get props => [exception];
}	
`,
        },
    ];
}

module.exports = equatablebloc
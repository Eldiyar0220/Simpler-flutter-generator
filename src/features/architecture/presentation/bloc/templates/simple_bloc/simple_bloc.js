
const { toPascalCase } = require('../../../../../../shared/case');

const simplebloc = (name) => {
    return [
        {
            fileName: `${name.toLowerCase()}_bloc.dart`,
            dartCode:
                `
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:meta/meta.dart';

part '${name.toLowerCase()}_event.dart';
part '${name.toLowerCase()}_state.dart';

class ${toPascalCase(name)}Bloc extends Bloc<${toPascalCase(name)}Event, ${toPascalCase(name)}State> {
\t${toPascalCase(name)}Bloc(this._interactor) : super(${toPascalCase(name)}InitialState()) {
    on<${toPascalCase(name)}Event>(_exampleFunc);
\t}

\tfinal AuthInteractor _interactor;

\tFuture<void> _exampleFunc(
\t  FirstAuthEvent event,
\t  Emitter<AuthState> emit,
\t) async {
\ttry {
\t  emit(AuthLoadingState());
\t  //await _interactor.exampleFunc();
\t  emit(AuthSuccessState());
\t} catch (e) {
\t  emit(AuthExceptionState(e));
\t  }
\t}
}
                
`,
        },
        {
            fileName: `${name.toLowerCase()}_event.dart`,
            dartCode: `
part of '${name.toLowerCase()}_bloc.dart';

@immutable
abstract class ${toPascalCase(name)}Event {}

class First${toPascalCase(name)}Event extends SettingsEvent {}

`,
        },
        {
            fileName: `${name.toLowerCase()}_state.dart`,
            dartCode: `
part of '${name.toLowerCase()}_bloc.dart';


@immutable
abstract class ${toPascalCase(name)}State {}

class ${toPascalCase(name)}Initial extends ${toPascalCase(name)}State {}

class ${toPascalCase(name)}InitialState extends ${toPascalCase(name)}State {}

class ${toPascalCase(name)}LoadingState extends ${toPascalCase(name)}State {}

class ${toPascalCase(name)}SuccessState extends ${toPascalCase(name)}State {}

class ${toPascalCase(name)}ExceptionState extends ${toPascalCase(name)}State {
  ${toPascalCase(name)}ExceptionState(this.exception);
  final dynamic exception;
}


`,
        },
    ];
}

module.exports = simplebloc
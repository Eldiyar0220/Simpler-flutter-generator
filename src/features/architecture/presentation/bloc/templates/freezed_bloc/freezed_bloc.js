const { toPascalCase } = require('../../../../../../shared/case');

const freezedbloc = (name) => {
    return [
        {
            fileName: `${name.toLowerCase()}_bloc.dart`,
            dartCode:
                `
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part '${name.toLowerCase()}_event.dart';
part '${name.toLowerCase()}_state.dart';
part '${name.toLowerCase()}_bloc.freezed.dart';

class ${toPascalCase(name)}Bloc extends Bloc<${toPascalCase(name)}Event, ${toPascalCase(name)}State> {
    ${toPascalCase(name)}Bloc() : super(_Initial()) {
    on<${toPascalCase(name)}Event>((event, emit) {
        // TODO: implement event handler
    });
    }
}
`,
        },
        {
            fileName: `${name.toLowerCase()}_event.dart`,
            dartCode: `
part of '${name.toLowerCase()}_bloc.dart';

@freezed
class ${toPascalCase(name)}Event with _$${toPascalCase(name)}Event {
  const factory ${toPascalCase(name)}Event.started() = _Started;
}
`,
        },
        {
            fileName: `${name.toLowerCase()}_state.dart`,
            dartCode: `
part of '${name.toLowerCase()}_bloc.dart';

@freezed
class ${toPascalCase(name)}State with _$${toPascalCase(name)}State {
  const factory ${toPascalCase(name)}State.initial() = _Initial;
}

`,
        },
    ];
}

module.exports = freezedbloc
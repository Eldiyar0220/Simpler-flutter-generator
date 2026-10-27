# Change Log

All notable changes to the "Simpler Flutter Generator" extension are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/).

## [2.0.1] - 2026-10-27

### Changed

- The **GENERATOR** button moved from the status bar to the Activity Bar (left side).
  Click it to open the main menu. It is still hidden when Simpler Flutter Tasks is installed.

### Fixed

- The extension no longer fails to activate in a window without an open folder.
  Commands, the main menu and the **GENERATOR** button now work there too.

## [2.0.0] - 2026-10-13

Big update: visual studios for both yaml files, a ready MVVM clean architecture template
and a new main menu. Command IDs and yaml keys are unchanged, existing
`simpler_generator_folders.yaml` and `simpler_generator_images.yaml` keep working.

### Added

- **Main menu "Simpler Flutter"** — one place to open the studios.
  Open it from the **GENERATOR** button, the editor title icon,
  the Explorer context menu or the command palette (`Simpler Flutter`).
- **Architecture Studio** — visual editor for `simpler_generator_folders.yaml`
  - tree of layers, folders and files with add / rename / delete
  - code editor for every file with a path tree above it (layer → folder → file)
  - **MVVM template** button, asks before replacing your own yaml
  - **Import** and **Export** yaml, **Copy**, **Write yaml** to the project root
  - delete asks for confirmation; a folder or file created less than 5 seconds ago is removed without asking
  - newly created folders and files are highlighted for a few seconds
  - one **Expand / Collapse** button with smooth animation
  - **Full width** mode hides the side panels; the yaml preview can be hidden
  - guide for `NAME`, `LOWER_CASE` and `funcCase` with a `pay_login` example
- **Images Studio** — visual editor for `simpler_generator_images.yaml`
  - groups with class name, output path, single or multiple paths and file types
  - `warnings`, `checkUnusedVariables` and `checkUnusedAssets` switches,
    with a warning when both unused checks are on (slow on big projects)
  - **Template** button asks before replacing your own yaml
  - **More** dialog with a demo GIF and yaml examples
- **MVVM clean architecture template** (`data` / `domain` / `presentation`)
  with data sources, models, repositories, entities, use cases,
  a `ChangeNotifier` view model, view and page.
  **Create File** now writes this template when `simpler_generator_folders.yaml` is missing.
- Setting `SimplerFlutterGenerator.stateMachine` — `bloc` or `cubit`.
  Studio settings are saved automatically when you change them.
- **Simpler Flutter Tasks** card in the main menu with a short feature tour.
  The **GENERATOR** status bar button is hidden when Simpler Flutter Tasks is installed.
- Published on [Open VSX](https://open-vsx.org/extension/Eldiyar-Dev/simpler-flutter-generator)
  for Cursor, VSCodium and other compatible editors.

### Changed

- Project restructured into `src/features` and `src/shared` for easier maintenance.
- Updated `axios` and `js-yaml` (security fixes).
- Clearer descriptions for `createStateWidget` and `enableCodeLens` settings.

### Fixed

- The "Update Simpler Flutter Generator -> v: 1.3.2" message no longer shows on every start.

### Notes

- **Use Bloc / Use Cubit** and the bloc template type are stored in settings.
  Generated file contents still come from the `code` blocks in your yaml.

## [1.3.2]

- Fixed pubspec update for versions with build metadata, e.g. `camera: ^0.10.0+1` → `^0.11.0+2`
- Removed the update button for packages from git
- Removed the `[latest]` label

## [1.3.1]

- Added CodeLens update to a new package version
- Changed the extension icon

## [1.2.8]

- Changed the Generate Assets template
- `generateAll` is `false` by default; when `true` a dialog asks which group to generate
- Every group has its own `outputPath` (see README for the new format)

## [1.2.7]

- Removed emoticons from context menus (`editor/context`, `explorer/context`)
- Added a toggle in `editor/context`: `SimplerFlutterGenerator.enableCodeLens`
- Updated pubspec CodeLens UI with package versions: latest ✔︎, new version ⤴️

## [1.2.5] - [1.2.6]

- Added Build Runner with filter on package annotations (`SimplerFlutterGenerator.enableCodeLens`)

## [1.2.3] - [1.2.4]

- Added **Build Runner with Filter 🔎✅** in actions and on editor focus

## [1.2.0]

- Assets Generator: checks for unused variables and unused assets
- Folder Generator: `blocType` and `stateWidget` moved to settings
  (`SimplerFlutterGenerator.createStateWidget`, `SimplerFlutterGenerator.stateWidget`)

## [1.1.7] - [1.1.9]

- Folder Generator: custom Dart `code` for every file in yaml

## [1.1.6]

- Assets Generator: multiple paths per group, faster single-path generation

## [1.1.4] - [1.1.5]

- Built-in Dart templates: dataSource, dataModel, dataRepository, entityModel,
  domainRepository, usecase, blocType, stateWidget

## [1.1.3]

- Generate from yaml file 🔥

## [1.0.0]

- Generate Assets 🔥
- Create Folders 🔥

## [0.0.1]

- Initial release

---

## Other extensions

- Simpler Flutter Snippets — [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-snippets)
- Simpler Flutter Tasks — [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-tasks)

## Requirements

VS Code `^1.80.0` or a compatible editor (Cursor, VSCodium).

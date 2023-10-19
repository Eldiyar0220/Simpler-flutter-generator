# Generator README

<div align="center">
  <h1>Simple generate Image</h1>
</div>

![image](images/generator_image.gif)


## Requirements

Vscode: ^1.82.0

## Generator

- Create File ->  simpler_generator_images.yaml

`Generator default types [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]`

```yaml
# **************************************************************************
# * ImagesGenerator - Simpler FLutter Generator Extension -
# **************************************************************************

outputPath: lib/core/constants

groups:
  - path: assets/images
    class_name: AppImages
    types: [ .png, .jpg, .jpeg ]
    warnings: true

  # - path: assets/langs
  #   class_name: AppLangs
  #   types: [ .json ]
  #   warnings: true

  # - path: assets/flr
  #   class_name: AppFlr
  #   types: [ .flr ]
  #   warnings: true

  # - path: assets/fonts
  #   class_name: AppFonts
  #   types: [ .svg, .json ]
  #   warnings: true

  # - path: assets/rive
  #   class_name: AppFonts
  #   types: [ .riv ]
  #   warnings: true
```

### Generate Folders

```json 
"SimplerFlutterGenerator.Generator": "equatable"
```
- Create Architecture ->  simpler_flutter_generator.yaml

`Generator Folders`

```yaml

# showInputBox replacing 
# For Example:
#   - NAME_model.dart
#   - you write "settings" to showInputBox
#   - before -> 
#        - NAME_page.dart
#        - NAME_bloc.dart
#        - NAME_repository.dart
#
#   - after result -> 
#        - settings_page.dart
#        - settings_bloc.dart
#        - settings_repository.dart


# ------------------------------------------------------------- start
generate:
# --Data------------------------------------------------------
  - category: data
    contents:
      - folder: data_source
        contents:
          - file: NAME_local_data_source.dart
          - file: NAME_remote_data_source.dart
      - folder: models
        contents:
          - file: NAME_model.dart
      - folder: repositories
        contents:
          - file: NAME_repository_impl.dart
# ---Domain----------------------------------------------------          
  - category: domain
    contents:
      - folder: entities
        contents:
          - file: NAME_entity.dart
      - folder: repositories
        contents:
          - file: NAME_repository.dart
      - folder: usecase
        contents:
          - file: NAME_usecase.dart
# --Presentation-----------------------------------------------
  - category: presentation
    contents:
      - folder: widgets
      - folder: pages
        contents:
          - file: NAME_page.dart
      - folder: bloc
        contents:
          - file: NAME_bloc.dart
          - file: NAME_event.dart
          - file: NAME_state.dart
# ------------------------------------------------------------- end


```

### 1.1.3

 - Generate From Yaml File 👻😅

### 1.0.0

 - Generate Images 👻😅
 - Create Folders 👻

### 0.0.1

Initial

---

## Reference to other extensions

[Simpler Flutter Snippet](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-snippets)<br>
[Simpler Flutter Tasks](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-tasks)

**Enjoy!**

# Generator README

<div align="center">
  <h1>Simple generate Image</h1>
</div>

![image](images/generator_image.gif)


## Generator

- Create File ->  simpler_generator_images.yaml

`Generator default types [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]`


### `Single Path` --- ✅
```yaml
# **************************************************************************
# * ImagesGenerator - Simpler FLutter Generator - Enjoy bro 😜👍
# **************************************************************************

outputPath: lib/core/constant

groups:
  - path: assets/images
    class_name: AppImages
    types: [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]
    warnings: true

  # - path: assets/svg
  #   class_name: AppSvg
  #   types: [.svg]
  #   warnings: true

```

### `Multiple path` --- ✅
```yaml

# **************************************************************************
# * ImagesGenerator - Simpler FLutter Generator - Enjoy bro 😜👍
# **************************************************************************

outputPath: lib/core/constant

groups:
  - path:
      - assets/images
      - assets/images/new_images
      - assets/images/only_icons
    class_name: AppImages
    types: [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]
    warnings: true

  # - path: 
  #     - assets/svg
  #     - assets/svg/new_svg
  #   class_name: AppSvg
  #   types: [.svg]
  #   warnings: true
    

```

### Generate Folders

<div align="center">
  <h1>Simple generate Image</h1>
</div>

![image](images/generator_folders.gif)


```json 
"SimplerFlutterGenerator.Generator": "equatable"
```
- Create Architecture ->  simpler_generator_folders.yaml

`Generator Folders`

```yaml
# **************************************************************************
# * ArchitectureGenerator - Simpler FLutter Generator -
# **************************************************************************

#? --> For Info
# showInputBox replacing 
# For Example:
#
#   - writing "settings" to showInputBox
#
#   - before result -> 
#        - NAME_page.dart
#        - NAME_bloc.dart
#        - NAME_repository.dart
#
#   - after result -> 
#        - settings_page.dart
#        - settings_bloc.dart
#        - settings_repository.dart

# ********************* Created Extension For Fun 😜 ************************


dataSource: false

dataModel: false

dataRepository: false

entityModel: false

domainRepository: false

usecase: false

blocType: equatable
#* equatable
#* simpleBloc
#* freezedBloc
#* Empty

stateWidget: StateFullWidget
#* StateFullWidget
#* StateLessWidget
#* Empty

# ----M.V.P-------------------------------------------------------> start
generate:
# ---Data------------------------------------------------------
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
# ---Presentation----------------------------------------------
  - category: presentation
    contents:
      - folder: widgets
      - folder: bloc
        contents:
          - file: NAME_bloc.dart
          - file: NAME_event.dart
          - file: NAME_state.dart
      - folder: pages
        contents:
          - file: NAME_page.dart
# ------------------------------------------------------------- end

```

### 1.1.6

 - Upgraded Assets Generator 🔥
    - Added Multiple path ✅
    - Optimized generating from single path ✅

### 1.1.4-5

 - Added dart codes 😅 🧰
    - dataSource: ✅ 
    - dataModel: ✅
    - dataRepository: ✅
    - entityModel: ✅
    - domainRepository: ✅
    - usecase: ✅
    - blocType: ✅
    - stateWidget: ✅

### 1.1.3 

 - Generate From Yaml File 🔥

### 1.0.0

 - Generate Assets 🔥 
 - Create Folders 🔥

### 0.0.1

Initial

---

## Reference to other extensions

[Simpler Flutter Snippet](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-snippets)<br>
[Simpler Flutter Tasks](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-tasks)


## Requirements

Vscode: ^1.82.0


**Enjoy!** 😁

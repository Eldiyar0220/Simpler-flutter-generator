### Assets
![image](images/assets_image_read_me.png)
### Table of Contents
A set of helpful Flutter and Dart commands for day to day Flutter development.
- Generator

    - Assets
        * [Single Path](#Generator-Image-Single-Path)
        * [Multiple Path](#Generator-Image-Multiple-Path)

    - Generate Architecture Simple
        * [Simple Generator Folders](#Simple-generate-Folders)

    - Generate Architecture with Code
        * [Code Variant 1](#Generate-Folders-with-Code-Variant-1)
        * [Code Variant 2](#Generate-Folders-with-Code-Variant-2)


<div align="center">
  <h1>Simple generate Image</h1>
</div>

![image](images/generator_image_gii.gif)

- Create File ->  simpler_generator_images.yaml

- Generator default types [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]

### Generator Image Single Path
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
    checkUnusedVariables: true
    checkUnusedAssets: true

  # - path: assets/svg
  #   class_name: AppSvg
  #   types: [.svg]
  #   warnings: true
  #   checkUnusedVariables: true
  #   checkUnusedAssets: true

```
### Generator Image Multiple Path
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
    checkUnusedVariables: true
    checkUnusedAssets: true

  # - path: 
  #     - assets/svg
  #     - assets/svg/new_svg
  #   class_name: AppSvg
  #   types: [.svg]
  #   warnings: true
  #   checkUnusedVariables: true
  #   checkUnusedAssets: true
    

```
<br/>
<br/>
<br/>

### Simple generate Folders
### `Generate Folders` --- ✅


![image](images/generator_folders.gif)


```json 
  "SimplerFlutterGenerator.createStateWidget": true,
  "SimplerFlutterGenerator.stateWidget": "StateLessWidget",
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
#---> NAME
#
#   - writing "settings" to showInputBox
#
#   - before -> settings
#        - NAME_page.dart
#        - NAME_bloc.dart
#        - NAME_repository.dart
#
#   - after -> 
#        - settings_page.dart
#        - settings_bloc.dart
#        - settings_repository.dart
#
#---> funcCase
#
#   - writing "get_test" to showInputBox
#   - before -> get_test
#        Future<void> funcCase()
#
#   - after -> 
#        Future<void> getTest()
#
#
#
#
#---> LOWER_CASE
#
#   - before -> pay_login
#       - part 'LOWER_CASE_model.freezed.dart';
#       - part 'LOWER_CASE_model.g.dart';
#
#   - after ->
#       - part 'pay_login_model.freezed.dart';
#       - part 'pay_login_model.g.dart';
# 
# 
#---> to use Custom Dart Code
#   - should paste to false
#       - dataSource
#       - dataModels
#       - dataRepository
#       - entityModels
#       - domainRepository
#       - usecase
#       - stateWidget
# 

# ********************* Created Extension For Fun 😜 ************************


dataSource: false

dataModel: false

dataRepository: false

entityModel: false

domainRepository: false

usecase: false


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
#---Domain----------------------------------------------------          
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
### Generate Folders with Code Variant 1
### `Generator Folders With Custom Dart Code Variant 1`

```yaml

# **************************************************************************
# * ArchitectureGenerator - Simpler FLutter Generator -
# **************************************************************************

#? --> For Info
# showInputBox replacing 
# For Example:
#
#---> NAME
#
#   - writing "settings" to showInputBox
#
#   - before -> settings
#        - NAME_page.dart
#        - NAME_bloc.dart
#        - NAME_repository.dart
#
#   - after -> 
#        - settings_page.dart
#        - settings_bloc.dart
#        - settings_repository.dart
#
#---> funcCase
#
#   - writing "get_test" to showInputBox
#   - before -> get_test
#        Future<void> funcCase()
#
#   - after -> 
#        Future<void> getTest()
#
#
#
#
#---> LOWER_CASE
#
#   - before -> pay_login
#       - part 'LOWER_CASE_model.freezed.dart';
#       - part 'LOWER_CASE_model.g.dart';
#
#   - after ->
#       - part 'pay_login_model.freezed.dart';
#       - part 'pay_login_model.g.dart';
# 
# 
#---> to use Custom Dart Code
#   - should paste to false
#       - dataSource
#       - dataModels
#       - dataRepository
#       - entityModels
#       - domainRepository
#       - usecase
#       - stateWidget
# 

# ********************* Created Extension For Fun 😜 ************************



dataSource: false

dataModel: false

dataRepository: false

entityModel: false

domainRepository: false

usecase: false


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
            code: | 
              class NAMEEntity {}
      - folder: repositories
        contents:
          - file: NAME_repository.dart
            code: | 
              class NAMERepository {}
      - folder: usecase
        contents:
          - file: NAME_usecase.dart
            code: | 
              class NAMEUseCase {}
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
            code: |
              import 'package:flutter/material.dart';

              class NAMEPage extends StatefulWidget {
                  const NAMEPage({super.key});
                  @override
                  State<NAMEPage> createState() => _NAMEPageState();
              }// now Eldiyar

              class _NAMEPageState extends State<NAMEPage> {
                @override
                Widget build(BuildContext context) {
                  return Scaffold(
                    appBar: AppBar(
                      title: const Text('NAMEPage'),
                    ),
                    body: Column(
                      children: [
                        Container(),
                      ],
                    ),
                  );
                }
              }
        
# ------------------------------------------------------------- end


```
### Generate Folders with Code Variant 2
### `Generator Folders With Custom Dart Code Variant 2`

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


# ----M.V.P-------------------------------------------------------> start
generate:
# ---Data------------------------------------------------------
  - category: data
    contents:
      - folder: data_source
        contents:
          - file: NAME_local_data_source.dart
            code: |
              abstract class NAMELocalDataSource {}

              class NAMELocalDataSourceImpl implements NAMELocalDataSource {}

          - file: NAME_remote_data_source.dart
            code: |
              abstract class NAMERemoteDataSource {}

              class NAMERemoteDataSourceImpl implements NAMERemoteDataSource {}

      - folder: models
        contents:
          - file: NAME_model.dart
            code: |
                class NAMEModel extends NAMEEntity {
                  NAMEModel({
                    required String data,
                  }) : super(data: data);

                  factory NAMEModel.fromJson(Map<String, dynamic> json) {
                    return NAMEModel(
                      data: json['data'],
                    );
                  }

                  Map<String, dynamic> toJson() {
                    return {
                      'data': data,
                    };
                  }
                }
      - folder: repositories
        contents:
          - file: NAME_repository_impl.dart
            code: | 
                class NAMERepositoryImpl implements NAMERepository {
                  NAMERepositoryImpl({
                    required this.remoteDataSource,
                    required this.localDataSource,
                  });
                  final NAMERemoteDataSource remoteDataSource;
                  final NAMELocalDataSource localDataSource;

                  @override
                  Future<void> exampleFuncRepo() {
                    // TODO: implement exampleFuncRepo
                    throw UnimplementedError();
                  }
                }

# ---Domain----------------------------------------------------          
  - category: domain
    contents:
      - folder: entities
        contents:
          - file: NAME_entity.dart
            code: | 
              import 'package:equatable/equatable.dart';

              class NAMEEntity extends Equatable {
                NAMEEntity({
                  required this.data,
                });
                final String data;

                @override
                List<Object> get props => [data];
              }

      - folder: repositories
        contents:
          - file: NAME_repository.dart
            code: | 
              abstract class NAMERepository {}
      - folder: usecase
        contents:
          - file: NAME_usecase.dart
            code: | 
              class NAMEUsecase {
                NAMEUsecase({required this.repository});
                final NAMERepository repository;
              }

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
            code: |
              import 'package:flutter/material.dart';

              class NAMEPage extends StatefulWidget {
                const NAMEPage({super.key});
                @override
                State<NAMEPage> createState() => _NAMEPageState();
              }

              class _NAMEPageState extends State<NAMEPage> {
                @override
                Widget build(BuildContext context) {
                  return Scaffold(
                    appBar: AppBar(
                      title: const Text('NAMEPage'),
                    ),
                    body: Column(
                      children: [
                        Container(),
                      ],
                    ),
                  );
                }
              }



# ------------------------------------------------------------- end


```

### 1.2.0

 - Upgraded Assets Generator 🔥
    - added checking unused Variables
    - added checking unused Assets
 - - Upgraded Folder Generator 🔥
    - removed 
      - blocType
      - stateWidget
    - added to settings json
      -  "SimplerFlutterGenerator.createStateWidget": true,
      -  "SimplerFlutterGenerator.stateWidget": "StateLessWidget",

 make sure that starting from d of code:
### 1.1.7-8-9

 - Upgraded Folder Generator 🔥
    - folder: pages\
        contents:
        - file: NAME_page.dart\
            code: |
            <!-- <pre> **lalala** </pre> -->
            &emsp;
                ......dart code......\
            &emsp;
                ......dart code......\
            &emsp;
                ......dart code......

 make sure that starting from d of code:

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

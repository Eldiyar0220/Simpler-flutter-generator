
const yamlTemplate =
    `
# **************************************************************************
# * ImagesGenerator - Simpler FLutter Generator - Enjoy bro 😜👍
# **************************************************************************

generateAll: false # default [false]

groups:
  - path: assets/images
    class_name: AppImages
    types: [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]
    outputPath: lib/core/constant
    warnings: true
    
    # Warning do not put to true both, it will take very long analyze your project!!
    # checkUnusedVariables: false
    # checkUnusedAssets: false

  # - path: assets/svg
  #   class_name: AppSvg
  #   types: [ .svg ]
  #   outputPath: lib/core/constant
  #   warnings: true

## Multiple path
  # - path:
  #     - assets/images
  #     - assets/images/new_images
  #     - assets/images/only_icons
  #   class_name: AppImages
  #   types: [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]
  #   outputPath: lib/core/constant
  #   warnings: true

  # - path: 
  #     - assets/svg
  #   class_name: AppSvg
  #   types: [.svg]
  #   outputPath: lib/core/constant
  #   warnings: true
    
`

module.exports = {
    yamlTemplate
}
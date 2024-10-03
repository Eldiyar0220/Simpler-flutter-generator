
# #!/bin/bash
# # Функция для отображения прогресса с процентами
# show_loading_with_percentage() {
#     spinner="/|\\-/"
#     colors=("\033[32m")  # Красный, Зеленый, Желтый, Синий, Пурпурный, Голубой
#     reset="\033[0m"
#     percentage=0  # Начальный процент

#     while kill -0 $flutter_pid 2>/dev/null; do  # Пока процесс с таким PID существует
#         for i in $(seq 0 3); do
#             color=${colors[$((i % ${#colors[@]}))]}  # Меняем цвет на каждой итерации
#             echo -ne "\r${color}${spinner:$i:1} Выполняется... $percentage%${reset}"
#             sleep 0.2  # Вращаем спиннер

#             # Симуляция увеличения процентов
#             percentage=$((percentage + 1))
#             if [ $percentage -gt 99 ]; then
#                 percentage=99  # Достигаем 99% и ждем окончания команды
#             fi
#         done
#     done

#     # Когда команда завершена, показываем 100% и сообщение
#     echo -ne "\r\033[32m✔ Выполнено! 100%${reset}\n"
# }

# # Запрос выбора команды
# echo "Выберите команду:"
# echo "1) Flutter"
# echo "2) Git"
# read -p "Введите номер команды: " command_choice

# case $command_choice in
#     1)
#         # Запрашиваем конкретную команду Flutter
#         read -p "Введите Flutter команду (например, build apk или run): " flutter_command
#         command="flutter $flutter_command"
#         ;;
#     2)
#         # Запрашиваем конкретную команду Git
#         echo "1) git pull --all"
#         echo "2) git simple push"
#         echo "3) git rebaser"
#         read -p "Введите Git команду: " git_choise
#         case $git_choise in
#             1)
#                 # Запрашиваем конкретную команду
#                 command="git pull --all"
#                 ;;
#             2)
#                 read -p "Git Comment:  " git_comment
#                 echo "git add ."
#                 echo "git commit -m 'git_comment'"
#                 git add .
#                 git commit -m git_comment
#                 git push
#                 command="git"
#                 ;;
#             *)
#                 echo "Неверный выбор. Выход."
#                 exit 1
#                 ;;
#         esac

#         ;;
#     *)
#         echo "Неверный выбор. Выход."
#         exit 1
#         ;;
# esac

# # Выполняем выбранную команду в фоновом режиме
# # eval $command &>/dev/null &

# # Захватываем PID процесса команды
# flutter_pid=$!

# # Пока команда выполняется, показываем проценты выполнения
# show_loading_with_percentage $flutter_pid

# # Ожидание завершения команды
# wait $flutter_pid

# # Сообщение о завершении
# echo "Команда '$command' завершена!"




# # #!/bin/bash

# # # Функция для отображения прогресса с процентами
# # show_loading_with_percentage() {
# #     spinner="/|\\-/"
# #     colors=("\033[32m")  # Красный, Зеленый, Желтый, Синий, Пурпурный, Голубой
# #     reset="\033[0m"
# #     percentage=0  # Начальный процент

# #     while kill -0 $flutter_pid 2>/dev/null; do  # Пока процесс с таким PID существует
# #         for i in $(seq 0 3); do
# #             color=${colors[$((i % ${#colors[@]}))]}  # Меняем цвет на каждой итерации
# #             echo -ne "\r${color}${spinner:$i:1} Выполняется... $percentage%${reset}"
# #             sleep 0.2  # Вращаем спиннер

# #             # Симуляция увеличения процентов
# #             percentage=$((percentage + 1))
# #             if [ $percentage -gt 99 ]; then
# #                 percentage=99  # Достигаем 99% и ждем окончания команды
# #             fi
# #         done
# #     done

# #     # Когда команда завершена, показываем 100% и сообщение
# #     echo -ne "\r\033[32m✔ Выполнено! 100%${reset}\n"
# # }

# # # Запрашиваем команду у пользователя
# # read -p "Введите Flutter команду (например, build apk или run): " flutter_command

# # # Выполняем Flutter команду в фоновом режиме
# # flutter $flutter_command &

# # # Захватываем PID процесса Flutter
# # flutter_pid=$!

# # # Пока команда выполняется, показываем проценты выполнения
# # show_loading_with_percentage

# # # Ожидание завершения команды
# # wait $flutter_pid

# # # Сообщение о завершении
# # echo "Команда flutter $flutter_command завершена!"

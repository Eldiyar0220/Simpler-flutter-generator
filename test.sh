#!/bin/bash

# Функция для отображения прогресса с процентами
show_loading_with_percentage() {
    spinner="/|\\-/"
    colors=("\033[32m")  # Зеленый цвет
    reset="\033[0m"
    percentage=0  # Начальный процент

    while kill -0 $1 2>/dev/null; do  # Пока процесс с таким PID существует
        for i in $(seq 0 3); do
            color=${colors[$((i % ${#colors[@]}))]}  # Меняем цвет на каждой итерации
            echo -ne "\r${color}${spinner:$i:1} Выполняется... $percentage%${reset}"
            sleep 0.2  # Вращаем спиннер

            # Симуляция увеличения процентов
            percentage=$((percentage + 1))
            if [ $percentage -gt 99 ]; then
                percentage=99  # Достигаем 99% и ждем окончания команды
            fi
        done
    done

    # Когда команда завершена, показываем 100% и сообщение
    echo -ne "\r\033[32m✔ Выполнено! 100%${reset}\n"
}

# Запрос комментария для коммита
echo "Запускаем скрипт.....:"
read -p "Напишите коммент: " git_comment

# Задержка перед началом
sleep 0.3  # 300 миллисекунд

# Выполнение git add с задержкой
git add .
sleep 1  # Задержка на 1 секунду

# Уведомление перед выполнением git commit
echo "Сейчас будем запускать git commit с комментарием: '$git_comment'"

# Выполнение git commit и захват вывода
output=$(git commit -m "$git_comment" 2>&1)  # Захватываем вывод команды
git_exit_code=$?  # Сохраняем код завершения

# Проверяем код завершения
if [ $git_exit_code -ne 0 ]; then
    echo "Ошибка при выполнении git commit: $output"

    # Проверяем наличие строки о необходимости установки upstream
    if [[ $output == *"no upstream branch"* ]]; then
        # Извлекаем имя текущей ветки
        current_branch=$(git rev-parse --abbrev-ref HEAD)
        
        # Формируем и выполняем команду push
        push_command="git push --set-upstream origin $current_branch"
        echo "Выполняем: $push_command"
        eval $push_command  # Выполняем команду push
    fi
else
    echo "Команда git завершена успешно!"
fi

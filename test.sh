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
sleep 1  # 300 миллисекунд

# Выполнение git add с задержкой
git add .
echo "Сейчас будем запускать git commit с комментарием: '$git_comment'"
sleep 3  # Задержка на 3 секунду
# Уведомление перед выполнением git commit

# Выполнение git commit в фоновом режиме
git commit -m "$git_comment" &

echo "Запушим в Git"
sleep 5
git push

# Захватываем PID процесса команды
git_pid=$!

# Пока команда выполняется, показываем проценты выполнения
show_loading_with_percentage $git_pid

# Ожидание завершения команды
wait $git_pid

# Сообщение о завершении
echo "Команда git завершена!"


# git reset --soft HEAD~
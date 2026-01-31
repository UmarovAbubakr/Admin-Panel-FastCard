<?php
// Самый простой PHP скрипт для отправки email
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем данные из формы
    $name = $_POST['name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? '';
    $address = $_POST['address'] ?? '';
    $order_number = $_POST['order_number'] ?? '';
    
    // Email, куда придет заказ (ваш email)
    $to = "ваш_email@example.com";
    
    // Тема письма
    $subject = "Новый заказ #" . $order_number;
    
    // Текст письма
    $message = "
    ========================
    НОВЫЙ ЗАКАЗ С САЙТА!
    ========================
    
    Номер заказа: #$order_number
    Дата: " . date('d.m.Y H:i:s') . "
    
    --- ДАННЫЕ КЛИЕНТА ---
    Имя: $name
    Телефон: $phone
    Email: $email
    Адрес: $address
    
    --- ЗАКАЗ ---
    Товар 1 - 1000 руб.
    Товар 2 - 2000 руб.
    ------------------
    ИТОГО: 3000 руб.
    
    ========================
    Не забудьте перезвонить!
    ";
    
    // Заголовки письма
    $headers = "From: интернет-магазин <noreply@ваш-сайт.ru>\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    // Отправляем письмо
    if (mail($to, $subject, $message, $headers)) {
        echo "Заказ успешно отправлен! Мы скоро вам перезвоним.";
    } else {
        echo "Ошибка отправки. Пожалуйста, позвоните нам по телефону.";
    }
} else {
    echo "Неверный метод запроса.";
}
?>
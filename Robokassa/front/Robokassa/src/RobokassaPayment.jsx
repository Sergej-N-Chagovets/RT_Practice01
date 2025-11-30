// src/RobokassaPayment.jsx (Обновленная версия)
import React, { useState } from 'react';
import axios from 'axios'; // Используем axios для запросов
// УДАЛИТЕ: import md5 from 'blueimp-md5';
import './RobokassaPayment.css';

const RobokassaPayment = () => {
    // --- Константы ---
    // ВАЖНО: ROBOKASSA_URL и MULTYK_LOGIN теперь не нужны на клиенте, 
    // кроме базового URL вашего бэкенда:
    const BACKEND_API_URL = "http://localhost:5000/api/robokassa/signature"; 
    // -----------------

    const [sum, setSum] = useState('100.00');
    const [invoiceId, setInvoiceId] = useState('12345');
    const [description, setDescription] = useState('Оплата услуг');
    const [email, setEmail] = useState('test@example.com');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * 🌐 Функция для инициализации оплаты через БЭКЕНД Node.js.
     */
    const handlePayment = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // 1. Собираем данные, необходимые бэкенду для генерации подписи
        const requestData = {
            OutSum: sum,
            InvId: invoiceId,
            Desc: description,
            Email: email,
        };

        try {
            // 2. Асинхронный POST-запрос к бэкенду Node.js
            const response = await axios.post(BACKEND_API_URL, requestData);

            // 3. Бэкенд возвращает готовый URL для оплаты (с уже сгенерированным хешем)
            const { paymentUrl } = response.data;

            // 4. Перенаправляем пользователя на Robokassa
            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                setError('Бэкенд не вернул URL для оплаты.');
            }

        } catch (err) {
            console.error('Ошибка инициализации Robokassa:', err);
            setError('Ошибка: Не удалось связаться с сервером или получить ссылку на оплату.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="robokassa-container">
            <h1>💳 Оплата через Robokassa (Тест через Node.js)</h1>
            {error && <p className="error-message">⚠️ {error}</p>}
            <form onSubmit={handlePayment} className="payment-form">
                <label>
                    Сумма оплаты (OutSum):
                    <input
                        type="number"
                        step="0.01"
                        value={sum}
                        onChange={(e) => setSum(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Номер счета (InvId):
                    <input
                        type="text"
                        value={invoiceId}
                        onChange={(e) => setInvoiceId(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Описание (Desc):
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Email клиента (Email):
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Загрузка...' : `Оплатить ${sum} RUB`}
                </button>
            </form>
        </div>
    );
};

export default RobokassaPayment;                


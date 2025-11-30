// server.js
const express = require('express');
const cors = require('cors');
const md5 = require('md5'); // Используем md5 для Node.js

const app = express();
const PORT = 5000;

// --- Константы Robokassa (должны храниться в .env) ---
const MULTYK_LOGIN = "Robokassa_Test";
const TEST_PASSWORD = "password"; // Пароль для генерации подписи
const ROBOKASSA_URL = "https://auth.robokassa.ru/Merchant/Index.aspx";
// ----------------------------------------------------

app.use(cors());
app.use(express.json());

/**
 * 🔐 Endpoint для генерации подписи и URL
 */
app.post('/api/robokassa/signature', (req, res) => {
    const { OutSum, InvId, Desc, Email } = req.body;

    if (!OutSum || !InvId) {
        return res.status(400).json({ error: 'Требуются OutSum и InvId.' });
    }

    // Формула: MD5(Сумма:НомерСчета:Логин:Пароль1)
    const signatureString = `${OutSum}:${InvId}:${MULTYK_LOGIN}:${TEST_PASSWORD}`;
    const SignatureValue = md5(signatureString);

    // Формирование всех параметров
    const params = {
        Multyk_Login: MULTYK_LOGIN,
        OutSum: OutSum,
        InvId: InvId,
        Desc: Desc,
        SignatureValue: SignatureValue, // Подпись, сгенерированная на сервере
        Email: Email,
        Culture: 'ru',
        IsTest: 1 // Тестовый режим
    };

    const queryString = new URLSearchParams(params).toString();
    const paymentUrl = `${ROBOKASSA_URL}?${queryString}`;

    res.json({ paymentUrl });
});

app.listen(PORT, () => {
    console.log(`Node.js бэкенд запущен на порту ${PORT}`);
});
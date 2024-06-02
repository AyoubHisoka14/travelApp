"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyController = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const API_KEY = 'IBZzdLmM2yCYaXjgTZ6x'; // Your API key from amdoren
router.post('/', async (req, res) => {
    const { currency, amount } = req.body;
    // Validate the input
    if (!currency || !amount) {
        return res.status(400).json({ error: 'Currency and amount are required.' });
    }
    // Call the external API
    const apiUrl = `https://v6.exchangerate-api.com/v6/522f879a9ab9fc4e17ecec31/latest/EUR`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }
        const conversionRate = data.conversion_rates[currency];
        if (!conversionRate) {
            return res.status(400).json({ error: 'Invalid currency code.' });
        }
        const convertedAmount = conversionRate * amount;
        res.json(parseFloat(convertedAmount.toFixed(2)));
    }
    catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: 'An error occurred while fetching currency data' });
    }
});
exports.CurrencyController = router;

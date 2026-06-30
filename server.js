const express = require('express');
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    res.status(200).send('<h1>Agile Auto Parts - Live Production System</h1>');
});

app.listen(PORT, () => {
    console.log(`Application successfully listening on port ${PORT}`);
});
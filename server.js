const express = require('express');
const app = express();
const PORT = 3000; 

app.get('/', (req, res) => {
    res.status(200).send('<h1>Agile Auto Parts - Live Production System</h1>');
});


if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Application successfully listening on port ${PORT}`);
    });
}

module.exports = app; 
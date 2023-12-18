const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const apiRoute = require('./src/routes/routes');
const app = express();


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/whatsapp", apiRoute);

app.listen(PORT, () => console.log(`El puerto es + ${PORT}`));

require('dotenv').config({ path: ".env.test" })

const shrinkRay = require('shrink-ray-current');

import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT;

app.use(express.json(), shrinkRay(),
    bodyParser.json(), cors()
);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

app.post('/remove', async (req, res) => {

    const { id } = req.body

    res.status(200).json('ok')
})
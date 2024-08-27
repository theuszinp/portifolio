const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analisar o corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'matheussdantas1211@gmail.com', // Substitua pelo seu e-mail
        pass: 'pxiu ekre kcgx uqvk' // Substitua pela sua senha
    }
});

// Rota para receber o formulário
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'matheussdantas1211@gmail.com', // Seu e-mail
        subject: `Mensagem de ${name}`,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Erro ao enviar o e-mail');
        } else {
            console.log('E-mail enviado: ' + info.response);
            res.status(200).send('E-mail enviado com sucesso');
        }
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${3000}`);
});

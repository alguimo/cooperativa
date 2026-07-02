require('dotenv').config()

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const nodemailer = require('nodemailer');
const SMTPConnection = require('nodemailer/lib/smtp-connection');
const port = 3000
const app = express()
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))



let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/servicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'servicio.html'));
})

app.post('/formulario', (req, res) => {
    console.log(req.body)
    res.send('Ok')
    if (req.body.name == '') {
        const nombre = req.body.nombre
        const apellidos = req.body.apellidos
        const email = req.body.email
        const mensaje = req.body.mensaje
        const telefono = req.body.telefono
        try {
            transport.sendMail({
                from: 'Cooperativa <contactcoopmontan@gmail.com>',
                to: 'contactcoopmontan@gmail.com',
                subject: 'Contacto Sitio Web',
                html: `<h3>Tienes un nuevo mensaje:</h3>
				<p><b>Nombre:</b> ${nombre} ${apellidos}</p>
				<p><b>Email:</b> ${email}</p>
                <p><b>Teléfono:</b> ${telefono}</p> 
				<hr>
				<p><b>Mensaje:</b></p>
				<p>${mensaje}</p>`
            }, function(err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info);
                }
            });
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log('bot')
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
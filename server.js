require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const { Resend } = require('resend');
const { franc, francAll } = require('franc');
const langs = require('langs');

const port = process.env.PORT || 3000 
const app = express()

const resend = new Resend(process.env.RESEND_API_KEY);

const logBlockedAttempt = (reason, message, email, ip) => {
    console.log(`[BLOCKED_SPAM] | Motivo: ${reason} | Email: ${email} | Mensaje: "${message}" | IP: ${ip}`);
};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/servicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'servicio.html'));
})

app.post('/formulario', async (req, res) => {
    console.log(req.body)
    
    if (req.body.name === '') {
        const nombre = req.body.nombre
        const apellidos = req.body.apellidos
        const email = req.body.email
        const mensaje = req.body.mensaje
        const telefono = req.body.telefono

        // Verificación anti-spam: URLs conocidas
        if (mensaje.includes('telegra.ph')) {
            logBlockedAttempt('URL prohibida (telegra.ph)', mensaje, email, req.ip);
            return res.status(400).send('Spam detected');
        }

        // Verificación de idioma
        const langCode = franc(mensaje);
        // Si no es español, comprobamos si contiene palabras clave del español/catalán
        const esValido = ['spa', 'cat'].includes(langCode) || 
                         /[áéíóúñàèìòùç]/i.test(mensaje) || 
                         / (el|la|los|las|de|que|en|un|una|es|y) /i.test(mensaje);
        
        if (!esValido) {
            logBlockedAttempt(`Idioma no soportado (${langCode})`, mensaje, email, req.ip);
            return res.status(400).send('Solo se permiten mensajes en español o catalán.');
        }

        // Filtro de caracteres no latinos (para spam en otros alfabetos)
        const nonLatinChars = mensaje.match(/[^\u0000-\u007F\u00C0-\u00FF]/g);
        if (nonLatinChars && nonLatinChars.length > (mensaje.length / 3)) {
            logBlockedAttempt('Caracteres no latinos excesivos', mensaje, email, req.ip);
            return res.status(400).send('Spam detected');
        }
        
        try {
            const { data, error } = await resend.emails.send({
                
                from: 'Contacto Cooperativa <web@cooperativamontan.com>',
                to: 'coop.agricolamontan@hotmail.com', 
                subject: 'Contacto Sitio Web',
                html: `<h3>Tienes un nuevo mensaje:</h3>
                <p><b>Nombre:</b> ${nombre} ${apellidos}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Teléfono:</b> ${telefono}</p> 
                <hr>
                <p><b>Mensaje:</b></p>
                <p>${mensaje}</p>`
            });

            if (error) {
                console.error("Error detectado por Resend:", error);
                return res.status(400).send('Error al enviar el correo');
            }

            console.log("¡Correo enviado con éxito!", data);
            res.send('Ok'); 

        } catch (error) {
            console.error("Error crítico en el servidor:", error);
            res.status(500).send('Error interno');
        }
    } else {
        logBlockedAttempt('Honeypot activado (campo name relleno)', 'N/A', 'N/A', req.ip);
        console.log('bot')
        res.status(400).send('Bot detected')
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
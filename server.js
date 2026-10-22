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

const logBlockedAttempt = (reason) => {
    console.log(`[BLOCKED_SPAM] | Motivo: ${reason} | Fecha: ${new Date().toISOString()}`);
};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/servicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'servicio.html'));
})

app.get('/aviso-legal', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'aviso-legal.html'));
})

app.get('/privacidad', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'privacidad.html'));
})

app.post('/formulario', async (req, res) => {
    if (req.body.name === '') {
        // Verificación de consentimiento expreso (RGPD)
        if (!req.body.privacidad) {
            return res.status(400).send('Debe aceptar la política de privacidad para enviar el formulario.');
        }

        const nombre = req.body.nombre
        const apellidos = req.body.apellidos
        const email = req.body.email
        const mensaje = req.body.mensaje
        const telefono = req.body.telefono || 'No facilitado'

        // Verificación anti-spam: URLs conocidas
        if (mensaje.includes('telegra.ph')) {
            logBlockedAttempt('URL prohibida (telegra.ph)');
            return res.status(400).send('Spam detected');
        }

        // Verificación de idioma
        const langCode = franc(mensaje);
        
        // Criterios de bypass para evitar falsos positivos:
        // Mensajes que contienen palabras clave del negocio
        const hasBusinessKeywords = /aceite|comprar|pedido|litros|oliva/i.test(mensaje);
        const isSpanishOrCatalan = ['spa', 'cat'].includes(langCode) || 
                                 /[áéíóúñàèìòùç]/i.test(mensaje) || 
                                 / (el|la|los|las|de|que|en|un|una|es|y) /i.test(mensaje);

        if (!hasBusinessKeywords && !isSpanishOrCatalan) {
            logBlockedAttempt(`Idioma no soportado (${langCode})`);
            return res.status(400).send('Solo se permiten mensajes en español o catalán.');
        }

        // Filtro de caracteres no latinos (para spam en otros alfabetos)
        const nonLatinChars = mensaje.match(/[^\u0000-\u007F\u00C0-\u00FF]/g);
        if (nonLatinChars && nonLatinChars.length > (mensaje.length / 3)) {
            logBlockedAttempt('Caracteres no latinos excesivos');
            return res.status(400).send('Spam detected');
        }
        
        try {
            console.log(`[NUEVA_CONSULTA] Procesando mensaje legítimo | Fecha: ${new Date().toISOString()}`);

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

            console.log("¡Correo enviado con éxito!", data.id);
            res.send('Ok'); 

        } catch (error) {
            console.error("Error crítico en el servidor:", error);
            res.status(500).send('Error interno');
        }
    } else {
        logBlockedAttempt('Honeypot activado (campo name relleno)');
        res.status(400).send('Bot detected')
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

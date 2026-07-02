require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const { Resend } = require('resend');

const port = process.env.PORT || 3000 
const app = express()

const resend = new Resend(process.env.RESEND_API_KEY);

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
        
        try {
            const { data, error } = await resend.emails.send({
                
                from: 'Cooperativa <onboarding@resend.dev>',
                to: 'varoppo@gmail.com', 
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
        console.log('bot')
        res.status(400).send('Bot detected')
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
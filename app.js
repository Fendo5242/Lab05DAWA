const express = require('express');
const jwt = require("jsonwebtoken");
const config = require('./public/scripts/config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('/user', (req, res, next) => {
    console.log('Por aquí pasamos');
    next();
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/sinup', (req, res) => {
    if (req.body.username === 'Jose Perez' && req.body.password === '29') {
        const user = {
            nombre: req.body.username,
            password: req.body.password
        };
        jwt.sign({ user: user }, 'secretkey', { expiresIn: '32s' }, (err, token) => {
            if (err) {
                return res.status(500).json({ error: 'Error al generar el token' });
            }
            console.log(token)
            res.redirect('/index')
        });
    } else {
        res.status(401).json({
            auth: false,
            message: 'Credenciales incorrectas'
        });
    }
});

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/sinin', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            const expiredTokenMessage = "Token expirado. Por favor, inicie sesión nuevamente.";
            console.log(expiredTokenMessage); // Añade este registro para depurar
            res.status(403).send(`<script>alert("${expiredTokenMessage}"); window.location.href = "/";</script>`);
        } else {
            res.json({
                mensaje: "Sesión iniciada",
                authData: authData
            });
        }
    });
});

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000, http://localhost:3000/')
});
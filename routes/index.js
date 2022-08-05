'use strict'

const models = require('../models/model')
const express = require('express')
// const { response } = require('../app')

const router = express.Router()
module.exports = router

// Escriban sus rutas acá
// Siéntanse libres de dividir entre archivos si lo necesitan
router.get('/users', (req, res) => {
    res.status(200).json(models.listUsers());
});

router.post('/users', (req, res) => {
    const {email, name} = req.body;

    let users = models.listUsers();
    let user = users.find(u => u.email === email);
    if(user) res.status(400).json({ error: 'El usuario ya existe'});
    
    models.addUser(email, name);
    res.status(201).json({ msg: `Usuario ${email} creado correctamente`});
});

router.patch('/users/plan', (req, res) => {

    const email = req.query.user;
    let users = models.listUsers();
    let user = users.find(u => u.email === email);

    if(!user) res.status(404).json({ error: 'Usuario inexistente' });

    models.switchPlan(user.email);
    res.status(200).json({ msg: `${user.name}, ahora tienes el plan ${user.plan}`});
    
})


// Hint:  investigá las propiedades del objeto Error en JS para acceder al mensaje en el mismo.



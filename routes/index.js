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
});

router.get('/series', (req, res) => {
    res.status(200).json(models.listSeries());
});

router.post('/series', (req, res) => {

    const {name, seasons, category, year} = req.body;
    let allSeries = models.listSeries();
    let matchedSerie = allSeries.find(s => s.name === name);

    if(matchedSerie) res.status(400).json({ error: `La serie ${name} ya existe`});
    if(category !== 'regular' && category !== 'premium') res.status(400).json({ error: `La categoría ${category} no existe`});

    models.addSerie(name, seasons, category, year);
    res.status(201).json({ msg: `La serie ${name} fue agregada correctamente`});
});

router.get('/series/:category', (req, res) => {
    
    const {category} = req.params;
    if(category !== 'regular' && category !== 'premium') res.status(404).json({ error: `La categoría ${category} no existe` });

    res.status(200).json(models.listSeries(category));
});

router.get('/play/:serie', (req, res) => {

    const {serie} = req.params;
    const email = req.query.user;

    let users = models.listUsers();
    let user = users.find(u => u.email === email);
    let allSeries = models.listSeries();
    let matchedSerie = allSeries.find(s => s.name === serie);

    if(!user) res.status(404).json({ error: 'Usuario inexistente' });
    if(!matchedSerie) res.status(404).json({ error: 'Serie inexistente' });
    if(matchedSerie.category !== user.plan) res.status(404).json({ error: 'Contenido no disponible, contrata ahora HenryFlix Premium!' });

    res.status(200).json({ msg: models.play(serie, email)});

});



// Hint:  investigá las propiedades del objeto Error en JS para acceder al mensaje en el mismo.



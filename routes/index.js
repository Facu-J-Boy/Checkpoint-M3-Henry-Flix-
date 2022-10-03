"use strict";

/* const objeto = {
	id: 1,
	nombre: "gonzalo"
}

DESTRUCTURING 
const {nombre} = objeto

const query = {
	user: "correo@correo.com",
	name: "gonzalo"
}

const {user} = query 
console.log(user) -> correo@correo.com

const {email} = query ->UNDEFINED */

const models = require("../models/model");

//models.listUsers()
const express = require("express");
// const { response } = require('../app')

const router = express.Router();
module.exports = router;

// Escriban sus rutas acá
// Siéntanse libres de dividir entre archivos si lo necesitan
router.get("/users", (req, res) => {
  //NO RECIBE NADA ni por query, ni por params, ni por body

  //.JSON(tenes que devolver un OBJETO || ARREGLO)
  res.status(200).json(models.listUsers());
});

router.post("/users", (req, res) => {
  const { email, name } = req.body;

  let users = models.listUsers(); //ME TRAIGO TODOS LOS USUARIOS
  let user = users.find((user) => user.email === email); //ME FIJO SI EXISTE EL USUARIO

  //si existe, retornamos error
  if (user) res.status(400).json({ error: "El usuario ya existe" });

  //SI NO EXISTE, lo agregamos
  models.addUser(email, name);
  res.status(201).json({ msg: `Usuario ${email} creado correctamente` });
});

router.patch("/users/plan", (req, res) => {
  //{  email, name, apellido, direccion} -> PUT-> actualizo email, name -> {email, name} LO SOBREESCRIBE
  //->PATCH -> actualizo email, name -> {email, name, apellido, direccion} ->SOLO SOBREESCRIBE LAS PROPIEDADES QUE ACTUALIZAMOS Y NO TODO EL OBJETO
  const email = req.query.user; //PONGAN EL NOMBRE DE LA QUERY siempre que hagan query
  //PARA HACER UN DESTRUCTURING -> EL NOMBRE DE LA QUERY === al nombre que le doy a la CONSTANTE -> user=email@correo.com

  //.patch('/users/plan?user=wan@henryflix.com') -> MI QUERY se llama user; ?[user]->nombre de la QUERY (nombre de la propiedad)
  //=wan@henryflix.com -> lo que esta desp del = [el valor de mi query] {user: wan@henryflix.com }
  //ME TRAIGO TODOS LOS USERS CON LA FUNCION DEL MODELO listUsers
  let users = models.listUsers();
  //VERIFICO SI ESE USUARIO EXISTE CON UN FIND -> email
  let user = users.find((user) => user.email === email);

  //SI EL USUARIO NO EXISTE -> RETORNO EL ERROR CON EL MSJ COMO ESTA EN LOS TEST
  if (!user) return res.status(404).json({ error: "Usuario inexistente" });

  //SI EL USUARIO EXISTE, LO PATCHEO (le cambio el plan)
  models.switchPlan(user.email);
  res
    .status(200)
    .json({ msg: `${user.name}, ahora tienes el plan ${user.plan}` });
});

router.get("/series", (req, res) => {
  res.json(models.listSeries());
});

router.post("/series", (req, res) => {
  const {name, seasons, category, year} = req.body;
  let show = models.listSeries();
  let serie = show.find((s) => s.name === name);
  if(serie) res.status(400).json({error: `La serie ${name} ya existe`});
  if(category !== 'regular' && category !== 'premium') res.status(400).json({error: `La categoría ${category} no existe`
  });
  models.addSerie(name, seasons, category, year)
  res.status(201).json({msg: `La serie ${name} fue agregada correctamente`});
});

router.get("/series/:category", (req, res) => {
  const {category} = req.params;

  if(category !== 'regular' && category !== 'premium') res.status(404).json({error: `La categoría ${category} no existe`});

  res.status(200).json(models.listSeries(category));
});

router.get("/play/:serie", (req, res) => {
  const {serie} = req.params;
  const email = req.query.user;
  let usuarios = models.listUsers();
  let usuario = usuarios.find((u) => u.email === email);
  let allSeries = models.listSeries();
  let foundSerie = allSeries.find((s) => s.name === serie);
  if(!usuario) res.status(404).json({error: 'Usuario inexistente'});
  if(!foundSerie) res.status(404).json({ error: 'Serie inexistente' });
  if(foundSerie.category === 'premium' && usuario.plan !== 'premium') res.status(404).json({ error: 'Contenido no disponible, contrata ahora HenryFlix Premium!' });
  res.status(200).json({ msg: `Reproduciendo ${serie}` });
});

router.get("/watchAgain", (req, res) => {
  const email = req.query.user;
  let allUsers = models.listUsers();
  let foundUser = allUsers.find((u) => u.email === email);
  if(!foundUser) res.status(404).json({ error: 'Usuario inexistente' });
  res.status(200).json(models.watchAgain(email));
});

router.post("/rating/:serie", (req, res) => {
  const {serie} = req.params;
  const {email, score} = req.body;
  let allUsers = models.listUsers();
  let allSeries = models.listSeries();
  let foundUser = allUsers.find((u) => u.email === email);
  let foundSerie = allSeries.find((s) => s.name === serie);
  if(!foundUser) res.status(404).json({ error: 'Usuario inexistente' });
  if(!foundSerie) res.status(404).json({ error: 'Serie inexistente' });
  if(score < 1 || score > 5) res.status(404).json({ error: 'Puntaje inválido' });
  if(!foundUser.watched.includes(serie)) res.status(404).json({ error: 'Debes reproducir el contenido para poder puntuarlo' });
  models.rateSerie(serie, email, score);
  res.status(200).json({ msg: `Le has dado ${score} puntos a la serie ${serie}` });
});

// Hint:  investigá las propiedades del objeto Error en JS para acceder al mensaje en el mismo.
  


  
  
  
  
  


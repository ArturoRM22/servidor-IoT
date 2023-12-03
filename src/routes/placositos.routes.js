const express = require('express');
const expressWs = require('express-ws');
const router = express.Router();
const placasFunciones = require('../controllers/placas.funciones.js');
const placositosFunciones = require('../controllers/placositos.funciones.js')


expressWs(router);

// placa funciones
router.ws('/carplate', placasFunciones.get_carplate);

//placositos funciones (registrar usuario, verificar login, get registros etc..)
router.get('/ingresos_generales', placositosFunciones.get_ingresos);
router.get('/ingresos_residente/:direccion', placositosFunciones.get_ingresos_usuario);
router.get('/usuarios', placositosFunciones.get_usuarios);
router.post('/agregar-ingreso', placositosFunciones.agregar_ingreso);
router.post('/registrar-usuario', placositosFunciones.registrar_usuario);
router.post('/verificar-usuario', placositosFunciones.verify_login);
router.post('/agregar-placa/:direccion', placositosFunciones.agregar_placa);
router.patch('/update-ingreso/:id', placositosFunciones.update_ingreso);
router.patch('/update-usuario/:id', placositosFunciones.update_usuario);
router.delete('/delete-ingreso/:id', placositosFunciones.delete_ingreso);

module.exports = router;

const { pool } = require('../db_connection.js');


const get_ingresos = async (req, res) => {
    try {
      const [result] = await pool.query('SELECT * FROM control_ingresos');
      console.log(result);
      res.json(result);
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  };

const get_ingresos_usuario = async (req, res) => {
    try{
        const direccion = req.params.direccion;
        const [result] = await pool.query('SELECT id, placa, nombre FROM control_ingresos WHERE direccion = ?', direccion);
        res.json(result);
    }catch (err) {
        res.status(500);
        res.send(err.message);
    }
}

  const agregar_ingreso = async(req, res) => {
    try{
        const {placa, nombre, fecha, hora_entrada, hora_salida, notas, domicilio, registrado} = req.body;
        console.log(hora_entrada);
        await pool.query(`INSERT INTO control_ingresos (placa, nombre, fecha, hora_entrada, hora_salida, notas, domicilio, registrado)
        VALUES ('${placa}', '${nombre}', '${fecha}', '${hora_entrada}', '${hora_salida}', '${notas}', '${domicilio}', '${registrado}')`);
        res.json("Ingreso agregado");
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
};

const registrar_usuario = async(req, res)=>{
    try{
        const {nombre, password, correo, direccion, tipo} = req.body;
        const [rows] = await pool.query(`SELECT * FROM usuarios WHERE correo = '${correo}' AND password = '${password}'`);
        console.log(rows);   
        if(rows.length > 0){
            res.json({
            mensaje: "Este correo ya esta registrado",
            estado: "fallido"
        });
            return;
        }
        await pool.query(`INSERT INTO usuarios (nombre, password, correo, direccion, tipo) VALUES ('${nombre}', '${password}', '${correo}', '${direccion}', '${tipo}')`);
        res.json({
            estado: "existoso"
        });
    }catch(err){
        res.status(500);
        res.send(err.message);
    }
};

const verify_login = async(req, res)=>{
    try{
        const {correo, password} = req.body;
        console.log(correo, password);
        const [rows] = await pool.query(`SELECT * FROM usuarios WHERE correo = '${correo}' AND password = '${password}'`);
        if(rows.length > 0){
            return res.json(rows);
        }
        res.json({
            estado: "error"
        });
    }catch(err){
        res.status(500);
        res.send(err.message);
    }
};

const delete_ingreso = async (req, res) => {
    try{
        const id = req.params.id;
        const [delete_row] = await pool.query('DELETE FROM control_ingresos WHERE id = ?', id);
        if(delete_row.affectedRows){
            res.json("Se eliminó la visita");
            return;
        }
        res.json("No existe esta visita");
    }catch(err){
        res.status(500);
        res.send(err.message);
    }

}

const update_ingreso = async (req, res) => {
    try{
        const id = req.params.id;
        const {nombre, fecha, hora_entrada, hora_salida, direccion} = req.body;
        const [query] = await pool.query('UPDATE control_ingresos SET nombre = IFNULL(?, nombre), fecha = IFNULL(?, fecha), hora_entrada = IFNULL(?, hora_entrada), hora_salida = IFNULL(?, hora_salida), direccion = IFNULL(?, direccion), registrado = 1 WHERE id = ?', [nombre, fecha, hora_entrada, hora_salida, direccion, id]);
        if(query.affectedRows == 0 ){
            return res.status(404).json({
                message: 'No hay registro de este ingreso'
        })
    }
        const [row_updated] = await pool.query(`SELECT * FROM control_ingresos WHERE id = ${id}`);
        res.json(row_updated[0]);
    }catch(err){
        res.status(500);
        res.send(err.message);
    }
};

const agregar_placa = async(req,res)=>{
    try{
        const direccion =  req.params.direccion;
        const {nombre, placa} = req.body;
        const [rows] = await pool.query(`SELECT * FROM control_ingresos WHERE placa = '${placa}'`); 
        console.log(placa);
        console.log(rows.length);
        if(rows.length > 0){
            res.json("Esta placa ya esta registrada");
            return;
        }
        const [query] = await pool.query(`INSERT INTO control_ingresos (placa, nombre, direccion) VALUES ('${placa}', '${nombre}', '${direccion}')`);
        if(query.affectedRows > 0){
            res.json("Placa registrada exitosamente");
            return;
        }
        res.json("Error al registrar la placa");
    }catch(err){
        res.status(500);
        res.send(err.message);
    }
}

const get_usuarios = async(req, res) => {
    try{
    const [usuarios] = await pool.query('SELECT `nombre`, `direccion`, `tipo` FROM usuarios');
    res.json(usuarios);
    }catch(err){
        res.status(500);
        res.send(err.message);
    }
};

const update_usuario = async (req, res) => {
    try{
        const id_usuarios = req.params.id;
        const {nombre, password, correo, direccion, tipo} = req.body;
        const [query] = await pool.query('UPDATE usuarios SET nombre = IFNULL(?, nombre), password = IFNULL(?, password), correo = IFNULL(?, correo), direccion = IFNULL(?, direccion), tipo = IFNULL(?, tipo) WHERE id_usuarios = ? ', [nombre, password, correo, direccion, tipo, id_usuarios]);
        if(query.affectedRows == 0 ){
            return res.status(404).json({
                message: 'Este usuario no esta registrado'
        })
    }
        const [row_updated] = await pool.query(`SELECT * FROM usuarios WHERE id_usuarios = ${id_usuarios}`);
        res.json(row_updated[0]);
    }catch(err){
        res.status(500);
        res.send(err.message);
    }
};

module.exports = {
    get_ingresos,
    get_ingresos_usuario,
    agregar_ingreso,
    registrar_usuario,
    verify_login,
    update_ingreso,
    delete_ingreso,
    agregar_placa,
    get_usuarios,
    update_usuario
  };
const { pool } = require('../db_connection.js');
const db = require('../firebase_connection.js');
const { exec } = require('child_process');
const { messaging } = require('firebase-admin');
const { promisify } = require('util');
const execPromise = promisify(exec);
const WebSocket = require('ws');

// Lista de clientes WebSocket conectados
const clients = [];

const get_distancia = (callback) => {
  try {
    // Escucha cambios continuos en el valor de 'Proximity'
    db.ref('Proximity').on('value', (snapshot) => {
      const prox = snapshot.val();
      console.log('Proximity:', prox);
      callback(prox); // Llama al callback con la proximidad
    });
  } catch (err) {
    console.error(`Error al realizar la consulta a Firestore: ${err}`);
    throw new Error('Error al realizar la consulta a Firestore');
  }
};

// Función para configurar el WebSocket
const get_carplate = (ws, res) => {
  try {
    // Abre la conexión WebSocket
    clients.push(ws);
    // Log de clientes para verificar
    console.log('Clientes conectados:', clients.length);

    // Escucha el evento de cierre de conexión y remueve el cliente de la lista
    ws.on('close', () => {
      const index = clients.indexOf(ws);
      if (index > -1) {
        clients.splice(index, 1);
      }

      // Log de clientes después de remover uno
      console.log('Clientes conectados después de cerrar conexión:', clients.length);
    });
    ws.on('message', (message) => {
      console.log(`Mensaje recibido desde el cliente: ${message}`);

      // Envía un mensaje de vuelta al cliente que envió el mensaje
      ws.send(`Servidor: Recibí tu mensaje: ${message}`);
    });
    // Define la lógica a ejecutar cuando cambia la proximidad
    const handleProximityChange = async (prox) => {
      console.log("prox: ", prox);
      broadcastMessage(prox);
      if (10 < prox && prox < 15) {
        // Resto de tu lógica aquí

        const tomar_foto = 'src/python/takePictures.py';
        await execPromise(`python ${tomar_foto}`);
        
        const detectar_placa = 'src/python/prueba.py';
        const { stdout, stderr } = await execPromise(`python ${detectar_placa}`);
        if (stderr) {
          console.error(`Errores del script: ${stderr}`);
          res.status(500).json({ error: 'Error al ejecutar el script' });
          return;
        }
        const placa = stdout.trim();
        console.log("placa: ",placa);
        if(placa.length == 0){
          console.log('Placa no detectada');
          return;
        }
        const [rows] = await pool.query(`SELECT * FROM control_ingresos WHERE placa = '${placa}'`);
        console.log(rows.length);
        // Resto de tu lógica aquí
        if (rows.length > 0) {
          db.ref('/access').set(1);
          return;
        }
        await pool.query(`INSERT INTO control_ingresos (placa) VALUES ('${placa}')`);
        db.ref('/access').set(0);
      } else {
        console.log('Fuera de zona');
        
      }
    };

    // Llama a get_distancia con el callback
    get_distancia(handleProximityChange);

    // Escucha el evento de cierre de conexión y remueve el cliente de la lista
    ws.on('close', () => {
      const index = clients.indexOf(ws);
      if (index > -1) {
        clients.splice(index, 1);
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: 'Error en la aplicación' });
  }
};

// Función para transmitir un mensaje a todos los clientes WebSocket conectados
const broadcastMessage = (message) => {
  console.log("broadcastMessage: ", message);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
};

module.exports = {
  get_carplate
};

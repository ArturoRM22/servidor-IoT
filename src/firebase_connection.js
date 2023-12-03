var admin = require("firebase-admin");
var serviceAccount = require("../servicio-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dbpractica3-31ed3-default-rtdb.firebaseio.com"
});

// Exporta la instancia de Firestore directamente
const db = admin.database();
module.exports = db;
// El SDK de Cloud Functions para Firebase para crear funciones de nube y activadores
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// El SDK de Firebase Admin para acceder a Firestore
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

// Tome el parámetro de texto pasado a este punto final HTTP e insértelo en
// Firestore bajo la ruta /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
    //toma el parametro de texto
    const original = req.query.text;

    // Inserta el nuevo mensaje en Firestore usando el SDK de administrador de Firebase.
    const writeResult = await getFirestore().collection("messages").add({
        oriiginal: original
    })

    // Enviar un mensaje de que hemos escrito correctamente el mensaje

    res.json({ result: `Mensaje con id: ${writeResult.id} agregado.` });
})

// Escucha nuevos mensajes agregados a /messages/:documentId/original
// y guarda una versión en mayúsculas del mensaje
// a /mensajes/:documentId/mayúsculas
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
    // Toma el valor actual de lo que se escribió en Firestore.
    const original = event.data.data().original;

    // Accede al parámetro `{documentId}` con `event.params`
    logger.log("Mayusculas", event.params.documentId, original);

    const uppercase = original.toUpperCase();

    // Debes devolver una Promesa al realizar
    // tareas asincrónicas dentro de una función
    // como escribir en Firestore.
    // Establecer un campo en 'mayúsculas' en el documento de Firestore devuelve una Promesa.

    return event.data.ref.set({ uppercase }, { merge: true });
})


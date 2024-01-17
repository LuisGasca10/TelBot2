const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt"));
const numCorrection = require("../helpers/numCorrection");
const prcocessMessage = require('../helpers/processMessage');
const _ = require('lodash');



const verifyToken = (req, res) => {
    try {
        const accessToken = "Fyf?imxoRiQBQ9rRBQbbKYRpdU3ZD74B2i?Ka3rfO8ZP1EIiDMP/DttWRTWF!n6k";
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (challenge != null && token != null && token === accessToken) {
            res.send(challenge);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(400).send();
    }
}

const reciveMessage = async (req, res) => {
    try {
        const entry = (req.body["entry"])[0];
        const changes = (entry["changes"])[0];
        const value = changes["value"];
        const messageObject = value["messages"]

        if (typeof messageObject != "undefined") {
            const message = messageObject[0];
            const number = message["from"]
            const text = getTextUser(message);
            const numCorrect = numCorrection.correctionMex(number);
            const tarea = extraerTarea(text);
            // console.log(tarea);

            if (text != "") {
                console.log('ANTES DEL PROCESSMESSAGE');
                if (text === '!ayuda') {
                    await prcocessMessage.processAyuda(numCorrect);
                }
                else await prcocessMessage.processMessage(tarea, numCorrect);
            }

        }
        res.send("EVENT_RECEIVED");
    } catch (error) {
        myConsole.log(error);
        res.send("EVENT_RECEIVED");
    }
}

/**
 * 
 * @param {any} message
 * @returns - El mensaje enviado por el usuario
 */

const getTextUser = (message) => {
    let text = "";
    const typeMessage = message["type"];
    if (typeMessage === "text") {
        text = (message["text"]["body"]);

    } else if (typeMessage === "interactive") {
        const interactiveObject = message["interactive"];
        const typeInteractive = interactiveObject["type"];
        if (typeInteractive === "button_reply") {

            text = (interactiveObject["button_reply"])["title"];

        } else if (typeInteractive === "list_reply") {
            text = (interactiveObject["list_reply"])["title"];
        } else {
            console.log("Sin mensaje")
        }

    } else {
        console.log("Sin mensaje")
    }
    return text;
}

module.exports = {
    verifyToken,
    reciveMessage,
}



/**
 * 
 * @param {string} message  -El mensaje extraido anteriormente con getTextUser
 * @returns -EL mensaje separado en partes
 */
const extraerTarea = (message) => {
    let messageTemp = message
    let expediente = '';
    let opcion = '';
    let prioridad = null;

    const match = messageTemp.match(/Prioridad:(\d+)/);
    if (match && match[1]) {
        prioridad = match[1];

        messageTemp = messageTemp.replace(match[0], '');

    } else {
        console.log('No se encontró la prioridad.');
    }

    //Extrae el expedinete
    if (message.includes('Modalidad:')) {
        expediente = _.split(message, 'Expediente:')[1].split(' Modalidad:')[0];
    } else if (message.includes('Cope:')) {
        expediente = _.split(message, 'Expediente:')[1].split(' Cope:')[0];
    } else if (message.includes('Ambos:')) {
        expediente = _.split(message, 'Expediente:')[1].split(' Ambos:')[0];
    } else if (message.includes('Zonas:')) {
        expediente = _.split(message, 'Expediente:')[1].split(' Zonas:')[0];
    };
    //EXtrae el cope o la madalidad
    let tarea = _.split(message, ' Expediente:')[0];

    // console.log('Extraido Tarea: ' + tarea);
    if (tarea === 'COPE') {

        const cop = _.split(message, 'Cope:')[1].toUpperCase();
        opcion = `CT ${cop}`

        return {
            tarea,
            expediente,
            opcion,
            prioridad
        }
    } else if (tarea === 'MODALIDAD') {
        opcion = _.split(message, 'Modalidad:')[1].toUpperCase();

        return {
            tarea,
            expediente,
            opcion,
            prioridad
        }
    } else if (tarea === 'AMBOS') {
        opcion = _.split(message, 'Ambos:')[1].toUpperCase();
        return {
            tarea,
            expediente,
            opcion,
            prioridad
        }
    } else if (tarea === 'ZONIFICAR') {


        opcion = _.split(messageTemp, 'Zonas:')[1];

        if (opcion.toLowerCase().trim() === 'seleccionar todo' || opcion.toLowerCase().trim() === 'deseleccionar todo') {

            return {
                tarea,
                expediente,
                opcion,
                prioridad
            }
        } else {
            opcion = opcion.split(',');

            opcion = opcion.map(numero => {
                const numeroEntero = parseInt(numero, 10);
                return numeroEntero < 10 ? `0${numeroEntero}` : `${numeroEntero}`;
            });
            return {
                tarea,
                expediente,
                opcion,
                prioridad
            }

        }


    }

}


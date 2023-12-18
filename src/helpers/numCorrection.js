
/**
 * 
 * @param {string} num - Numero de telefono
 * @returns  El numero de telefeno que mando el mensaje
 */
const correctionMex = (num) => {

    if (num.startsWith("52") && num[2] === "1") {
        // Eliminamos el tercer dígito
        num = num.slice(0, 2) + num.slice(3);
    }
    return "" + num
}

module.exports = {
    correctionMex
}
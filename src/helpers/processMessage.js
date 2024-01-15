const puppeteer = require('puppeteer');
const whatsappModel = require('../shared/whatsappModel');
const whatsappService = require('../services/whatsappServices');
const botAcciones = require('../puppeteer/puppeteer');
require("dotenv").config();
const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt"));

const buttonZona = 'table.table tbody tr:nth-child(1) td:nth-child(17) button';

const description = '[class="description"]';



const processMessage = async (textUser, num) => {

    let models = [];
    try {
        const accion = await signInPage(textUser);

        if (accion === true) {
            const data = whatsappModel.messageText('Se completo la accion', num);
            models.push(data);


        } else {
            const data = whatsappModel.messageText('No se pudo completar la operacion', num);
            models.push(data);
        }

    } catch (error) {
        const data = whatsappModel.messageText('Error en la petición', num);
        models.push(data);
        console.log(error);
    };

    models.forEach(model => {
        whatsappService.sendMessageWhatsApp(model);
    });


}






async function signInPage(info) {

    try {
        const { tarea, expediente, opcion, prioridad } = info;

        let success = false;
        console.log({ info });

        const browser = await puppeteer.launch({
            // executablePath:
            //     process.env.NODE_ENV === 'production'
            //         ? process.env.PUPPETEER_EXECUTABLE_PATH
            //         : puppeteer.executablePath(),
            ignoreDefaultArgs: ['--disable-extensions'],
            args: [
                "--disable-setuid-sandbox",
                '--no-sandbox',
                "--single-process",
                "--no-zygote",
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--deterministic-fetch',
                '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials',
                '--disable-features=site-per-process',
            ],

            headless: false
        });

        // console.log({ info });
        const page = await browser.newPage();
        console.log('NEW PAGE');
        // await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36")
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        await page.goto('https:satec.rednacional.com/SatecAbc/#/Login');
        await page.type('[name="username"]', 'CarlosArtur3168');
        await page.type('[name="password"]', 'CarlosArtur3168');
        await page.click('button[class="btn btn-primary pull-right"]');
        await page.waitForNavigation();
        await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
        });
        await page.click('a[ href="#/Listado-usuario-tecnico"]');
        await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
        });
        await page.waitForSelector(description);

        await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 1500);  //Espera 5 segundos antes de continuar
            });
        });


        const select = await page.$('select[name="sistema"]');
        await select.select('expediente');

        await page.type('[name="txtBuscar"]', expediente);
        await page.click('button[ type="submit"]');
        await page.waitForSelector(description);





        switch (tarea) {
            case 'COPE':
                console.log({ opcion });
                success = await botAcciones.editCOPE(page, opcion);
                break;

            case 'MODALIDAD':
                success = await botAcciones.editModalidad(page, opcion);
                break;

            case 'AMBOS':
                success = await botAcciones.editCOPEandModalidad(page, opcion);
                break;
            case 'ZONIFICAR':
                success = await botAcciones.editZonas(page, opcion, prioridad)
                break;

        }

        console.log(`success: ${success}`);

        await page.screenshot({
            path: 'screenshot.png',
            fullPage: true,
        });
        await browser.close();


        return success;


    } catch (error) {
        console.log(error);
    }

}




module.exports = {
    processMessage
}
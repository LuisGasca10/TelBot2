const puppeteer = require('puppeteer');
const whatsappModel = require('../shared/whatsappModel');
const whatsappService = require('../services/whatsappServices');
// const botAcciones = require('../puppeteer/puppeteer');
require("dotenv").config();
const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt"));

const buttonZona = 'table.table tbody tr:nth-child(1) td:nth-child(17) button';

const description = '[class="description"]';



const processMessage = async (textUser, num) => {

    let models = [];
    try {
        console.log('Inicio');
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
        console.log('bucle');
        whatsappService.sendMessageWhatsApp(model);
    });


}






async function signInPage(info) {

    try {
        const { tarea, expediente, opcion, prioridad } = info;

        let success = false;
        console.log({ info });

        const browser = await puppeteer.launch({
            executablePath:
                process.env.NODE_ENV === 'production'
                    ? process.env.PUPPETEER_EXECUTABLE_PATH
                    : puppeteer.executablePath(),
            // ignoreDefaultArgs: ['--disable-extensions'],
            // args: [
            //     "--disable-setuid-sandbox",
            //     '--no-sandbox',
            //     "--single-process",
            //     "--no-zygote",
            //     '--disable-gpu',
            //     '--disable-dev-shm-usage',
            //     '--disable-setuid-sandbox',
            //     '--no-first-run',
            //     '--no-sandbox',
            //     '--no-zygote',
            //     '--deterministic-fetch',
            //     '--disable-features=IsolateOrigins',
            //     '--disable-site-isolation-trials',
            //     '--disable-features=site-per-process',
            // ],

            headless: 'new'
        });

        // console.log({ info });
        const page = await browser.newPage();
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
                success = await editCOPE(page, opcion);
                break;

            case 'MODALIDAD':
                success = await editModalidad(page, opcion);
                break;

            case 'AMBOS':
                success = await editCOPEandModalidad(page, opcion);
                break;
            case 'ZONIFICAR':
                success = await editZonas(page, opcion, prioridad, browser)
                break;

        }

        console.log(`success: ${success}`);

        // await page.screenshot({
        //     path: 'screenshot.png',
        //     fullPage: true,
        // });
        await browser.close();


        return success;


    } catch (error) {

        console.log(error);
        return false
    }

}


const editCOPE = async (page, opcion) => {
    let = false;
    try {
        await page.click(buttonEdit);

        await page.waitForSelector('#spinner', { visible: false });
        await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 3000);
            });
        });

        const changeConfirm = await page.evaluate((optionText) => {
            const selectElement = document.getElementById('idCopeSelect');
            const options = selectElement.options;
            for (let option of options) {
                if (option.innerText === optionText) {
                    option.selected = true;
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    return true;
                } else {

                }
            }

        }, opcion);

        if (changeConfirm) {

            // await page.click('.btn.btn-danger');

            return true;
        } else {
            return false;
        }

    } catch (error) {
        return false;

    }





}

const editModalidad = async (page, opcion) => {

    let modalidad;

    if (opcion === 'APPLEX') {
        modalidad = 'GEORREFERENCIA';

    } else if (opcion === 'PIC') {
        modalidad = 'FIJO';
    } else {
        return false;
    }

    try {
        await page.click(buttonEdit);


        await page.waitForSelector('#spinner', { visible: false });
        await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 3000);
            });
        });

        const changeConfirm = await page.evaluate((optionText) => {
            const selectElement = document.getElementById('idModalidad');
            const options = selectElement.options;
            console.log({ options });

            for (let option of options) {
                if (option.innerText === optionText) {
                    option.selected = true;
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    return true;
                }
            }
        }, modalidad);

        if (changeConfirm) {
            // await page.click('.btn.btn-danger');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }



}


const editCOPEandModalidad = async (page, opciones) => {


    try {
        const op = opciones.split(',');

        const cope = `CT ${op[0].trim().toUpperCase()}`
        let modalidad = op[1].trim();

        if (modalidad === 'APPLEX') {
            modalidad = 'GEORREFERENCIA';

        } else if (modalidad === 'PIC') {
            modalidad = 'FIJO';
        } else {
            return false;
        }

        await page.click(buttonEdit);
        await page.waitForSelector('#spinner', { visible: false });
        await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 3000);
            });
        });


        const changeModalidadConfirm = await page.evaluate((optionText) => {
            const selectElement = document.getElementById('idModalidad');
            const options = selectElement.options;
            console.log({ options });

            for (let option of options) {
                if (option.innerText === optionText) {
                    option.selected = true;
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    return true;
                }
            }


        }, modalidad);

        console.log(`Modalidad: ${changeModalidadConfirm}`);

        const changeCOPEConfirm = await page.evaluate((optionText) => {
            const selectElement = document.getElementById('idCopeSelect');
            const options = selectElement.options;
            for (let option of options) {
                if (option.innerText === optionText) {
                    option.selected = true;
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));

                    return true;
                }
            }
        }, cope);

        console.log(`COPE: ${changeCOPEConfirm}`);



        if (changeCOPEConfirm && changeModalidadConfirm) {
            // await page.click('.btn.btn-danger');
            return true
        } else {
            return false;
        }


    }
    catch (e) {
        console.log(e);

    }




}

const editZonas = async (page, opciones, prioridad, browser) => {

    try {
        // Obtiene el contenido del elemento y almacénalo en una constante
        const contenido = await page.$eval('table.table tbody tr:nth-child(1) td:nth-child(13)', element => element.textContent);
        const contenido2 = await page.$eval('table.table tbody tr:nth-child(1) td:nth-child(12)', element => element.textContent);
        await page.click(buttonZona);
        await page.waitForSelector('#spinner', { visible: false });
        await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 3000);
            });
        });

        if (contenido === 'FIJO') {

            const selectOptions = await page.$$('#idGpoAsigSelect option');


            //SELECT 
            //    Busca la opción que contiene la palabra 'INST'
            for (const option of selectOptions) {
                const optionText = await (await option.getProperty('textContent')).jsonValue();
                if (optionText.includes('INST')) {
                    await page.select('#idGpoAsigSelect', optionText);
                    break; // Rompe el bucle una vez que encuentres la opción
                }

                // Busca la opción que contiene la palabra 'MIXTO'
                if (optionText.includes('MIXTO')) {
                    await page.select('#idGpoAsigSelect', optionText);
                    break; // Rompe el bucle una vez que encuentres la opción
                }
            }
            await page.waitForSelector('label[for="Zona"]');

            await page.evaluate(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 3000);
                });
            });



            if (Array.isArray(opciones)) {
                console.log('Normal');
                const checkboxes = await page.$$('input[type="checkbox"]');

                let checkboxEncontrado = false;

                // Iterar sobre los números deseados
                for (const numeroDeseado of opciones) {
                    let checkboxEncontrado = false;

                    // Iterar sobre los checkboxes
                    for (const checkbox of checkboxes) {
                        // Obtener el texto del label asociado al checkbox
                        const labelText = await page.evaluate(el => {
                            const label = el.closest('div').querySelector('label');
                            return label ? label.innerText : '';
                        }, checkbox);

                        // Verificar si el número deseado está en el texto del label
                        if (labelText.includes(numeroDeseado)) {
                            // Marcar el checkbox
                            await checkbox.click();
                            checkboxEncontrado = true;
                            console.log(`Checkbox para el número ${numeroDeseado} marcado.`);
                            break;
                        }
                    }

                    if (!checkboxEncontrado) {
                        console.log(`No se encontró un checkbox para el número ${numeroDeseado}.`);
                    }
                }
            } else if (opciones.toLowerCase().trim() === 'deseleccionar todo') {
                console.log('EN DES');
                const buttonText = 'Deseleccionar todo';
                const button = await page.$x(`//button[contains(text(), "${buttonText}")]`);

                if (button.length > 0) {
                    // Hacer clic en el botón
                    await button[0].click();
                    console.log(`Botón "${buttonText}" clicado.`);
                } else {
                    console.log(`No se encontró el botón "${buttonText}".`);
                }

            } else if (opciones.toLowerCase().trim() === 'seleccionar todo') {
                console.log('SELEC TODO');
                const buttonText = 'Seleccionar todo';
                const button = await page.$x(`//button[contains(text(), "${buttonText}")]`);

                if (button.length > 0) {
                    // Hacer clic en el botón
                    await button[0].click();
                    console.log(`Botón "${buttonText}" clicado.`);
                } else {
                    console.log(`No se encontró el botón "${buttonText}".`);
                }

            }






        } else if (contenido === 'GEORREFERENCIA') {

            console.log('EN GEO');

            const changeConfirm = await page.evaluate((optionText) => {
                const selectElement = document.getElementById('idCope');
                const options = selectElement.options;
                for (let option of options) {
                    if (option.innerText === optionText) {
                        option.selected = true;
                        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                        return true;
                    } else {

                    }
                }

            }, contenido2);



            await page.evaluate(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 2000);
                });
            });
            const selectOptions = await page.$$('#idGpoAsigSelect option');
            // Busca la opción que contiene la palabra 'INST'
            for (const option of selectOptions) {
                const optionText = await (await option.getProperty('textContent')).jsonValue();
                if (optionText.includes('INST')) {
                    await page.select('#idGpoAsigSelect', optionText);
                    break; // Rompe el bucle una vez que encuentres la opción
                }
                // Busca la opción que contiene la palabra 'MIXTO'
                if (optionText.includes('MIXTO')) {
                    await page.select('#idGpoAsigSelect', optionText);
                    break; // Rompe el bucle una vez que encuentres la opción
                }
            }
            await page.waitForSelector('label[for="Zona"]');

            await page.evaluate(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 2000);
                });
            });



            if (Array.isArray(opciones)) {
                await page.select('#idprioridad', prioridad);



                const checkboxes = await page.$$('input[type="checkbox"]');

                let checkboxEncontrado = false;

                // Iterar sobre los números deseados
                for (const numeroDeseado of opciones) {
                    let checkboxEncontrado = false;

                    // Iterar sobre los checkboxes
                    for (const checkbox of checkboxes) {
                        // Obtener el texto del label asociado al checkbox
                        const labelText = await page.evaluate(el => {
                            const label = el.closest('div').querySelector('label');
                            return label ? label.innerText : '';
                        }, checkbox);

                        // Verificar si el número deseado está en el texto del label
                        if (labelText.includes(numeroDeseado)) {
                            // Marcar el checkbox
                            await checkbox.click();
                            checkboxEncontrado = true;
                            console.log(`Checkbox para el número ${numeroDeseado} marcado.`);
                            break;
                        }
                    }

                    if (!checkboxEncontrado) {
                        console.log(`No se encontró un checkbox para el número ${numeroDeseado}.`);
                    }
                }
            } else if (opciones.toLowerCase().trim() === 'deseleccionar todo') {
                await page.select('#idprioridad', prioridad);
                console.log('EN DES');
                const buttonText = 'Deseleccionar todo';
                const button = await page.$x(`//button[contains(text(), "${buttonText}")]`);

                if (button.length > 0) {
                    // Hacer clic en el botón
                    await button[0].click();
                    console.log(`Botón "${buttonText}" clicado.`);
                } else {
                    console.log(`No se encontró el botón "${buttonText}".`);
                }

            } else if (opciones.toLowerCase().trim() === 'seleccionar todo') {
                await page.select('#idprioridad', prioridad);
                console.log('SELEC TODO');
                const buttonText = 'Seleccionar todo';
                const button = await page.$x(`//button[contains(text(), "${buttonText}")]`);

                if (button.length > 0) {
                    // Hacer clic en el botón
                    await button[0].click();
                    console.log(`Botón "${buttonText}" clicado.`);
                } else {
                    console.log(`No se encontró el botón "${buttonText}".`);
                }

            }





        }

        // const buttonText='Guardar'

        // const button = await page.$x(`//button[contains(text(), "${buttonText}")]`);

        // if (button.length > 0) {
        //     // Hacer clic en el botón
        //     await button[0].click();
        //     console.log(`Botón "${buttonText}" clicado.`);
        // } else {
        //     console.log(`No se encontró el botón "${buttonText}".`);
        // }


        return true;
    } catch (error) {
        return false
    }
}

module.exports = {
    processMessage
}
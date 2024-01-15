const puppeteer = require('puppeteer');



const buttonEdit = 'table.table tbody tr:nth-child(1) td:nth-child(16) button';

const buttonZona = 'table.table tbody tr:nth-child(1) td:nth-child(17) button';

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

            await page.click('.btn.btn-danger');

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
            await page.click('.btn.btn-danger');
            await browser.close();
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
            await page.click('.btn.btn-danger');
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
    editCOPE,
    editModalidad,
    editCOPEandModalidad,
    editZonas
}

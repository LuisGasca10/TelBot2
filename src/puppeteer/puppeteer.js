const puppeteer = require('puppeteer');



const buttonEdit = 'table.table tbody tr:nth-child(1) td:nth-child(16) button';

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
            const selectElement = document.getElementById('idCopeSelect'); // Cambia 'idCopeSelect' al ID real de tu select
            const options = selectElement.options;
            for (let option of options) {
                if (option.innerText === optionText) {
                    option.selected = true;
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    // Dispara el evento change para que otros elementos respondan si es necesario
                    return true;
                } else {

                }
            }

        }, opcion);

        if (changeConfirm) {
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
                    selectElement.dispatchEvent(new Event('change', { bubbles: true })); // Dispara el evento change para que otros elementos respondan si es necesario
                    return true;
                }
            }
        }, modalidad);

        if (changeConfirm) {
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
                    selectElement.dispatchEvent(new Event('change', { bubbles: true })); // Dispara el evento change para que otros elementos respondan si es necesario
                    return true;
                }
            }


        }, modalidad);

        console.log(`Modalidad: ${changeModalidadConfirm}`);

        const changeCOPEConfirm = await page.evaluate((optionText) => {
            const selectElement = document.getElementById('idCopeSelect'); // Cambia 'idCopeSelect' al ID real de tu select
            const options = selectElement.options;
            for (let option of options) {
                if (option.innerText === optionText) {
                    option.selected = true;
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    // Dispara el evento change para que otros elementos respondan si es necesario
                    return true;
                }
            }
        }, cope);

        console.log(`COPE: ${changeCOPEConfirm}`);



        if (changeCOPEConfirm && changeModalidadConfirm) {
            return true
        } else {
            return false;
        }


    }
    catch (e) {
        console.log(e);

    }




}


module.exports = {
    editCOPE,
    editModalidad,
    editCOPEandModalidad
}
// const [COPE, MODALIDAD] = await Promise.all([editCOPE(page, cope), editModalidad(page, modalidad)]);
// console.log(`${COPE} + ${MODALIDAD}`);

// if (COPE && MODALIDAD) {
//     return true
// } else {
//     return false;
// }
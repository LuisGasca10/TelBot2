const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    });

    try {
        const page = await browser.newPage();

        // Navigate the page to a URL
        await page.goto('https://www.bing.com/');

        // Set screen size
        await page.setViewport({ width: 1080, height: 1024 });

        // Continue with typing text...

        const searchInput = await page.$('#sb_form_q'); // Replace with the actual selector for Bing's search box

        await searchInput.type('Puppeteer js');


        const url = await page.url();

        // Print the full title
        console.log('The title of this blog post is "%s".', url);

        res.send(url);
    } catch (e) {
        console.error(e);

    } finally {

        await browser.close();
    }

}
module.exports = { scrapeLogic };
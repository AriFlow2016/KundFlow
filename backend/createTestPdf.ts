import puppeteer from 'puppeteer';
import path from 'path';

async function createPdf() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Ladda HTML-filen
    await page.goto(`file:${path.join(__dirname, 'test.html')}`);
    
    // Generera PDF
    await page.pdf({
        path: 'test.pdf',
        format: 'A4'
    });

    await browser.close();
    console.log('PDF skapad: test.pdf');
}

createPdf().catch(console.error);

import puppeteer from 'puppeteer';

export const scrapeWebsite = async (url: string) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Example: scrape title
    const title = await page.title();

    // Example: scrape some data, adjust selectors as needed
    const data = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, p');
      return Array.from(elements).map(el => el.textContent);
    });

    await browser.close();

    return { title, data };
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  }
};
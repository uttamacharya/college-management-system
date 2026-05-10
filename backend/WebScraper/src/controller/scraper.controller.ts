import { type Request, type Response } from 'express';
import { scrapeWebsite } from '../services/scraper.service.js';

export const scrape = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const data = await scrapeWebsite(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Scraping failed' });
  }
};
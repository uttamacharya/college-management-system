import express from "express";

// controllers
import { scrape } from "../controller/scraper.controller.js";

const router = express.Router();

// Scraper route
router.post("/scrape", scrape);

export default router;
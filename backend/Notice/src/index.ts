import express from "express";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();

import noticeRoutes from "./routes/notice.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/notice", noticeRoutes);

const startServer = async () => {
  try {
    const port = process.env.PORT || 5004;

    app.listen(port, () => {
      console.log(`Notice service running on ${port}`);
    });

  } catch (error) {
    console.error(error);
  }
};

startServer();
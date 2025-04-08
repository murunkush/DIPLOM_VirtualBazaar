import express, { Request, Response } from 'express'; // Express-ээс төрөл импортлох
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();  // .env файлыг унших

const app = express();
const port = process.env.PORT || 5000;

// CORS тохиргоо хийх
app.use(cors());

// JSON хүсэлтүүдийг хүлээн авах
app.use(bodyParser.json());

// Root маршрут
app.get('/', (req: Request, res: Response) => {  // req болон res-ийн төрөл тодорхойлох
  res.send('API сервер амжилттай ажиллаж байна!');
});

// Серверийг эхлүүлэх
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root маршрут
app.get('/', (req: Request, res: Response) => {
  res.send('API сервер амжилттай ажиллаж байна!');
});

// TODO: эндээс доош нь бусад маршрутуудаа register хийнэ
// app.use('/api/users', userRoutes);
// app.use('/api/items', itemRoutes);
// app.use('/api/orders', orderRoutes);
// ...

// --- Тестийн зорилгоор экспортлох ---
export default app;

// --- Хэрвээ шууд “node”-гоор ажиллуулж байвал ---  
if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

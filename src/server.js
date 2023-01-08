import express from 'express';
import { routes } from './routes';
import 'dotenv/config';

const app = express();

app.use(express.json());

app.use(routes);

const PORT = process.env.PORT;

app.listen(PORT || 3030, () => {
  console.log(`Server running on port ${PORT}`);
});

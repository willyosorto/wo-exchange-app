import express, { Request, Response } from 'express';
import cors from 'cors';
import { getMockExchangeRate } from '../src/api/mockData';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock exchange rate endpoint
app.get('/pair/:from/:to/:amount', (req: Request, res: Response) => {
  const { from, to, amount } = req.params;
  
  // Simulate some latency
  setTimeout(() => {
    const result = getMockExchangeRate(from, to, parseFloat(amount));
    res.json(result);
  }, 100);
});

// Error endpoint for testing bad responses
app.get('/error/unauthorized', (_req: Request, res: Response) => {
  res.status(401).json({ error: 'Unauthorized' });
});

app.get('/error/not-found', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.get('/error/server-error', (_req: Request, res: Response) => {
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Mock Exchange API server running on http://localhost:${PORT}`);
});

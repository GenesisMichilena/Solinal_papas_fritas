import express, { Router, Request, Response } from 'express';

const router = Router();

// POST /api/auth/register
router.post('/register', (req: Request, res: Response) => {
  res.json({ message: 'Registro implementado' });
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  res.json({ message: 'Login implementado' });
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logout implementado' });
});

export default router;

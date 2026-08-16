import express, { Router, Request, Response } from 'express';

const router = Router();

// GET /api/documents
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Obtener documentos implementado' });
});

// POST /api/documents
router.post('/', (req: Request, res: Response) => {
  res.json({ message: 'Crear documento implementado' });
});

// GET /api/documents/:id
router.get('/:id', (req: Request, res: Response) => {
  res.json({ message: 'Obtener documento por ID implementado' });
});

// PUT /api/documents/:id
router.put('/:id', (req: Request, res: Response) => {
  res.json({ message: 'Actualizar documento implementado' });
});

// DELETE /api/documents/:id
router.delete('/:id', (req: Request, res: Response) => {
  res.json({ message: 'Eliminar documento implementado' });
});

export default router;

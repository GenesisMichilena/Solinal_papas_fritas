import express, { Router, Request, Response } from 'express';
import {
  analyzeDocumentCompliance,
  generateDocumentSummary,
  identifyComplianceGaps,
} from '../services/aiService.js';

const router = Router();

// POST /api/ai/analyze
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { content, standard } = req.body;

    if (!content || !standard) {
      return res
        .status(400)
        .json({ error: 'content y standard son requeridos' });
    }

    const analysis = await analyzeDocumentCompliance(content, standard);
    res.json(analysis);
  } catch (error) {
    console.error('Error en análisis:', error);
    res.status(500).json({ error: 'Error al analizar documento' });
  }
});

// POST /api/ai/summarize
router.post('/summarize', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'content es requerido' });
    }

    const summary = await generateDocumentSummary(content);
    res.json({ summary });
  } catch (error) {
    console.error('Error en resumen:', error);
    res.status(500).json({ error: 'Error al generar resumen' });
  }
});

// POST /api/ai/identify-gaps
router.post('/identify-gaps', async (req: Request, res: Response) => {
  try {
    const { content, requirements } = req.body;

    if (!content || !requirements) {
      return res
        .status(400)
        .json({ error: 'content y requirements son requeridos' });
    }

    const gaps = await identifyComplianceGaps(content, requirements);
    res.json({ gaps });
  } catch (error) {
    console.error('Error identificando gaps:', error);
    res.status(500).json({ error: 'Error al identificar gaps' });
  }
});

export default router;

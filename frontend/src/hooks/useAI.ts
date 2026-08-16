import { useState } from 'react';
import { aiAPI, AIAnalysisResult, AISummaryResult, AIGapsResult } from '@/services/apiService';

interface UseAIAnalysisState {
  loading: boolean;
  error: string | null;
  data: AIAnalysisResult | null;
}

interface UseAISummaryState {
  loading: boolean;
  error: string | null;
  data: AISummaryResult | null;
}

interface UseAIGapsState {
  loading: boolean;
  error: string | null;
  data: AIGapsResult | null;
}

/**
 * Hook para análisis de cumplimiento con IA
 */
export function useAIAnalysis() {
  const [state, setState] = useState<UseAIAnalysisState>({
    loading: false,
    error: null,
    data: null,
  });

  const analyze = async (content: string, standard: string) => {
    setState({ loading: true, error: null, data: null });
    try {
      const result = await aiAPI.analyzeCompliance(content, standard);
      setState({ loading: false, error: null, data: result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  };

  return { ...state, analyze };
}

/**
 * Hook para generar resúmenes con IA
 */
export function useAISummary() {
  const [state, setState] = useState<UseAISummaryState>({
    loading: false,
    error: null,
    data: null,
  });

  const summarize = async (content: string) => {
    setState({ loading: true, error: null, data: null });
    try {
      const result = await aiAPI.summarize(content);
      setState({ loading: false, error: null, data: result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  };

  return { ...state, summarize };
}

/**
 * Hook para identificar brechas de cumplimiento con IA
 */
export function useAIGaps() {
  const [state, setState] = useState<UseAIGapsState>({
    loading: false,
    error: null,
    data: null,
  });

  const identifyGaps = async (content: string, requirements: string[]) => {
    setState({ loading: true, error: null, data: null });
    try {
      const result = await aiAPI.identifyGaps(content, requirements);
      setState({ loading: false, error: null, data: result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  };

  return { ...state, identifyGaps };
}

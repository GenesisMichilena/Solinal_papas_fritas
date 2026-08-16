import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIAnalysisResult {
  summary: string;
  risks: string[];
  recommendations: string[];
  score: number;
}

export async function analyzeDocumentCompliance(
  documentContent: string,
  complianceStandard: string
): Promise<AIAnalysisResult> {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `
Analiza el siguiente documento en relación con el estándar de cumplimiento "${complianceStandard}".

Proporciona:
1. Un resumen de cumplimiento
2. Riesgos identificados (lista)
3. Recomendaciones (lista)
4. Una puntuación de cumplimiento (0-100)

Responde en JSON con la estructura:
{
  "summary": "...",
  "risks": ["...", "..."],
  "recommendations": ["...", "..."],
  "score": 75
}

DOCUMENTO:
${documentContent.substring(0, 5000)}
          `,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Parsear JSON de la respuesta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo parsear la respuesta de Claude');
    }

    const result = JSON.parse(jsonMatch[0]) as AIAnalysisResult;
    return result;
  } catch (error) {
    console.error('Error analizando documento con Claude:', error);
    throw error;
  }
}

export async function generateDocumentSummary(
  documentContent: string
): Promise<string> {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `
Proporciona un resumen ejecutivo conciso (máximo 150 palabras) del siguiente documento:

${documentContent.substring(0, 3000)}
          `,
        },
      ],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  } catch (error) {
    console.error('Error generando resumen:', error);
    throw error;
  }
}

export async function identifyComplianceGaps(
  documentContent: string,
  requirementsList: string[]
): Promise<string[]> {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `
Analiza si el siguiente documento cubre estos requisitos de cumplimiento:

Requisitos:
${requirementsList.map((req, i) => `${i + 1}. ${req}`).join('\n')}

Documento:
${documentContent.substring(0, 3000)}

Responde en JSON con un array de gaps identificados:
["gap1", "gap2", ...]
          `,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return [];
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error identificando gaps:', error);
    throw error;
  }
}

export default {
  analyzeDocumentCompliance,
  generateDocumentSummary,
  identifyComplianceGaps,
};

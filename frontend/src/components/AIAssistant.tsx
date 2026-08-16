import React, { useState } from 'react';
import { useAIAnalysis, useAISummary, useAIGaps } from '@/hooks/useAI';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AIAssistantProps {
  onAnalysisComplete?: (result: any) => void;
}

export function AIAssistant({ onAnalysisComplete }: AIAssistantProps) {
  const [documentContent, setDocumentContent] = useState('');
  const [standard, setStandard] = useState('ISO 27001');
  const [requirements, setRequirements] = useState<string[]>([]);

  const analysis = useAIAnalysis();
  const summary = useAISummary();
  const gaps = useAIGaps();

  const handleAnalyzeCompliance = async () => {
    if (!documentContent.trim()) {
      alert('Por favor ingresa contenido del documento');
      return;
    }
    try {
      const result = await analysis.analyze(documentContent, standard);
      onAnalysisComplete?.(result);
    } catch (error) {
      console.error('Error en análisis:', error);
    }
  };

  const handleSummarize = async () => {
    if (!documentContent.trim()) {
      alert('Por favor ingresa contenido del documento');
      return;
    }
    try {
      await summary.summarize(documentContent);
    } catch (error) {
      console.error('Error en resumen:', error);
    }
  };

  const handleIdentifyGaps = async () => {
    if (!documentContent.trim()) {
      alert('Por favor ingresa contenido del documento');
      return;
    }
    try {
      await gaps.identifyGaps(documentContent, requirements);
    } catch (error) {
      console.error('Error identificando brechas:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Asistente de IA para Documentos</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Contenido del Documento</label>
            <Textarea
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              placeholder="Pega el contenido del documento aquí..."
              className="min-h-[200px]"
            />
          </div>

          <Tabs defaultValue="analyze" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analyze">Analizar</TabsTrigger>
              <TabsTrigger value="summarize">Resumir</TabsTrigger>
              <TabsTrigger value="gaps">Brechas</TabsTrigger>
            </TabsList>

            {/* Tab: Analizar Cumplimiento */}
            <TabsContent value="analyze" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Estándar de Cumplimiento</label>
                <select
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option>ISO 27001</option>
                  <option>ISO 9001</option>
                  <option>GDPR</option>
                  <option>HIPAA</option>
                  <option>SOC 2</option>
                </select>
              </div>

              <Button
                onClick={handleAnalyzeCompliance}
                disabled={analysis.loading}
                className="w-full"
              >
                {analysis.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analizar Cumplimiento
              </Button>

              {analysis.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{analysis.error}</AlertDescription>
                </Alert>
              )}

              {analysis.data && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Resultado del Análisis
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Resumen:</p>
                      <p className="text-sm text-gray-600">{analysis.data.summary}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Puntuación de Cumplimiento:</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${analysis.data.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{analysis.data.score}%</span>
                      </div>
                    </div>

                    {analysis.data.risks.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Riesgos Identificados:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {analysis.data.risks.map((risk, idx) => (
                            <li key={idx}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.data.recommendations.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Recomendaciones:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {analysis.data.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Tab: Resumir */}
            <TabsContent value="summarize" className="space-y-4">
              <Button
                onClick={handleSummarize}
                disabled={summary.loading}
                className="w-full"
              >
                {summary.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generar Resumen
              </Button>

              {summary.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{summary.error}</AlertDescription>
                </Alert>
              )}

              {summary.data && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    Resumen Generado
                  </h3>
                  <p className="text-sm text-gray-700">{summary.data.summary}</p>
                </Card>
              )}
            </TabsContent>

            {/* Tab: Identificar Brechas */}
            <TabsContent value="gaps" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Requisitos (uno por línea)</label>
                <Textarea
                  value={requirements.join('\n')}
                  onChange={(e) => setRequirements(e.target.value.split('\n').filter(r => r.trim()))}
                  placeholder="Ingresa los requisitos que deben cumplirse..."
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleIdentifyGaps}
                disabled={gaps.loading}
                className="w-full"
              >
                {gaps.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Identificar Brechas
              </Button>

              {gaps.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{gaps.error}</AlertDescription>
                </Alert>
              )}

              {gaps.data && (
                <Card className={`p-4 border-2 ${gaps.data.severity === 'high' ? 'bg-red-50 border-red-200' : gaps.data.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    {gaps.data.severity === 'high' ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : gaps.data.severity === 'medium' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    Brechas Identificadas ({gaps.data.severity})
                  </h3>
                  <div className="space-y-3">
                    {gaps.data.gaps.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Brechas:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {gaps.data.gaps.map((gap, idx) => (
                            <li key={idx}>{gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {gaps.data.recommendations.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Recomendaciones:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {gaps.data.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}

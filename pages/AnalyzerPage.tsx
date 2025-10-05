import React, { useState, useCallback } from 'react';
import type { AnalysisResult, User, Note } from '../types';
import { analyzeAnimalImage } from '../services/geminiService';
import ImageUploader from '../components/ImageUploader';
import ResultDisplay from '../components/ResultDisplay';
import { DnaIcon } from '../components/icons/DnaIcon';

interface AnalyzerPageProps {
  user: User;
  onNavigate: (page: 'analyzer' | 'notes', data?: Partial<Note>) => void;
}

const AnalyzerPage: React.FC<AnalyzerPageProps> = ({ onNavigate }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError("Por favor, selecione uma imagem primeiro.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const analysisResult = await analyzeAnimalImage(base64Image, imageFile.type);
      setResult(analysisResult);
    } catch (err) {
      console.error(err);
      setError("Não foi possível analisar a imagem. A IA pode estar sobrecarregada ou o formato não é suportado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleReset = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };
  
  const handleSaveNote = (analysisResult: AnalysisResult) => {
    const noteContent = `
# Relatório de Análise: ${analysisResult.breed}

## Espécie
${analysisResult.species}

## Guia Alimentar

### Recomendado
${analysisResult.diet.recommended.map(item => `- ${item}`).join('\n')}

### A Evitar
${analysisResult.diet.avoid.map(item => `- ${item}`).join('\n')}

## Notas do Analista
${analysisResult.notes}
    `.trim();

    onNavigate('notes', {
      title: `Análise: ${analysisResult.breed}`,
      content: noteContent,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
       <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-2">
          <DnaIcon className="w-10 h-10 text-emerald-custom-600" />
          <h1 className="text-4xl sm:text-5xl font-bold text-emerald-custom-800 tracking-tight">
            Analisador Genético
          </h1>
        </div>
        <p className="text-lg text-slate-600">
          Identifique a raça e a dieta ideal do seu animal com precisão científica.
        </p>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
        {!result ? (
          <ImageUploader 
            onImageSelect={handleImageSelect}
            previewUrl={previewUrl}
            isLoading={isLoading}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
          />
        ) : (
          <ResultDisplay result={result} onReset={handleReset} previewUrl={previewUrl} onSaveNote={handleSaveNote} />
        )}

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Erro: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzerPage;

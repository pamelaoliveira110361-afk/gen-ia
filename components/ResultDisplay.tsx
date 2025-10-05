import React from 'react';
import type { AnalysisResult } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
  previewUrl: string | null;
  onSaveNote: (result: AnalysisResult) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset, previewUrl, onSaveNote }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-emerald-custom-800">Relatório de Análise</h2>
        <p className="text-slate-500">Resultados baseados na imagem fornecida.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {previewUrl && (
             <img src={previewUrl} alt="Animal Analisado" className="w-full h-auto object-cover rounded-lg shadow-lg border-4 border-white" />
          )}
          <div className="mt-4 p-4 bg-emerald-custom-50 rounded-lg border border-emerald-custom-200 text-center">
            <p className="text-sm text-emerald-custom-800 font-semibold">Espécie</p>
            <p className="text-xl font-bold text-emerald-custom-900">{result.species}</p>
            <hr className="my-2 border-emerald-custom-200" />
            <p className="text-sm text-emerald-custom-800 font-semibold">Raça Identificada</p>
            <p className="text-xl font-bold text-emerald-custom-900">{result.breed}</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-xl font-bold text-emerald-custom-700 border-b-2 border-emerald-custom-200 pb-2 mb-4">
              Guia Alimentar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-lg text-green-700 mb-2">Recomendado</h4>
                <ul className="space-y-2">
                  {result.diet.recommended.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
               <div>
                <h4 className="font-semibold text-lg text-red-700 mb-2">A Evitar</h4>
                <ul className="space-y-2">
                  {result.diet.avoid.map((item, index) => (
                    <li key={index} className="flex items-start">
                       <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-emerald-custom-700 border-b-2 border-emerald-custom-200 pb-2 mb-4 mt-6">
              Notas do Analista
            </h3>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-200">
              {result.notes}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors duration-300"
        >
          Analisar Outro
        </button>
        <button
          onClick={() => onSaveNote(result)}
          className="px-8 py-3 bg-emerald-custom-600 text-white font-bold rounded-lg shadow-lg hover:bg-emerald-custom-700 transition-colors duration-300 transform hover:scale-105"
        >
          Salvar Análise
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;

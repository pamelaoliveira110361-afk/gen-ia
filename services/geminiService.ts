
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    species: { 
      type: Type.STRING, 
      description: 'A espécie do animal (ex: Cão, Gato, Pássaro).' 
    },
    breed: { 
      type: Type.STRING, 
      description: 'A raça do animal (ex: Labrador Retriever, Siamês).' 
    },
    diet: {
      type: Type.OBJECT,
      properties: {
        recommended: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Lista de 5 a 7 alimentos altamente recomendados para a raça.'
        },
        avoid: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Lista de 5 a 7 alimentos que devem ser estritamente evitados.'
        }
      },
       required: ['recommended', 'avoid']
    },
    notes: { 
      type: Type.STRING, 
      description: 'Um parágrafo com notas adicionais e observações importantes sobre a dieta e cuidados gerais de saúde da raça.' 
    }
  },
  required: ['species', 'breed', 'diet', 'notes']
};

export const analyzeAnimalImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Image,
    },
  };

  const textPart = {
    text: `Analise a imagem deste animal. Identifique a espécie e a raça com a maior precisão possível. 
           Com base na raça identificada, forneça uma lista detalhada de alimentos recomendados e alimentos a serem evitados. 
           Adicione uma nota geral sobre os cuidados alimentares específicos para esta raça. 
           Responda em português do Brasil.`
  };
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
    }
  });

  const jsonText = response.text.trim();
  const result = JSON.parse(jsonText);
  return result as AnalysisResult;
};

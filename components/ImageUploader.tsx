
import React, { useRef } from 'react';
import { PawIcon } from './icons/PawIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
  isLoading: boolean;
  onAnalyze: () => void;
  onReset: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, previewUrl, isLoading, onAnalyze, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      {!previewUrl ? (
        <div
          className="w-full h-64 border-2 border-dashed border-slate-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-emerald-custom-500 hover:bg-emerald-custom-50 transition-colors duration-300"
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <PawIcon className="w-12 h-12 text-slate-400 mb-4" />
          <p className="text-slate-600 font-semibold">Arraste e solte uma imagem aqui</p>
          <p className="text-slate-500">ou clique para selecionar</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-md h-auto mb-6 rounded-lg overflow-hidden border-2 border-slate-200 shadow-md">
            <img src={previewUrl} alt="Pré-visualização do Animal" className="w-full h-auto object-cover" />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onReset}
              disabled={isLoading}
              className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors duration-300 disabled:opacity-50"
            >
              Trocar Imagem
            </button>
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="flex items-center justify-center px-8 py-3 bg-emerald-custom-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-emerald-custom-700 transition-colors duration-300 transform hover:scale-105 disabled:bg-emerald-custom-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="w-6 h-6 mr-3" />
                  Analisando...
                </>
              ) : (
                'Analisar Imagem'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

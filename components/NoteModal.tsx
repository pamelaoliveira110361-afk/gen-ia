import React, { useState, useEffect } from 'react';
import type { Note } from '../types';

interface NoteModalProps {
  note: Note | Partial<Note> | null;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'userId'> & { id?: string }) => void;
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ note, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...(note || {}), title, content });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-emerald-custom-800">
            {note && 'id' in note ? 'Editar Anotação' : 'Nova Anotação'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">Título</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-custom-500 focus:border-emerald-custom-500"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700">Conteúdo</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-custom-500 focus:border-emerald-custom-500 font-mono text-sm"
              />
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-custom-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-custom-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;

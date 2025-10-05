import React, { useState, useEffect, useCallback } from 'react';
import type { User, Note } from '../types';
import * as LocalStorageService from '../services/localStorageService';
import NoteModal from '../components/NoteModal';
import { NoteIcon } from '../components/icons/NoteIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { EditIcon } from '../components/icons/EditIcon';
import { TrashIcon } from '../components/icons/TrashIcon';

interface NotesPageProps {
  user: User;
  initialNoteData: Partial<Note> | null;
  onClearInitialData: () => void;
}

const NotesPage: React.FC<NotesPageProps> = ({ user, initialNoteData, onClearInitialData }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | Partial<Note> | null>(null);

  const fetchNotes = useCallback(() => {
    const userNotes = LocalStorageService.getUserNotes(user.id);
    setNotes(userNotes);
  }, [user.id]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
  useEffect(() => {
    if (initialNoteData) {
      setSelectedNote(initialNoteData);
      setIsModalOpen(true);
      onClearInitialData();
    }
  }, [initialNoteData, onClearInitialData]);

  const handleOpenModal = (note: Note | Partial<Note> | null = null) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleSaveNote = (noteToSave: Omit<Note, 'id' | 'createdAt' | 'userId'> & { id?: string }) => {
    LocalStorageService.saveNote({ ...noteToSave, userId: user.id });
    fetchNotes();
    handleCloseModal();
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta anotação?')) {
      LocalStorageService.deleteNote(noteId);
      fetchNotes();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <NoteIcon className="w-10 h-10 text-emerald-custom-600" />
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-emerald-custom-800 tracking-tight">Minhas Anotações</h1>
            <p className="text-lg text-slate-600">Seu diário pessoal de análises e observações.</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal({ title: '', content: '' })}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-custom-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-custom-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nova Nota
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
        {notes.length > 0 ? (
          <ul className="space-y-4">
            {notes.map(note => (
              <li key={note.id} className="p-4 border border-slate-200 rounded-lg flex justify-between items-start hover:bg-slate-50 transition-colors">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{note.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Criado em: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleOpenModal(note)} className="p-2 text-slate-500 hover:text-emerald-custom-600">
                    <EditIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDeleteNote(note.id)} className="p-2 text-slate-500 hover:text-red-600">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Você ainda não tem nenhuma anotação.</p>
            <p className="text-slate-500">Faça uma análise ou crie uma nova nota para começar.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <NoteModal
          note={selectedNote}
          onSave={handleSaveNote}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default NotesPage;

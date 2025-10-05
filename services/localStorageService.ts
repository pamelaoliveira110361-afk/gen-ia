import type { User, Note } from '../types';

const USERS_KEY = 'genetic_analyzer_users';
const NOTES_KEY = 'genetic_analyzer_notes';
const SESSION_KEY = 'genetic_analyzer_session';

// NOTE: This is a mock hashing function for demonstration purposes.
// In a real application, use a secure, one-way hashing algorithm like bcrypt on the backend.
const fakeHash = (password: string): string => `hashed_${btoa(password)}`;

const getUsers = (): (User & { passwordHash: string })[] => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

const getNotes = (): Note[] => {
  return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
};

export const registerUser = (email: string, password: string): User => {
  const users = getUsers();
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('E-mail já cadastrado.');
  }

  const newUser = {
    id: `user_${Date.now()}`,
    email,
    passwordHash: fakeHash(password),
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const { passwordHash, ...userToReturn } = newUser;
  return userToReturn;
};

export const loginUser = (email: string, password: string): User => {
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user || user.passwordHash !== fakeHash(password)) {
    throw new Error('Credenciais inválidas.');
  }

  const { passwordHash, ...userToReturn } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(userToReturn));
  return userToReturn;
};

export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const checkSession = (): User | null => {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
};


export const getUserNotes = (userId: string): Note[] => {
  const allNotes = getNotes();
  return allNotes.filter(note => note.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const saveNote = (note: Omit<Note, 'id' | 'createdAt'> & { id?: string }): Note => {
  const allNotes = getNotes();
  if (note.id) { // Update
    const index = allNotes.findIndex(n => n.id === note.id);
    if (index !== -1) {
      allNotes[index] = { ...allNotes[index], title: note.title, content: note.content };
      localStorage.setItem(NOTES_KEY, JSON.stringify(allNotes));
      return allNotes[index];
    }
    throw new Error('Nota não encontrada para atualização.');
  } else { // Create
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    allNotes.push(newNote);
    localStorage.setItem(NOTES_KEY, JSON.stringify(allNotes));
    return newNote;
  }
};

export const deleteNote = (noteId: string): void => {
  let allNotes = getNotes();
  allNotes = allNotes.filter(note => note.id !== noteId);
  localStorage.setItem(NOTES_KEY, JSON.stringify(allNotes));
};

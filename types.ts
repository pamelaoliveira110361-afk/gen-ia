export interface AnalysisResult {
  species: string;
  breed: string;
  diet: {
    recommended: string[];
    avoid: string[];
  };
  notes: string;
}

export interface User {
  id: string;
  email: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

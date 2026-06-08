import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Comment {
  id: string;
  workName: string;
  userId: string;
  userInitials: string;
  text: string;
  date: string;
  photos: string[]; // Base64 encoded photos
}

interface CommentContextType {
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'date'>) => void;
  getCommentsByWork: (workName: string) => Comment[];
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('sinan_comments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('sinan_comments', JSON.stringify(comments));
  }, [comments]);

  const addComment = (commentData: Omit<Comment, 'id' | 'date'>) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setComments(prev => [newComment, ...prev]);
  };

  const getCommentsByWork = (workName: string) => {
    return comments.filter(c => c.workName === workName);
  };

  return (
    <CommentContext.Provider value={{ comments, addComment, getCommentsByWork }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
}

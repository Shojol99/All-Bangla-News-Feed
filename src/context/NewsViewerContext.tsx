import React, { createContext, useContext, useState, ReactNode } from 'react';
import NewsViewer from '../components/NewsViewer';

interface NewsViewerContextType {
  openNews: (url: string | null, title?: string, content?: string) => void;
  closeNews: () => void;
}

const NewsViewerContext = createContext<NewsViewerContextType | undefined>(undefined);

export function NewsViewerProvider({ children }: { children: ReactNode }) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const openNews = (url: string | null, title: string = '', content?: string) => {
    setSelectedUrl(url);
    setSelectedTitle(title);
    setSelectedContent(content || null);
  };

  const closeNews = () => {
    setSelectedUrl(null);
    setSelectedTitle('');
    setSelectedContent(null);
  };

  return (
    <NewsViewerContext.Provider value={{ openNews, closeNews }}>
      {children}
      <NewsViewer 
        url={selectedUrl} 
        onClose={closeNews} 
        title={selectedTitle}
        content={selectedContent}
      />
    </NewsViewerContext.Provider>
  );
}

export function useNewsViewer() {
  const context = useContext(NewsViewerContext);
  if (context === undefined) {
    throw new Error('useNewsViewer must be used within a NewsViewerProvider');
  }
  return context;
}

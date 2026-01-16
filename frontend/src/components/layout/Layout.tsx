// src/components/layout/Layout.tsx
import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  fullHeight?: boolean; // For pages like PropertyList that need full screen
  hideFooter?: boolean;
}

export const Layout = ({ children, fullHeight = false, hideFooter = false }: LayoutProps) => {
  if (fullHeight) {
    // Full height layout for pages like PropertyList (Zillow-style)
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-gray-900">
        <Header />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    );
  }

  // Standard layout with footer
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

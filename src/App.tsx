import React from 'react';
import ThemeLayout from './components/ThemeLayout';
import BreakEvenCalculatorTool from './components/BreakEvenCalculatorTool';
import SeoArticle from './utils/SeoArticle';

const App: React.FC = () => {
  return (
    <ThemeLayout>
      <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-128px)]">
        <main className="container mx-auto px-4 py-8 md:py-12 z-10 relative text-center">
          <BreakEvenCalculatorTool />
          <div className="mt-16 md:mt-24">
            <SeoArticle />
          </div>
        </main>
      </div>
    </ThemeLayout>
  );
};

export default App;
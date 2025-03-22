
import React from 'react';
import SentimentAnalyzer from '../components/SentimentAnalyzer';
import BackgroundAnimation from '../components/BackgroundAnimation';

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-background to-background/80">
      <BackgroundAnimation />
      
      <div className="relative w-full max-w-xl animate-float">
        <SentimentAnalyzer />
        
        <div className="mt-8 text-center text-sm text-foreground/60">
          <p>Enter a news article URL to analyze its sentiment</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

import React, { useState } from 'react';
import { ArrowRight, AlertTriangle, Check, Loader2 } from 'lucide-react';

const SentimentAnalyzer: React.FC = () => {
  const [newsUrl, setNewsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [sentiment, setSentiment] = useState<{ value: string; type: 'positive' | 'neutral' | 'negative' } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsUrl(e.target.value);
  };

  // Helper function to ensure URL has proper scheme
  const ensureHttpsPrefix = (url: string): string => {
    if (!url) return url;
    
    // If the URL doesn't start with http:// or https://, add https://
    if (!url.match(/^https?:\/\//i)) {
      return `https://${url}`;
    }
    
    return url;
  };

  const analyzeSentiment = () => {
    // Clear previous alerts and responses
    setAlert(null);
    setSentiment(null);
    setIsLoading(true);

    if (!newsUrl) {
      setAlert({ message: 'Please enter a valid URL', type: 'error' });
      setIsLoading(false);
      return;
    }

    // Ensure the URL has the proper scheme before sending to backend
    const formattedUrl = ensureHttpsPrefix(newsUrl);
    console.log('Analyzing URL:', formattedUrl);

    // Fetch from the proxy endpoint configured in vite.config.ts
    fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ news_url: formattedUrl }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Response data:', data);
      if (data.error) {
        setAlert({ message: data.error, type: 'error' });
      } else {
        setSentiment({
          value: data.sentiment,
          type: data.sentiment.toLowerCase() as 'positive' | 'neutral' | 'negative'
        });
      }
    })
    .catch(error => {
      console.error('Error analyzing sentiment:', error);
      setAlert({ message: 'Failed to analyze sentiment: ' + error.message, type: 'error' });
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="glass-card relative px-8 py-10 rounded-2xl w-full max-w-md mx-auto transform transition-transform duration-500 animate-scale-in">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 opacity-50 pointer-events-none" />
      
      <h1 className="text-3xl font-bold mb-6 text-gradient">News Sentiment Analyzer</h1>
      
      <div className="space-y-5">
        <div className="relative group">
          <input
            type="text"
            value={newsUrl}
            onChange={handleInputChange}
            placeholder="Enter news article URL"
            className="glass-input w-full px-5 py-4 rounded-xl text-foreground placeholder:text-foreground/50 outline-none"
          />
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-accent group-focus-within:w-full transition-all duration-500" />
        </div>
        
        <button 
          onClick={analyzeSentiment}
          disabled={isLoading}
          className="glass-button group w-full py-4 px-6 rounded-xl font-medium flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span>Analyze Sentiment</span>
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
      
      {alert && (
        <div className={`mt-5 rounded-xl px-4 py-3 flex items-center space-x-2 animate-slide-up ${
          alert.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
        }`}>
          {alert.type === 'error' ? <AlertTriangle size={18} /> : <Check size={18} />}
          <span>{alert.message}</span>
        </div>
      )}
      
      {sentiment && (
        <div className={`mt-6 rounded-xl p-6 backdrop-blur-sm bg-white/10 border border-white/20 animate-slide-up ${
          sentiment.type === 'positive' ? 'text-green-500' :
          sentiment.type === 'neutral' ? 'text-amber-500' : 'text-red-500'
        }`}>
          <div className="font-medium">Sentiment:</div>
          <div className="text-xl font-semibold">{sentiment.value}</div>
        </div>
      )}
      
      <div className="absolute -bottom-4 -right-4 h-32 w-32 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-full blur-2xl opacity-70" />
      <div className="absolute -top-4 -left-4 h-32 w-32 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full blur-2xl opacity-70" />
    </div>
  );
};

export default SentimentAnalyzer;

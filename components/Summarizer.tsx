"use client";
import React, { useState, useEffect } from 'react';

function SummarizerComponent() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [summarizer, setSummarizer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ loaded: 0, total: 0 });

  // Initialize the summarizer if available
  useEffect(() => {
    const initializeSummarizer = async () => {
      if (typeof ai !== 'undefined' && ai.summarizer) {
        const canSummarize = await ai.summarizer.capabilities();
        if (canSummarize && canSummarize.available !== 'no') {
          if (canSummarize.available === 'readily') {
            const newSummarizer = await ai.summarizer.create();
            setSummarizer(newSummarizer);
          } else {
            const newSummarizer = await ai.summarizer.create();
            newSummarizer.addEventListener('downloadprogress', (e) => {
              setDownloadProgress({ loaded: e.loaded, total: e.total });
              setIsDownloading(true);
            });
            await newSummarizer.ready;
            setSummarizer(newSummarizer);
            setIsDownloading(false);
          }
          setIsAvailable(true);
        } else {
          console.warn('Summarizer is not available on this device or browser.');
        }
      }
    };
    initializeSummarizer();

    // Cleanup the summarizer on component unmount
    return () => {
      if (summarizer) summarizer.destroy();
    };
  }, []);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSummarize = async () => {
    if (summarizer && inputText.trim()) {
      setLoading(true);
      const result = await summarizer.summarize(inputText);
      setSummary(result);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>AI Summarizer Component</h2>
      {isAvailable ? (
        <>
          {isDownloading ? (
            <p>Downloading model... {downloadProgress.loaded} / {downloadProgress.total} bytes</p>
          ) : (
            <>
              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter text to summarize..."
                rows="6"
                cols="50"
                style={{ marginBottom: '10px', padding: '10px', color: '#333' }}
              />
              <br />
              <button onClick={handleSummarize} disabled={loading || isDownloading}>
                {loading ? 'Summarizing...' : 'Summarize Text'}
              </button>
              {summary && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                  <h3>Summary:</h3>
                  <p>{summary}</p>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p>Summarizer is not available on this device or browser.</p>
      )}
    </div>
  );
}

export default SummarizerComponent;

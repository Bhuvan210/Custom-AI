"use client";
import React, { useState, useEffect } from 'react';

const STOP_SEQUENCES = ['world'];

function LanguageModelComponent() {
  const [inputText, setInputText] = useState('');
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [session, setSession] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  // Initialize the session if the model is available
  useEffect(() => {
    const initializeSession = async () => {
      if (typeof ai !== 'undefined' && ai.languageModel) {
        const { available } = await ai.languageModel.capabilities();
        if (available !== 'no') {
          const newSession = await ai.languageModel.create({
            systemPrompt: 'You are a Salman Khan.',
            //shit works like a charm
          });
          setSession(newSession);
          setIsAvailable(true);
        } else {
          console.warn('AI model is not available on this device or browser.');
        }
      }
    };
    initializeSession();
  }, []);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleStreamPrompt = async () => {
    if (session) {
      const abortController = new AbortController();
      const signal = abortController.signal;
      setIsStreaming(true);
      setStreamingResponse('');

      const stream = await session.promptStreaming(inputText, { signal });

      let previousLength = 0;
      try {
        for await (const chunk of stream) {
          const newContent = chunk.slice(previousLength);
          setStreamingResponse((prev) => prev + newContent);
          previousLength = chunk.length;

          for (const stopSequence of STOP_SEQUENCES) {
            if (newContent.toLowerCase().includes(stopSequence.toLowerCase())) {
              console.log(`Stop sequence "${stopSequence}" found. Aborting.`);
              abortController.abort();
              setIsStreaming(false);
              return;
            }
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Streaming aborted.');
        }
      }
      setIsStreaming(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>AI Language Model Component</h2>
      {isAvailable ? (
        <>
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter a prompt..."
            rows="4"
            cols="50"
            style={{ marginBottom: '10px', padding: '10px', color: '#333' }}
          />
          <br />
          <button onClick={handleStreamPrompt} disabled={isStreaming}>
            {isStreaming ? 'Streaming...' : 'Generate Response'}
          </button>

          {/* Display streaming response */}
          {streamingResponse && (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
              <h3>Generate Response:</h3>
              <p>{streamingResponse}</p>
            </div>
          )}
        </>
      ) : (
        <p>AI language model is not available on this device or browser.</p>
      )}
    </div>
  );
}

export default LanguageModelComponent;

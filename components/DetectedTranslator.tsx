"use client";
import React, { useState, useEffect } from 'react';

function DetectedTranslation() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');

  useEffect(() => {
    // This ensures that the language detection API is initialized when the component mounts
    const initializeDetector = async () => {
      try {
        const canDetect = await window.translation.canDetect();
        if (canDetect === 'no') {
          setError('Language detection is not available.');
        } else {
          setError(''); // Reset error if the language detection is available
        }
      } catch (err) {
        console.error('Error initializing language detection:', err);
        setError('Error initializing language detection.');
      }
    };
    initializeDetector();
  }, []);

  const handleTranslate = async () => {
    setLoading(true);
    setError('');
    setTranslatedText('');

    if (!inputText.trim()) {
      setError('Please enter some text.');
      setLoading(false);
      return;
    }

    // Step 1: Detect the language of the input text
    let detectedLang = 'en';  // Default to English
    try {
      const detector = await window.translation.createDetector();
      const results = await detector.detect(inputText);
      const topResult = results[0];  // Use the top detected language
      detectedLang = topResult.detectedLanguage;
      setDetectedLanguage(detectedLang);  // Show detected language
    } catch (err) {
      console.error('Language detection failed:', err);
      setError('Failed to detect language.');
      setLoading(false);
      return;
    }

    // Step 2: Translate to English if necessary
    const translationOptions = {
      sourceLanguage: detectedLang,  // Use the detected language
      targetLanguage: 'en',  // Always translate to English
    };

    try {
      const availability = await window.translation.canTranslate(translationOptions);
      if (availability === 'no') {
        setError('Translation not available for these languages.');
        setLoading(false);
        return;
      }

      const translator = await window.translation.createTranslator(translationOptions);
      const result = await translator.translate(inputText);
      setTranslatedText(result);
    } catch (err) {
      console.error('Translation Error:', err);
      setError('An error occurred during translation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Text Translator</h2>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to translate"
        rows="4"
        cols="50"
        style={{ marginBottom: '10px', padding: '10px', color: '#333' }}
      />
      <br />
      <button onClick={handleTranslate} disabled={loading}>
        {loading ? 'Translating...' : 'Translate'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {detectedLanguage && !error && (
        <p><strong>Detected Language:</strong> {detectedLanguage}</p>
      )}
      {translatedText && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>Translated Text:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
}

export default DetectedTranslation;

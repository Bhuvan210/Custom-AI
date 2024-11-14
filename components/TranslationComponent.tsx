"use client";
import React, { useState } from 'react';

function TranslationComponent() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    setLoading(true);
    setError('');
    setTranslatedText('');

    const translationOptions = {
      sourceLanguage: 'en', // assuming the input is in English
      targetLanguage: 'es', // translate to Spanish
    };

    try {
      const availability = await window.translation.canTranslate(translationOptions);

      if (availability === 'no') {
        setError("Translation not available for these languages.");
        setLoading(false);
        return;
      }

      const translator = await window.translation.createTranslator(translationOptions);
      const result = await translator.translate(inputText);
      setTranslatedText(result);
    } catch (err) {
      console.error('Translation Error:', err);
      setError("An error occurred during translation.");
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
      {translatedText && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>Translated Text:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
}

export default TranslationComponent;

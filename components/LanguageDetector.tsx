"use client";
import React, { useState, useEffect } from "react";

function LanguageDetector() {
  const [inputText, setInputText] = useState("");  // To store input text
  const [detectedLanguage, setDetectedLanguage] = useState("");  // To store the detected language
  const [confidence, setConfidence] = useState("");  // To store the confidence of the detected language
  const [isDetecting, setIsDetecting] = useState(false);  // To handle detecting state
  const [error, setError] = useState("");  // To store any errors
  const [detector, setDetector] = useState(null); // To store the detector instance

  useEffect(() => {
    // Initialize the language detector on mount
    const initializeDetector = async () => {
      try {
        const canDetect = await translation.canDetect();
        if (canDetect !== "no") {
          let newDetector;
          if (canDetect === "readily") {
            // The language detector can be immediately used.
            newDetector = await translation.createDetector();
          } else {
            // The language detector can be used after the model download.
            newDetector = await translation.createDetector();
            newDetector.addEventListener("downloadprogress", (e) => {
              console.log(`Model download progress: ${e.loaded} / ${e.total}`);
            });
            await newDetector.ready;
          }

          // Store the detector instance
          setDetector(newDetector);
        } else {
          setError("Language detection is not available.");
        }
      } catch (err) {
        setError("Error initializing language detection.");
        console.error(err);
      }
    };

    initializeDetector();
  }, []);

  const handleInputChange = (e) => {
    setInputText(e.target.value);  // Update input text
  };

  const handleDetectLanguage = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text.");
      return;
    }

    if (!detector) {
      setError("Language detector is not initialized.");
      return;
    }

    setIsDetecting(true);  // Start detecting
    setError("");  // Reset error state

    try {
      const results = await detector.detect(inputText);
      const topResult = results[0];  // Use the top detected language
      setDetectedLanguage(topResult.detectedLanguage);
      setConfidence(topResult.confidence.toFixed(2));  // Format confidence to two decimal places
    } catch (err) {
      setError("Error detecting language.");
      console.error(err);
    }
    setIsDetecting(false);  // End detecting
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Language Detector</h2>
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text to detect language"
        rows="4"
        cols="50"
        style={{ marginBottom: "10px", padding: "10px", color: "#333" }}
      />
      <br />
      <button onClick={handleDetectLanguage} disabled={isDetecting}>
        {isDetecting ? "Detecting..." : "Detect Language"}
      </button>

      {/* Display any errors */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display detected language and confidence */}
      {detectedLanguage && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>Detected Language:</h3>
          <p>{detectedLanguage}</p>
          <h3>Confidence:</h3>
          <p>{confidence}</p>
        </div>
      )}
    </div>
  );
}

export default LanguageDetector;

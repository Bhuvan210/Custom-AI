"use client";
import React, { useState, useEffect } from "react";

function WriterComponent() {
  const [inputText, setInputText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [controller, setController] = useState(null);

  useEffect(() => {
    // Initialize the AbortController when the component mounts
    const newController = new AbortController();
    setController(newController);
    return () => {
      // Cleanup abort controller when component unmounts
      newController.abort();
    };
  }, []);

  const handleGenerateContent = async () => {
    setLoading(true);
    setError("");
    setGeneratedText("");

    try {
      const writer = await ai.writer.create({
        signal: controller?.signal, // Pass signal to support aborting
      });

      const stream = await writer.writeStreaming(inputText, {
        context: "This content is for a blog post on AI trends.",
      });

      let generated = "";
      for await (const chunk of stream) {
        generated += chunk;
        setGeneratedText(generated); // Append chunks progressively
      }
    } catch (err) {
      console.error("Writer Error:", err);
      setError("An error occurred while generating content.");
    } finally {
      setLoading(false);
    }
  };

  const handleAbort = () => {
    controller?.abort(); // Abort the ongoing writing operation
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Content Writer</h2>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to generate content from"
        rows="4"
        cols="50"
        style={{ marginBottom: "10px", padding: "10px", color: "#333" }}
      />
      <br />
      <button onClick={handleGenerateContent} disabled={loading}>
        {loading ? "Generating..." : "Generate Content"}
      </button>
      <button onClick={handleAbort} disabled={!loading}>
        Abort
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {generatedText && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>Generated Content:</h3>
          <p>{generatedText}</p>
        </div>
      )}
    </div>
  );
}

export default WriterComponent;

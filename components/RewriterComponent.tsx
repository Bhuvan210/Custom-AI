"use client";
import React, { useState, useEffect } from "react";

function RewriterComponent() {
  const [inputText, setInputText] = useState("");
  const [rewrittenText, setRewrittenText] = useState("");
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

  const handleRewriteContent = async () => {
    setLoading(true);
    setError("");
    setRewrittenText("");

    try {
      const rewriter = await ai.rewriter.create({
        signal: controller?.signal, // Pass signal to support aborting
      });

      const stream = await rewriter.rewriteStreaming(inputText, {
        context: "Rewrite this content in a more formal tone.",
      });

      let rewritten = "";
      for await (const chunk of stream) {
        rewritten += chunk;
        setRewrittenText(rewritten); // Append chunks progressively
      }
    } catch (err) {
      console.error("Rewriter Error:", err);
      setError("An error occurred while rewriting content.");
    } finally {
      setLoading(false);
    }
  };

  const handleAbort = () => {
    controller?.abort(); // Abort the ongoing rewriting operation
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Content Rewriter</h2>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to rewrite"
        rows="4"
        cols="50"
        style={{ marginBottom: "10px", padding: "10px", color: "#333" }}
      />
      <br />
      <button onClick={handleRewriteContent} disabled={loading}>
        {loading ? "Rewriting..." : "Rewrite Content"}
      </button>
      <button onClick={handleAbort} disabled={!loading}>
        Abort
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {rewrittenText && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>Rewritten Content:</h3>
          <p>{rewrittenText}</p>
        </div>
      )}
    </div>
  );
}

export default RewriterComponent;

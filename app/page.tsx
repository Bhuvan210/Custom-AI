import { Component } from "react";
import TranslationComponent from "@/components/TranslationComponent";
import LanguageModel from "@/components/LanguageModel";
import SummarizerComponent from "@/components/Summarizer";
import LanguageDetector from "@/components/LanguageDetector";
import DetectedTranslation from "@/components/DetectedTranslator";
import WriterComponent from "@/components/WriterComponent";
import RewriterComponent from "@/components/RewriterComponent";
import AIComponent from "@/components/AiComponent";
export default function Home() {
  return (
    <>
    <TranslationComponent />
    <LanguageModel />
     <SummarizerComponent />
      <LanguageDetector />
      <DetectedTranslation />
      <WriterComponent />
      <RewriterComponent />
      <AIComponent />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import sentences from "../../data/sentences";
import SentenceRecorder from "../../components/SentenceRecorder";

// Define the Sentence type
interface Sentence {
  id: number;
  text: string;
}

export default function RecordPage() {
  const [selectedSentences, setSelectedSentences] = useState<Sentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user details from sessionStorage
    const details = sessionStorage.getItem("userDetails");
    if (details) {
      setUserDetails(JSON.parse(details));
    }
    setLoading(false);

    // Randomly select 5 sentences
    const selected = selectRandomSentences(sentences, 5);
    setSelectedSentences(selected);
  }, []);

  const handleNext = () => {
    if (currentIndex < selectedSentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!userDetails) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500">User details are missing. Please start again.</p>
        <a
          href="/questionnaire"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 mt-4 inline-block"
        >
          Back to Questionnaire
        </a>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      {completed ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
          <p className="mb-6">Your recordings have been successfully submitted.</p>
          <a
            href="/"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600"
          >
            Home
          </a>
        </div>
      ) : (
        <SentenceRecorder
          sentence={selectedSentences[currentIndex]}
          index={currentIndex}
          userDetails={userDetails}
          onNext={handleNext}
        />
      )}
    </main>
  );
}

// Utility function to randomly select N unique sentences
const selectRandomSentences = (array: Sentence[], n: number): Sentence[] => {
  const shuffled = array
    .map((item) => ({ ...item, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ sortKey, ...item }) => item);

  return shuffled.slice(0, n);
};

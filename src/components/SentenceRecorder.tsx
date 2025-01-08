"use client";

import { useEffect, useState } from "react";

interface Sentence {
  id: number;
  text: string;
}

interface SentenceRecorderProps {
  sentence: Sentence; // Updated type to include `id` and `text`
  index: number;
  userDetails: {
    speakerName: string;
    language: string;
    gender: string;
    district: string;
    ageGroup: string;
  };
  onNext: () => void;
}

export default function SentenceRecorder({
  sentence,
  index,
  userDetails,
  onNext,
}: SentenceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Reset state when a new sentence is loaded
  useEffect(() => {
    setAudioUrl(null);
    setAudioBlob(null);
    setIsRecording(false);
    setRecorder(null);
  }, [sentence]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob));
    };

    setRecorder(mediaRecorder);
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
    }
  };

  const saveRecording = async () => {
    if (audioBlob) {
      const directory = `/uploads/${userDetails.speakerName}`;
      const filename = `${sentence.id}_${userDetails.gender}_${userDetails.district}_${userDetails.language}_${userDetails.ageGroup}.wav`;

      const formData = new FormData();
      formData.append("audio", audioBlob, filename);
      formData.append("directory", directory);

      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
    }
  };

  const handleNext = async () => {
    await saveRecording();
    onNext();
  };

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-xl text-blue-500 font-bold">Sentence {index + 1}: {sentence.text}</h2>
      <div>
        {!isRecording && !audioUrl ? (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-600"
          >
            Start Recording
          </button>
        ) : isRecording ? (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-red-600"
          >
            Stop Recording
          </button>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <audio src={audioUrl} controls className="w-full"></audio>
            <div className="flex space-x-4">
              <button
                onClick={startRecording}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-yellow-600"
              >
                Retake
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600"
                disabled={!audioBlob} // Disable Next button until recording is available
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

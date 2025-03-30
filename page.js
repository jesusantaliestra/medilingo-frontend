'use client';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function Home() {
  const [phrase, setPhrase] = useState('');
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackAudioUrl, setFeedbackAudioUrl] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    fetch('https://medilingo-api.onrender.com/random-phrase')
      .then(res => res.json())
      .then(data => setPhrase(data.phrase));
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], 'recording.wav');

      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('upload_preset', 'ml_default');

      const cloudinaryRes = await axios.post('https://api.cloudinary.com/v1_1/dn8vihkeh/video/upload', formData);
      const audioUrl = cloudinaryRes.data.secure_url;
      setAudioUrl(audioUrl);

      const analysis = await axios.post('https://medilingo-api.onrender.com/analyze', new URLSearchParams({
        audio_url: audioUrl,
        correct_phrase: phrase
      }));
      setTranscript(analysis.data.transcript);
      setFeedback(analysis.data.feedback);
      setFeedbackAudioUrl(`https://medilingo-api.onrender.com/${analysis.data.audio_file}`);
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <main className="flex flex-col items-center justify-center p-10 gap-4">
      <h1 className="text-2xl font-bold">🎤 MediLingo - English Practice</h1>
      <p className="text-lg">🔁 Say this phrase:</p>
      <div className="bg-gray-100 p-4 rounded text-xl font-semibold">{phrase}</div>

      {!recording && <button onClick={startRecording} className="bg-blue-500 text-white px-4 py-2 rounded">Start Recording</button>}
      {recording && <button onClick={stopRecording} className="bg-red-500 text-white px-4 py-2 rounded">Stop Recording</button>}

      {transcript && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">📝 Transcript:</h2>
          <p>{transcript}</p>
          <h2 className="text-lg font-bold mt-4">💬 Feedback:</h2>
          <p>{feedback}</p>
          <audio controls src={feedbackAudioUrl} className="mt-4" />
        </div>
      )}
    </main>
  );
}

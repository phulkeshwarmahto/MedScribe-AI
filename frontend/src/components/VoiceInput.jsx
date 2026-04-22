import { useState } from "react";

export default function VoiceInput({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  );

  const startListening = () => {
    if (!isSupported) {
      alert("Voice input is not supported in your browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    try {
      recognition = new SpeechRecognition();
    } catch (err) {
      console.error('SpeechRecognition construction failed:', err);
      alert('Voice input is not available in this browser.');
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (event.results[event.results.length - 1].isFinal) {
        onTranscript(transcript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={startListening}
        disabled={!isSupported}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontWeight: '500',
          backgroundColor: isListening ? '#dc2626' : '#0A2463',
          color: 'white',
          border: 'none',
          cursor: isSupported ? 'pointer' : 'not-allowed',
          opacity: isSupported ? 1 : 0.5,
          animation: isListening ? 'pulse 2s infinite' : 'none',
        }}
        title={
          !isSupported ? "Voice input is not supported in your browser" : ""
        }
      >
        <span style={{ fontSize: '1.125rem' }}>🎤</span>
        {isListening ? "Listening..." : "Start Recording"}
      </button>
      {!isSupported && (
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
          Voice input not supported in your browser
        </p>
      )}
    </div>
  );
}

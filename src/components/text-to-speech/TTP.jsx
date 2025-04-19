import React, { useEffect, useState } from "react";

function TextToSpeech({ text }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://code.responsivevoice.org/responsivevoice.js?key=aMhBnPYG";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (window.responsiveVoice) {
        window.responsiveVoice.cancel();
      }
      document.body.removeChild(script);
    };
  }, []);

  const speak = () => {
    if (window.responsiveVoice && text) {
      window.responsiveVoice.speak(text, "Vietnamese Female", {
        rate: 1,
        pitch: 1,
      });
    }
  };

  const stop = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
    }
  };

  return (
    <div>
      <button onClick={speak} disabled={!isLoaded}>
        Đọc văn bản
      </button>
      <button onClick={stop} disabled={!isLoaded}>
        Dừng đọc
      </button>
    </div>
  );
}

export default TextToSpeech;

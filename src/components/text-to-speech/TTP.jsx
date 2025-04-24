import React from "react";
import axios from "axios";

const TextToSpeech = ({ text }) => {
  const apiKey = "Lanvhg8WHdavBTk1VtyYGysUi4NHnpxO";
  const url = "https://api.fpt.ai/hmi/tts/v5";

  const callFptTTS = async () => {
    try {
      const response = await axios.post(url, text, {
        headers: {
          "api-key": apiKey,
          speed: "",
          voice: "banmai",
          "Content-Type": "text/plain",
        },
      });

      const audioUrl = response.data.async;
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error("Lỗi:", err.message || err);
    }
  };

  return (
    <div>
      <button onClick={callFptTTS}>🔊 Đọc văn bản bằng FPT.AI</button>
    </div>
  );
};

export default TextToSpeech;

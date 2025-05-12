import React, { useState } from "react";
import axios from "axios";
import { Button } from "antd";

const TextToSpeech = ({ text }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const apiKey = "Lanvhg8WHdavBTk1VtyYGysUi4NHnpxO";
  const url = "https://api.fpt.ai/hmi/tts/v5";

  const callFptTTS = async () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(url, text, {
        headers: {
          "api-key": apiKey,
          speed: "",
          voice: "banmai",
          "Content-Type": "text/plain",
        },
      });

      const newAudioUrl = response.data.async;
      setAudioUrl(newAudioUrl);

      const audio = new Audio(newAudioUrl);
      audio.play();
    } catch (err) {
      console.error("Lỗi:", err.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      className="button"
      onClick={callFptTTS}
      loading={isLoading}
      disabled={isLoading}
    >
      {isLoading
        ? "Đang tải audio..."
        : audioUrl
        ? "Đọc với FPT AI"
        : "Tạo audio"}
    </Button>
  );
};

export default TextToSpeech;

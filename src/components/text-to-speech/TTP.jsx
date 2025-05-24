import React, { useState } from "react";
import axios from "axios";
import { Button, message } from "antd";

const TextToSpeech = ({ text }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const apiKey = process.env.REACT_APP_TTS_API_KEY;
  const url = "https://api.fpt.ai/hmi/tts/v5";

  const playAudio = async (audioSrc) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioSrc);

      audio.onloadeddata = () => {
        audio
          .play()
          .then(() => resolve())
          .catch((err) => reject(err));
      };

      audio.onerror = () => {
        reject(new Error("Không thể tải audio"));
      };

      setTimeout(() => {
        reject(new Error("Timeout khi tải audio"));
      }, 10000);
    });
  };

  const callFptTTS = async () => {
    if (audioUrl) {
      try {
        await playAudio(audioUrl);
      } catch (err) {
        console.error("Lỗi khi phát audio:", err);
        message.error("Không thể phát audio. Vui lòng thử lại.");
      }
      return;
    }

    if (!text || text.trim() === "") {
      message.warning("Không có văn bản để chuyển đổi thành giọng nói");
      return;
    }

    if (!apiKey) {
      message.error("Thiếu API key. Vui lòng kiểm tra cấu hình.");
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
        timeout: 15000,
      });

      if (!response.data || !response.data.async) {
        throw new Error("API không trả về URL audio hợp lệ");
      }

      const newAudioUrl = response.data.async;
      setAudioUrl(newAudioUrl);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await playAudio(newAudioUrl);
    } catch (err) {
      console.error("Lỗi:", err);

      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        message.error("Kết nối bị timeout. Vui lòng thử lại.");
      } else if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          message.error("API key không hợp lệ");
        } else if (status === 429) {
          message.error("Đã vượt quá giới hạn request. Vui lòng thử lại sau.");
        } else {
          message.error(`Lỗi server: ${status}`);
        }
      } else if (err.message.includes("Không thể tải audio")) {
        message.error("Không thể tải audio. Vui lòng thử lại.");
      } else {
        message.error("Có lỗi xảy ra khi tạo audio. Vui lòng thử lại.");
      }
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
      disabled={isLoading || !text}
    >
      {isLoading
        ? "Đang tải audio..."
        : audioUrl
        ? "Phát lại audio"
        : "Tạo audio"}
    </Button>
  );
};

export default TextToSpeech;

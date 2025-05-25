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
      let hasResolved = false;

      const cleanup = () => {
        audio.oncanplaythrough = null;
        audio.onerror = null;
        audio.onended = null;
      };

      const handleSuccess = () => {
        if (hasResolved) return;

        audio
          .play()
          .then(() => {
            hasResolved = true;
            cleanup();
            resolve();
          })
          .catch((err) => {
            if (!hasResolved) {
              hasResolved = true;
              cleanup();
              console.error("Lỗi khi phát audio:", err);
              reject(new Error("Không thể phát audio"));
            }
          });
      };

      const handleError = () => {
        if (!hasResolved) {
          hasResolved = true;
          cleanup();
          reject(new Error("Không thể tải audio"));
        }
      };

      audio.oncanplaythrough = handleSuccess;
      audio.onerror = handleError;

      setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          cleanup();
          reject(new Error("Timeout khi tải audio"));
        }
      }, 10000);
    });
  };

  const callFptTTS = async () => {
    if (audioUrl) {
      setIsLoading(true);
      try {
        await playAudio(audioUrl);
        message.success("Phát audio thành công!");
      } catch (err) {
        console.error("Lỗi khi phát audio:", err);
        message.error("Không thể phát audio. Vui lòng tạo lại audio.");
        setAudioUrl(null);
      } finally {
        setIsLoading(false);
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

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setAudioUrl(newAudioUrl);

      try {
        await playAudio(newAudioUrl);
        message.success("Tạo và phát audio thành công!");
      } catch (playError) {
        console.error("Không thể phát audio ngay lập tức:", playError);
        message.info("Audio đã được tạo. Nhấn 'Phát lại audio' để nghe.");
      }
    } catch (err) {
      console.error("Lỗi:", err);

      setAudioUrl(null);

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
        ? audioUrl
          ? "Đang phát audio..."
          : "Đang tạo audio..."
        : audioUrl
        ? "Phát lại audio"
        : "Tạo audio"}
    </Button>
  );
};

export default TextToSpeech;

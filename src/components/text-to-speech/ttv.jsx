import { useState } from "react";
import { Button } from "antd";

export default function VietnameseTextReader({ text }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const speak = () => {
    setErrorMessage("");

    if (!("speechSynthesis" in window)) {
      setErrorMessage("Trình duyệt của bạn không hỗ trợ Text-to-Speech!");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "vi-VN";

    setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      setErrorMessage("Có lỗi xảy ra khi đọc văn bản!");
      console.error("SpeechSynthesis error:", event);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <div className="flex justify-center">
        {!isSpeaking ? (
          <Button
            onClick={speak}
            className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full flex items-center"
          >
            Đọc với web speech AI
          </Button>
        ) : (
          <Button
            onClick={stopSpeaking}
            className="button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full flex items-center"
          >
            Dừng
          </Button>
        )}
      </div>
    </div>
  );
}

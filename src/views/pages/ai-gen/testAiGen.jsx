import React, { useState } from "react";
import aiApi from "api/aiApi";

const AIGen = () => {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");

  const handleAsk = async () => {
    try {
      const res = await aiApi.getResBasic(question);
      setReply(res.data.reply);
    } catch (err) {
      console.error(err);
      setReply("Lỗi khi gọi AI");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Ask AI</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />
      <button onClick={handleAsk} style={{ marginTop: 10 }}>
        Gửi câu hỏi
      </button>
      {reply && (
        <div style={{ marginTop: 20 }}>
          <strong>🤖 Trả lời:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
};

export default AIGen;

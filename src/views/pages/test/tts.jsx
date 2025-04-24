import TextToSpeech from "components/text-to-speech/TTP";

const VoiceText = () => {
  const sampleText = "Xin chào! Đây là một ví dụ đọc văn bản tiếng Việt.";
  return (
    <div style={{ padding: 20 }}>
      <h1>Trình đọc tiếng Việt</h1>
      <TextToSpeech text={sampleText} />
    </div>
  );
};

export default VoiceText;

import TextToSpeech from "components/text-to-speech/TTP";

const VoiceText = () => {
  const sampleText = `Xin chào! Đây là một ví dụ đọc văn bản tiếng Việt. 
FPT.AI cung cấp dịch vụ chuyển văn bản thành giọng nói với nhiều lựa chọn về giọng đọc. 
Bạn có thể sử dụng tính năng này để tạo trợ lý ảo, ứng dụng học ngoại ngữ, hoặc hỗ trợ người khiếm thị. 
Hệ thống hỗ trợ nhiều giọng nói tự nhiên, tốc độ linh hoạt, và dễ dàng tích hợp vào các ứng dụng web hoặc mobile. 
Chúc bạn có một trải nghiệm thú vị khi sử dụng dịch vụ chuyển văn bản thành giọng nói này!`;
  return (
    <div style={{ padding: 20 }}>
      <h1>Trình đọc tiếng Việt</h1>
      <TextToSpeech text={sampleText} />
    </div>
  );
};

export default VoiceText;

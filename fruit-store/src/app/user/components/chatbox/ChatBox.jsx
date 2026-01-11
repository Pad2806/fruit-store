import { useState, useRef, useEffect } from "react";
import "./ChatBox.css";
 
const API_URL = "http://localhost:8000/api/chatbot";
 
function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi có thể giúp gì cho bạn?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
 
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
 
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: inputValue,
        sender: "user",
      },
    ]);
 
    const messageToSend = inputValue;
    setInputValue("");
 
    try {
      const res = await fetch("http://localhost:8000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer 16|SZHk522wv9U8AcFWiepeZptCc7Y2ILf20t5SLyIX",
        },
        credentials: "include",
        body: JSON.stringify({
          message: messageToSend,
        }),
      });
 
      const data = await res.json();
 
      if (data.intro) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: data.intro,
            sender: "bot",
          },
        ]);
      }
 
      let text = "";
      if (data.products && data.products.length > 0) {
        data.products.forEach((p) => {
          text += `${p.name} – ${formatPrice(p.price?.toLocaleString())}/${
            p.unit
          }\n`;
        });
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 10,
            text: text.trim(),
            sender: "bot",
          },
        ]);
      }
 
      if (data.cta) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 99,
            text: data.cta,
            sender: "bot",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 999,
          text: "❌ Lỗi kết nối máy chủ, vui lòng thử lại.",
          sender: "bot",
        },
      ]);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
 
  const formatPrice = (price) => {
    if (!price) return "0";
    return new Intl.NumberFormat("vi-VN").format(price);
  };
  return (
    <>
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "💬"}
      </button>
 
      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">
            <h3>Hỗ trợ AI</h3>
          </div>
 
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
 
            {loading && (
              <div className="message bot">
                <div className="message-bubble">Đang trả lời...</div>
              </div>
            )}
 
            <div ref={messagesEndRef} />
          </div>
 
          <form className="chat-input" onSubmit={handleSend}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
}
 
export default ChatBox;
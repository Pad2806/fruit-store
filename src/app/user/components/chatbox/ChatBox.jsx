import { useState, useRef, useEffect } from "react";
import "./ChatBox.css";

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: crypto.randomUUID(), text: "Xin chào! Tôi có thể giúp gì cho bạn?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: userText, sender: "user" },
    ]);

    setInputValue("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer 19|CWhxy9RCDu255HBfARE6YNQTnjfdL89pWULng90G",
        },
        credentials: "include",
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      const botText = data.intro ?? data.message ?? "";
      if (botText) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), text: botText, sender: "bot" },
        ]);
      }

      if (Array.isArray(data.products) && data.products.length > 0) {
        const productText = data.products
          .map((p) => `+ ${p.name} – ${p.price}`)
          .join("\n");

        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), text: productText, sender: "bot" },
        ]);
      }

      if (data.cta) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), text: data.cta, sender: "bot" },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: " Lỗi kết nối máy chủ, vui lòng thử lại.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
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

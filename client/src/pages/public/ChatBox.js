import React, { useState, useRef, useEffect } from "react";
import { FaRegPaperPlane, FaComments } from "react-icons/fa";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (input.trim() === "") return;
    setMessages([...messages, { from: "user", text: input }]);
    const currentInput = input.trim();
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/openai/search_products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: currentInput }),
      });
      const data = await res.json();
      // Giả sử API trả về { message, products }
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.message },
        { from: "bot", text: data.products },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, something went wrong!" },
      ]);
    }
  };

  // Tự động scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 9999,
        width: isOpen ? 370 : 64,
        height: isOpen ? 520 : 64,
        transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        borderRadius: 24,
        overflow: "hidden",
        background: isOpen ? "#fff" : "transparent",
      }}
    >
      {isOpen ? (
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-5 py-3 flex justify-between items-center shadow">
            <span className="font-semibold text-lg tracking-wide flex items-center gap-2">
              <FaComments className="text-xl" /> Ecommerce
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-bold hover:bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center transition"
              title="Close"
            >
              ×
            </button>
          </div>
          <div
            className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50"
            style={{ minHeight: 320, maxHeight: 370 }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`px-4 py-2 rounded-2xl shadow-sm max-w-[80%] text-sm ${
                    msg.from === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\n/g, "<br/>"),
                  }}
                  style={{ wordBreak: "break-word" }}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center border-t px-3 py-3 bg-white">
            <input
              className="flex-1 border-none outline-none px-3 py-2 text-sm rounded-2xl bg-gray-100 focus:bg-white transition"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              autoFocus={isOpen}
            />
            <button
              className="ml-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition flex items-center justify-center"
              onClick={handleSend}
              title="Send"
            >
              <FaRegPaperPlane className="text-lg" />
            </button>
          </div>
        </div>
      ) : (
        <button
          className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:scale-105 transition"
          onClick={() => setIsOpen(true)}
          title="Open chat"
        >
          <FaComments className="text-white text-3xl" />
        </button>
      )}
    </div>
  );
};

export default ChatBox;

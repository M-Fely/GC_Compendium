import { useState } from "react";
import "./Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();

      const aiMessage = { role: "ai", text: data.answer };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error: ", error);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Someting went wrong." },
      ]);
    }

    setInput("");
  };

  return (
    <div style={{ padding: "20px" }}>
      {messages.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h1>Welcome to GC Compendium</h1>
          <p>Have question? Ask away and get verified information instantly</p>
        </div>
      ) : (
        <div>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                margin: "10px 0",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "10px",
                  background: msg.role === "user" ? "#DCF8C6" : "#eee",
                  borderRadius: "10px",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
      )}
      <div style={{ margineTop: "50px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Ask GC Compendium"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "60%", padding: "10px" }}
        />
        <button onClick={handleSend} style={{ marginLeft: "10px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;

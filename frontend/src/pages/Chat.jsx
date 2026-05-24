import { useState } from "react";
import "./Chat.css";
import { useRef } from "react";
import { useEffect } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* const handleChange = (e) => {
    const element = e.target;
    setInput(element.value);
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }; */

  const messageEndRef = useRef(null);
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();

      const aiMessage = {
        role: "ai",
        text: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error: ", error);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Someting went wrong." },
      ]);
    } finally {
      setLoading(false);
    }

    setInput("");
  };

  return (
    <div className="chatPage">
      {messages.length === 0 ? (
        <div className="greetings">
          <h1>Welcome to GC Compendium</h1>
          <p>Have question? Ask away and get verified information instantly</p>
        </div>
      ) : (
        <div className="messagesContainer">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <p className="textMessage">{msg.text}</p>
              {msg.role === "ai" && msg.sources && (
                <div className="sources">
                  <p className="sourceTitle">Sources</p>
                  {msg.sources
                    .filter(
                      (s, index, self) =>
                        s.fileName &&
                        s.section &&
                        index ===
                          self.findIndex(
                            (x) =>
                              x.fileName === s.fileName &&
                              x.section === s.section,
                          ),
                    )
                    .map((s, i) => (
                      <div key={i} className="cite">
                        <small>
                          📝 {s.fileName} — {s.section}
                        </small>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message ai">
              <p className="textMessage waiting">Thinking...</p>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      )}
      <div className="userInput">
        <textarea
          placeholder="Ask GC Compendium"
          className="textArea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
          rows="1"
        />
        {/*  <input
          type="text"
          placeholder="Ask GC Compendium"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
 */}{" "}
        <button className="sendBtn" onClick={handleSend} disabled={loading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#14281D"
          >
            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Chat;

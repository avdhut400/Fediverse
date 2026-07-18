// import React, { useState } from "react";
// import axios from "axios";
// import "./Chatbot.css";

// function Chatbot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [messages, setMessages] = useState([
//     {
//       sender: "bot",
//       text: "Hi! I am the PhotoFlux Assistant. How can I help you?",
//     },
//   ]);

//   const sendMessage = async () => {
//     const trimmedMessage = message.trim();

//     if (!trimmedMessage || loading) return;

//     const userMessage = {
//       sender: "user",
//       text: trimmedMessage,
//     };

//     setMessages((previous) => [
//       ...previous,
//       userMessage,
//     ]);

//     setMessage("");
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/chat`,
//         {
//           message: trimmedMessage,
//         }
//       );

//       setMessages((previous) => [
//         ...previous,
//         {
//           sender: "bot",
//           text:
//             response.data.reply ||
//             "Sorry, I could not answer that.",
//         },
//       ]);
//     } catch (error) {
//       console.error("Chatbot error:", error);

//       setMessages((previous) => [
//         ...previous,
//         {
//           sender: "bot",
//           text: "Sorry, the assistant is currently unavailable.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       sendMessage();
//     }
//   };

//   return (
//     <div className="chatbot-wrapper">
//       {isOpen && (
//         <div className="chatbot-box">
//           <div className="chatbot-header">
//             <div>
//               <h3>PhotoFlux Assistant</h3>
//               <span>Online</span>
//             </div>

//             <button
//               type="button"
//               onClick={() => setIsOpen(false)}
//               aria-label="Close chatbot"
//             >
//               ×
//             </button>
//           </div>

//           <div className="chatbot-messages">
//             {messages.map((item, index) => (
//               <div
//                 key={`${item.sender}-${index}`}
//                 className={`chat-message ${item.sender}`}
//               >
//                 {item.text}
//               </div>
//             ))}

//             {loading && (
//               <div className="chat-message bot">
//                 Typing...
//               </div>
//             )}
//           </div>

//           <div className="chatbot-input-area">
//             <input
//               type="text"
//               value={message}
//               placeholder="Ask about PhotoFlux..."
//               onChange={(event) =>
//                 setMessage(event.target.value)
//               }
//               onKeyDown={handleKeyDown}
//               disabled={loading}
//             />

//             <button
//               type="button"
//               onClick={sendMessage}
//               disabled={loading || !message.trim()}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}

//       <button
//         type="button"
//         className="chatbot-toggle"
//         onClick={() => setIsOpen((previous) => !previous)}
//         aria-label="Open chatbot"
//       >
//         {isOpen ? "×" : "AI"}
//       </button>
//     </div>
//   );
// }

// export default Chatbot;
 





import React, { useState } from "react";
import axios from "axios";
import botAvatar from "../assets/robot.png";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I am the PhotoFlux Assistant. How can I help you?",
    },
  ]);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    const userMessage = {
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chat`,
        {
          message: trimmedMessage,
        }
      );

      setMessages((previous) => [
        ...previous,
        {
          sender: "bot",
          text:
            response.data.reply ||
            "Sorry, I could not answer that.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((previous) => [
        ...previous,
        {
          sender: "bot",
          text:
            "Sorry, the assistant is currently unavailable.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      className={`chatbot-wrapper ${
        darkMode ? "chatbot-dark" : "chatbot-light"
      }`}
    >
      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <img
                src={botAvatar}
                alt="PhotoFlux Assistant"
                className="chatbot-header-avatar"
              />

              <div>
                <h3>PhotoFlux Assistant</h3>

                <div className="chatbot-status">
                  <span className="status-dot"></span>
                  <span>Online</span>
                </div>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button
                type="button"
                className="theme-toggle-button"
                onClick={() =>
                  setDarkMode((previous) => !previous)
                }
                aria-label="Change chatbot theme"
                title={
                  darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {darkMode ? "☀" : "☾"}
              </button>

              <button
                type="button"
                className="chatbot-close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                ×
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((item, index) => (
              <div
                key={`${item.sender}-${index}`}
                className={`message-row ${item.sender}`}
              >
                {item.sender === "bot" && (
                  <img
                    src={botAvatar}
                    alt="Bot"
                    className="message-avatar"
                  />
                )}

                <div
                  className={`chat-message ${item.sender}`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row bot">
                <img
                  src={botAvatar}
                  alt="Bot"
                  className="message-avatar"
                />

                <div className="chat-message bot typing-message">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={message}
              placeholder="Ask about PhotoFlux..."
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <button
              type="button"
              className="chatbot-send-button"
              onClick={sendMessage}
              disabled={loading || !message.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="chatbot-toggle"
        onClick={() =>
          setIsOpen((previous) => !previous)
        }
        aria-label={
          isOpen ? "Close chatbot" : "Open chatbot"
        }
      >
        {isOpen ? (
          <span className="toggle-close-icon">×</span>
        ) : (
          <img
            src={botAvatar}
            alt="Open PhotoFlux Assistant"
            className="chatbot-toggle-image"
          />
        )}
      </button>
    </div>
  );
}

export default Chatbot;
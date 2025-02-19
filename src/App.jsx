import "./App.css"
import ChatbotIcon from "./Components/ChatbotIcon";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faAngleDown, faMessage } from '@fortawesome/free-solid-svg-icons';
import ChatForm from "./Components/ChatForm";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./Components/ChatMessage";

const App = () => {

  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateChats = (resText, isError = false) => {
      setChatHistory(chats => [...chats.filter(msg => msg.text !== "Thinking..."), { role: "model", text: resText, isError }])
    }

    //Parse the payload for api
    history = history.map(({ role, text }) => [{ role, parts: [{ text }] }]);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history })
    };

    try {
      const response = await fetch(import.meta.env.VITE_GEMINI_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "Something went wrong");
      const geminiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateChats(geminiResponseText);
    } catch (error) {
      updateChats(error.message, true);
    }
  }

  useEffect(() => {
    //Show latest messages by scrolling down
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behaviour: "smooth" });
  }, [chatHistory])


  return (
    <div className={`container ${showChatbot && 'show-chatbot'}`}>
      <button id="chatbot-toggler" onClick={() => setShowChatbot(toggle => !toggle)}>
        {!showChatbot && <FontAwesomeIcon icon={faMessage} />}
        {showChatbot && <FontAwesomeIcon icon={faXmark} />}
      </button>

      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot(toggle => !toggle)}>
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
        </div>

        {/* Chatbot body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there <br /> How can I help you today?
            </p>
          </div>

          {/* Render the chat messages */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chatbot footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  )
}

export default App;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {

  const inputRef = useRef();

  const handleOnSubmit = (event) => {
    event.preventDefault();
    const message = inputRef.current.value.trim();
    if (!message) return;
    //Clear value of submit
    inputRef.current.value = null;

    //Append the new message to the chat
    setChatHistory((history) => [...history, { role: "user", text: message }]);

    //Bot thinking
    setTimeout(() => {
      setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);
      generateBotResponse([...chatHistory, { role: "user", text: message }]);
    }, 600);

  }

  return (
    <>
      <form action="#" className="chat-form" onSubmit={handleOnSubmit}>
        <input ref={inputRef} type="text" placeholder="Type here.." className="message-input" required />
        <button type='submit'><FontAwesomeIcon icon={faArrowUp} /></button>
      </form>
    </>
  )
}

export default ChatForm
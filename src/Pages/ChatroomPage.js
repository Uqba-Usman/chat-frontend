import React from "react";
import { withRouter } from "react-router";

function ChatroomPage({ match, socket }) {
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
  };

  React.useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        console.log("Message", message);
        const newSetmessage = [...messages, message];
        setMessages(newSetmessage);
        console.log("Messages", messages);
      });
    }
  }, [messages]);

  React.useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
      
    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
  }, []);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">
          <div className="chatroomContent">
            {messages.map((message, index) => (
              <div key={index} className="message">
                <span className="otherMessage">{message.name}</span>
                {message.message}
              </div>
            ))}
          </div>
          <div className="chatroomActions">
            <div>
              <input
                type="text"
                name="message"
                placeholder="Say Soomething"
                ref={messageRef}
              />
            </div>
            <div>
              <button className="join" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(ChatroomPage);

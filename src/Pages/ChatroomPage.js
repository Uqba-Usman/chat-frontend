import React from "react";
import { withRouter } from "react-router";

function ChatroomPage({ match, socket }) {
  // const chatroomId = match.params.id;
  const chatroomId = "610e88d9deb681298804dcee";
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();

  const sendMessage = () => {
    console.log("SOCKET: ", socket);
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
    console.log("SOCKET 20: ", socket);
    if (socket) {
      console.log("SOCKET 22: ", socket);
    }
  };

  socket.on("newMessage", (message) => {
    console.log("Message", message);

    const newSetmessage = [...messages, message];
    setMessages(newSetmessage);
    console.log("Messages", messages);
  });

  React.useEffect(() => {
    console.log("SOCKET: ", socket);
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
    console.log("IN", socket);
    if (socket) {
      console.log("INSide");
      socket.emit("joinRoom", {
        chatroomId: "",
      });

      return () => {
        //Component Unmount
        if (socket) {
          socket.emit("leaveRoom", {
            chatroomId,
          });
        }
      };
    }
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

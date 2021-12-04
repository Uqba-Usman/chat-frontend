import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import IndexPage from "./Pages/IndexPage";
import ChatroomPage from "./Pages/ChatroomPage";
import io from "socket.io-client";
import makeToast from "./Toaster";

function App() {
  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    if (!socket) {
      const newSocket = io("http://localhost:5005", {
        query: {
          // token: localStorage.getItem("CC_Token"),
          userId: "6113d0fe704e961da474cae7",
        },
      });
      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Disconnected");
      });

      newSocket.on("connect", () => {
        makeToast("success", "Socket Connected");
      });

      setSocket(newSocket);
    }
  };

  React.useEffect(() => {
    setupSocket();
  }, []);
  return (
    <Router>
      <Switch>
        <Route path="/" component={IndexPage} exact />
        <Route
          path="/login"
          render={() => <LoginPage setupSocket={setupSocket} />}
          exact
        />
        <Route path="/register" component={RegisterPage} exact />
        <Route
          path="/dashboard"
          render={() => <DashboardPage socket={socket} />}
          exact
        />
        <Route
          path="/chatroom/:id"
          render={() => <ChatroomPage socket={socket} />}
          exact
        />
      </Switch>
    </Router>
  );
}

export default App;

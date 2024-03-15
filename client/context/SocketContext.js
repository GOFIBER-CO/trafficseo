import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const socket = io("https://api.trafficsseo.com", {
      auth: {
        token: token,
      },
      autoConnect: false,
    });
    if (token) {
      setSocket(socket);

      socket.on("connect", () => {});
      socket.connect();
    }

    return () => {
      socket?.disconnect();
    };
  }, [token]);
  useEffect(() => {
    if (!token && socket) {
      socket.disconnect();
    }
  }, [token, socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

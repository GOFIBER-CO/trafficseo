import React, { useState } from "react";
import openSocket from "socket.io-client";
const socket = openSocket("https://api.trafficsseo.com");
const getConnections = (cb) => {
  socket.on("pageview", (connections) => cb(connections.connections));
};

export const RealTimeItem = () => {
  const [connections, setConnections] = useState(0);
  getConnections((conns) => {
    console.log(conns);
    setConnections(conns);
  });

  return <p>{connections}</p>;
};

export default RealTimeItem;

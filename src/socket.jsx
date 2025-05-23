import { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";
import { server } from "./constants/config";

//createContext in React is used to create a Context object.This object can then be used to share state or values between components
//without having to pass props down manually through every level of the component tree.
const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

//io(server, { withCredentials: true }): This creates a new Socket.io connection to the specified server.The { withCredentials: true }
//option ensures that cookies and credentials are sentwith the request, which might be necessary for authentication or session management.
//this used in app.jsx
//  rooms: Map(4) {
//   'sXvjwfvIgQJBT2JjAAAO' => [Set],
//   'ATsR3dXOYZ2eLffeAAAP' => [Set],
//   'lRLtXtqajplZRn_AAAAS' => [Set],
//   '5lx2YEUKGA8JOb00AAAT' => [Set]
// },
//if socketProvider is called 4 times than 4 sockets are created in room at server side.
//io.on("connection", (socket) => {    , console.log(socket) you get all these above 4 sockets connected with a socket server
//above all 4 are the socket id of same login user,becaus this is called 4 times.
// '5lx2YEUKGA8JOb00AAAT, this last socket represents the socket.id of current login user as it is executed last.
const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(server, { withCredentials: true }), []);
  console.log("1", socket);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };

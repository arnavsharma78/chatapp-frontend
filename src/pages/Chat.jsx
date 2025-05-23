//React Fragment is a feature in React that allows you to return multiple elements from a React component by allowing you to group a list of children without
// adding extra nodes to the DOM, it is like div tag
import React, { useRef, Fragment, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Stack, IconButton } from "@mui/material";
import { InputBox } from "../components/styles/StyledComponents";
import { grayColor } from "../constants/color";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { useCallback } from "react";
import { useEffect } from "react";
import FileMenu from "../components/dialogs/FileMenu";
import { useInfiniteScrollTop } from "6pp";
import { getSocket } from "../socket";
import { TypingLoader } from "../components/layout/Loaders";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import {
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
  ALERT,
} from "../constants/events";
import { sampleMessage } from "../constants/sampleData";
import MessageComponent from "../components/shared/MessageComponent";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { setIsFileMenu } from "../redux/reducers/misc";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// const user = {
//   _id: "12",
//   name: "arnav",
// };
//chatId received form applayout
const Chat = ({ chatId, user }) => {
  //used this containerRef in stack component, there we apply infinite scrolling.
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //to get socket to whom which user is logged in .
  const socket = getSocket();
  const [page, setPage] = useState(1);

  //get the chatId details form chat collections of database
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  //get the messages having passed chatId in sorted order on basis of createdAt , and pagination applied.
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  //to implement infinite scrolling, as you scroll upward , older messages displays up.
  //oldMessages contains recent 20 messages and page count is 1, as we scroll up futher more 20 messages appended to oldmessages and page
  //count become 2.
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);

  //filemenu anchor is associated with attach file icon due to this when clicked on icon menu pop up is appearedat that position .
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  //isError and error by default contained in this variable
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  //members in the chatId instance
  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    //to attach MEnu appeared when clicked on attach file icon to the icon else it appeared at left bottom of screen
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    //Emitting the message to the server, its listener are defined in app.js in server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  useEffect(() => {
    // socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      // socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  //loading dots will appear at below messages when messages sends to user
  // useEffect(() => {
  //   if (bottomRef.current)
  //     bottomRef.current.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const newMessagesHandler = useCallback((data) => {
    //data is relatimemessage get from app.js in server
    //console.log(data);

    if (data.chatId !== chatId) return; //this condition states that message will go to only selected users.
    setMessages((prev) => [...prev, data.message]);
  }, []);

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return; //this is because type loading dots are visible to current chatid only not to others.
      setUserTyping(false);
    },
    [chatId]
  );

  // const alertListener = useCallback(
  //   (data) => {
  //     if (data.chatId !== chatId) return;
  //     const messageForAlert = {
  //       content: data.message,
  //       sender: {
  //         _id: "djasdhajksdhasdsadasdas",
  //         name: "Admin",
  //       },
  //       chat: chatId,
  //       createdAt: new Date().toISOString(),
  //     };

  //     setMessages((prev) => [...prev, messageForAlert]);
  //   },
  //   [chatId]
  // );

  //[NEW_MESSAGE] will replaced with the value of NEW_MESSAGE
  const eventHandler = {
    // [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesHandler,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        {/* last thing in the container is div,below all messages*/}
        <div />
      </Stack>
      {/*  this form below creates an input bar by which user can enter messages*/}
      <form
        style={{
          height: "10%", //above it is defined 90% ,so this 10% for input feild
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"} //relative means it remains relative to parent container
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "0.5rem",
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder="Type Message Here..."
            value={message}
            onChange={messageOnChange}
          />
          <IconButton
            type="submit"
            sx={{
              backgroundColor: "#ea7070",
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};
export default AppLayout()(Chat);

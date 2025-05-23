/*eslint-disable*/
import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@mui/material";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../../constants/sampleData";
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsMobile } from "../../redux/reducers/misc";
import { useNavigate } from "react-router-dom";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import Profile from "../specific/Profile";
import { useSelector, useDispatch } from "react-redux";
import { getOrSaveFromStorage } from "../../lib/features";
import { Drawer } from "@mui/material";
import { getSocket } from "../../socket";
import { useCallback } from "react";
import { setNewMessagesAlert } from "../../redux/reducers/chat";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  START_TYPING,
  STOP_TYPING,
  REFETCH_CHATS,
} from "../../../../server/constants/events";
import { incrementNotification } from "../../redux/reducers/chat";
//Home.jsx is the wrapped component
const AppLayout = () => (WrappedComponent) => {
  //home.jsx is received as a prop

  return (props) => {
    const params = useParams(); //because chatId is accessed from URL,this will fetch that id from url
    const chatId = params.chatId; //In defining routes in app.js chatId is defined so here the exact name chatId is used
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = getSocket();
    console.log(socket.id);
    const { isMobile } = useSelector((state) => state.misc); //isMobile will control an drawer when clicked on menuicon ,when screen is shrink to mobile size

    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat); //to show new messages description
    console.log("newmessagealert", newMessagesAlert);
    //isLoading,isError,error,refetch are the default values provided by useMyChatsQuery
    //data is the main thing we get as an return from server
    //data contains all those chats in which member contains req.user
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
    // console.log(data);

    //this effect is used to clear the new message alert when clicked on user
    useEffect(() => {
      getOrSaveFromStorage({
        key: NEW_MESSAGE_ALERT,
        value: newMessagesAlert,
      });
    }, [newMessagesAlert]);
    useErrors([{ isError, error }]);
    const handleMobileClose = () => {
      console.log("here");
      dispatch(setIsMobile(false));
    };
    const handleDeleteChat = (e, _id, groupChat) => {
      console.log("Delete Chat", _id, groupChat);
      e.preventDefault();
    };

    const newMessageAlertHandler = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },

      [chatId]
    );

    //handle friend request. sendfriendrequest in  user.js
    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch]);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
      [REFETCH_CHATS]: refetchListener,
    };

    useSocketEvents(socket, eventHandlers);
    return (
      <>
        <Title />
        <Header />

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              //   onlineUsers={onlineUsers}
            />
          </Drawer>
        )}
        {/* 4 rem height is taken by header */}
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={
              //if size is xs(mobile screen) than display set to none when you shrink the screen
              {
                diplay: { xs: "none", sm: "block " },
              }
            }
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                //   onlineUsers={onlineUsers}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>

        {/* <div>Footer</div> */}
      </>
    );
  };
};
//to understand its working see Home.jsx
export default AppLayout;

//xs={12} sm={8} md={5} lg={6} ,these property are stands for extra small,small,large,medium, on the basis if screen size these property get defined

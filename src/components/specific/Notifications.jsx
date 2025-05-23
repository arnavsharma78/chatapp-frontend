/*eslint-disable*/
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";

//import { useDispatch, useSelector } from "react-redux";
import { sampleNotifications } from "../../constants/sampleData";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
const Notifications = () => {
  const dispatch = useDispatch();
  const { isNotification } = useSelector((state) => state.misc);

  // data contains the array of request object ids, in which receiver is req.user. It is in this format populated with sender name,avatar,id
  // // _id,
  //   sender: {
  //     _id: sender._id,
  //     name: sender.name,
  //     avatar: sender.avatar.url,
  //   },
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
 
  
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  //on clicking accept this friend request handler gets called. _id is the request id of which req.user is receiver
  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    //will create the chatid object having two members , receiver and sender of request.
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));
  useErrors([{ error, isError }]);
  console.log(data);
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {data?.allRequests.length > 0 ? (
          data?.allRequests?.map(({ sender, _id }) => (
            <NotificationItem
              sender={sender}
              _id={_id}
              handler={friendRequestHandler}
              key={_id}
            />
          ))
        ) : (
          <Typography textAlign={"center"}> 0 Notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} />

        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} sent you a friend request.`}
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});
export default Notifications;

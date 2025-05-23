import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

const useAsyncMutation = (mutatationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  // useSendFriendRequestMutation , mutate is used to query from database, whatever passed in it is received as data in query(data) , see api
  const [mutate] = mutatationHook();

  //sendFriendRequest("Sending friend request...", { userId: id }  in search.jsx
  //toastMessage---->"sending friend request" and {userId:id} is ....args
  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    //when clicked on ➕ on search dialog to add friend ,sending friend request.... message is displayed in toast pop up
    const toastId = toast.loading(toastMessage || "Updating data...");

    try {
      //will call an backend api handling
      const res = await mutate(...args);

      if (res.data) {
        //res.data.message is friend request sent, backend API return json data.
        toast.success(res.data.message || "Updated data successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};

//handlers: An object where the keys are event names and the values are handler functions.
const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    //Setting up Event Listeners
    //This code iterates over the handlers object. For each key-value pair (where event is the event name and handler is the
    //function to be called when that event occurs), it sets up a listener on the socket for that event.
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

export { useErrors, useAsyncMutation, useSocketEvents };

//this file handles the data when search is clicked on corner,this is used in header.jsx
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import { useAsyncMutation } from "../../hooks/hook";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { setIsSearch } from "../../redux/reducers/misc";
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import { useResolvedPath } from "react-router-dom";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../../constants/sampleData";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";

const Search = () => {
  //this search value will contain the value being search in the search dialog
  const search = useInputValidation("");

  const dispatch = useDispatch();

  const { isSearch } = useSelector((state) => state.misc);

  // [executeMutation, isLoading, data] return by useAsyncMutation ,check hook file.
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const [users, setUsers] = useState([]);
  //searchUser is user defined name , it is use to make query at the backend user/search
  const [searchUser] = useLazySearchUserQuery();

  // searchUser(search.value) ,search.value is the "name" parameter passed along query
  //data.users are contains name,_id,avatar of users which are except me and my freinds
  useEffect(() => {
    //will run after 1 second of user search
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    //when useEffect will run nex time, this return will execute first
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  //id is received from UserItem
  const addFriendHandler = async (id) => {
    //this just store the data with sender and receiver in the database, in request collection
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));
  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* the list below search input feild in dialog */}
        <List>
          {users.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
              // will add an list below the search bar when you click on search
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;

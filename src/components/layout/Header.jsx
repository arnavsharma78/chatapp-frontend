import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Badge,
} from "@mui/material";
import { useState } from "react";

import { setIsNotification } from "../../redux/reducers/misc";
import { setIsNewGroup } from "../../redux/reducers/misc";
import axios from "axios";
import { setIsSearch } from "../../redux/reducers/misc";
import toast from "react-hot-toast";
import { setIsMobile } from "../../redux/reducers/misc";
import { server } from "../../constants/config";
import { useDispatch } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import { orange } from "../../constants/color";
import Backdrop from "@mui/material/Backdrop";
import { useSelector } from "react-redux";
import { Suspense, lazy } from "react";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { resetNotificationCount } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);
  console.log("not", notificationCount);

  const handleMobile = () => {
    dispatch(setIsMobile(true)); // true is an value accessible through action.payload in redux.
  };
  const openSearch = () => {
    dispatch(setIsSearch(true));
  };
  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  //when clicked on logout from
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  //move to /group ,route defined in app.jsx
  const navigateToGroup = () => navigate("/groups");

  //the whole header wrapped inside box
  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        {/* the height of header stay fixed even when parent box height is changed because of appbar,change appbar height */}
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              Chat-App
            </Typography>
            <Box //this box will appear when window shrink to xs(extra small)
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box //this box will take whole space due to flexGrow and next box(searvh icon) moves to  end
              sx={{
                flexGrow: 1,
              }}
            />
            <Box>
              <Tooltip //tooltip adds info,when hovered to button info pop is appeared
                title="search"
              >
                <IconButton //search icon at right corner in navbar
                  color="inherit"
                  size="large"
                  onClick={openSearch}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="New Group">
                <IconButton color="inherit" size="large" onClick={openNewGroup}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Manage Group">
                <IconButton
                  color="inherit"
                  size="large"
                  onClick={navigateToGroup}
                >
                  <GroupIcon />
                </IconButton>
              </Tooltip>
              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />
              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {/* when clicked on the icons of header these below code executes will occur */}
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotificationDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

//we are using same component again and again so this component is created
const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;

//The flexGrow property determines how much a flex item should grow relative to the rest of the flex items inside the same container.
//For example, if there are two items in a flex container, one with flex-grow: 1 and the other with flex-grow: 2, the second item will
//grow twice as much as the first.

//position ="static" : It will not be fixed to any specific position on the screen and will move as you scroll the page,

//The <Toolbar> component provides consistent vertical and horizontal alignment and spacing for its child elements,
// making it easier to create a well - organized and visually appealing layout.due to this icon are arranged in horizontal line

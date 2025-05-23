//this file used in pages/admin/dashboard.jsx

import React, { useState } from "react";
import {
  Grid,
  Box,
  IconButton,
  Drawer,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Groups as GroupsIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { grayColor, matBlack } from "../../constants/color";
import {
  Dashboard as DashboardIcon,
  ManageAccounts as ManageAccountIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;
export const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Message",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation(); //to change things on basis of location

  const logoutHandler = () => {
    console.log("logout");
  };

  return (
    <Stack width={w} spacing={"3rem"} direction={"column"} p={"3rem"}>
      <Typography variant="h5" textTransform={"uppercase"}>
        Chat-App
      </Typography>
      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={
              location.pathname === tab.path && {
                bgcolor: matBlack,
                color: "white",
                ":hover": { color: "white" },
              }
            }
          >
            <Stack direction="row" alignitems={"center"} spacing={"1rem"}>
              {tab.icon}
              <Typography fontSize={"1.2rem"}>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}

        <Link onClick={logoutHandler}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToAppIcon />

            <Typography fontSize={"1.2rem"}>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

const isAdmin = true; //this variable helps to control ,switching of /admin/dashboard and /admin
const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false); //isMobile is used to handle drawer
  const handleMobile = () => setIsMobile(!isMobile);
  const handleClose = () => {
    setIsMobile(false); //to close drawer opened using menu button
  };

  if (!isAdmin) return <Navigate to="/admin" />;
  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Grid
        item
        md={4}
        lg={3}
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        <Sidebar />
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: "gray",
        }}
      >
        {children}
      </Grid>

      {/*drawer is open on side when click on menu button in small screen*/}
      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w="50vw" />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
//<Grid container minHeight={"100vh"}>
//container: This attribute makes the Grid component a flex container that can contain nested Grid items. When a Grid has the container attribute, you can specify spacing, alignment, and
//layout of its child Grid components.
//minHeight={"100vh"}: This sets the minimum height of the Grid container to 100% of the viewport height. ensuring fill the full screen
// the Grid component with the item attribute is used to define a child within a Grid container. The item attribute specifies that the Grid is an individual grid item, which will be
//placed within a Grid container that has the container attribute.

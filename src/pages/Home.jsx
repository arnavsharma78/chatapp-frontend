//our  main page is divided into grid consist of 3 inner grids,this is the middle one ,see AppLayout.jsx
import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Typography, Box } from "@mui/material";
const Home = () => {
  return (
    <Box bgcolor={"rgba(0,0,0,0.1)"} height={"100%"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Select a freind to chat
      </Typography>
    </Box>
  );
};

export default AppLayout()(Home);

//the above export is equivalent to this code AppLayout()(Home)
// export default (props) => {
//   return (
//     <div>
//       <div> Header </div>
//       <Home {...props} />
//       <div>Footer</div>
//     </div>
//   );
// };

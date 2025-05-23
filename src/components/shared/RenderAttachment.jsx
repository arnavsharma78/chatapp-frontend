//this file is connected to features.js

import React from "react";
import { TransformImage } from "../../lib/features";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";
const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"200px"} controls />;

    case "image":
      return (
        <img
          src={TransformImage(url)}
          alt="Attachment"
          width={"200px"}
          height={"150px"}
          style={{
            objectFit: "contain",
          }}
        />
      );

    case "audio":
      return <audio src={url} preload="none" width={"200px"} controls />;
    default:
      <FileOpenIcon />;
  }
};

export default RenderAttachment;

//transformImage(url, 200) ,this iused to set image at specified pixels
//if 200 is written than image is set to 200 px

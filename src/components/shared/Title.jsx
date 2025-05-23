import React from "react";
import { Helmet } from "react-helmet-async";
const Title = ({
  title = "Chat",
  description = "this is the Chat App called chat",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};
//assign the title of web with title prop
export default Title;

//<title>{title}</title> html document title is set to chat
//This reusable React component will manage all of your changes to the document head.

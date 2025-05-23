/*eslint-disable*/
import React, { lazy, Suspense } from "react";
import { Loaders } from "./components/layout/Loaders";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast"; //to send pop up on screen
import { useSelector } from "react-redux";
import { userNotExists } from "./redux/reducers/auth";
import { SocketProvider } from "./socket";
import { useDispatch } from "react-redux";
import axios from "axios"; //axios is used for the connectivity with the database.
import { server } from "./constants/config";
const Home = lazy(() => import("./pages/Home")); //lazy is used to dynamically import the file ,it will only import when file is needed
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessagesManagement = lazy(() =>
  import("./pages/admin/MessageManagement")
);
//

let user = true;

function App() {
  //select the state , state is accesssible because of provider
  const { user, loader } = useSelector((state) => state.auth);

  console.log(user);
  const dispatch = useDispatch();
  //api/v1/user/me will return an user information by getting data from database of User , in (res ) we get data.
  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  //<Route element={<ProtectRoute />}>   will wrap every route inside with <Protectroute><Home><ProtectRoute>
  //user is false than control will go to /login page, <Route path="/" element={<Home />}></Route>
  // <Route path="/chat/:chatId" element={<Chat />}></Route>
  // <Route path="/groups" element={<Groups />}></Route>
  //these route cant be accessible so control will go to login page

  //socket is accessible in below three route beacuse of SocketProvider
  return loader ? (
    <Loaders />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<Loaders />}>
        <Routes>
          <Route
            element={
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />}></Route>
            <Route path="/chat/:chatId" element={<Chat />}></Route>

            <Route path="/groups" element={<Groups />}></Route>
          </Route>
          <Route // if user is false than it redirects to home / not go to <login/>
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessagesManagement />} />
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}

export default App;

//<Suspense> lets you display a fallback until its children have finished loading.

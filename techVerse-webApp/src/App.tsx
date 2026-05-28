import Body from "./components/Body";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import EditProfile from "./features/profile/EditProfile";
import { Provider } from "react-redux";
import { appStore } from "./utils/store/appStore";
import Feed from "./features/feedPage/Feed";
import { type FC } from "react";
import Connections from "./features/connectionPage/Connections";

import Requests from "./features/requestPage/Requests";
import Chat from "./features/chat/Chat";
import ProfileViewFromUser from "./features/profile/ProfileViewFromUser";


const App: FC = () => {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/profile/view" element={<ProfileViewFromUser />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
};

export default App;

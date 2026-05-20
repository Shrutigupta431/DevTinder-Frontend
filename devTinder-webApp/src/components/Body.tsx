import { useEffect, type FC } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./NavBar";
import Foter from "./Foter";
import { BASE_URL } from "../utils/constants/url";
import axios, { type AxiosError } from "axios";
import { addUser } from "../utils/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../types/store.types";
// import type { User } from "../types/user.types";
import type { ProfileViewResponse, ApiError } from "../types/api.types";

const Body: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store: RootState) => store.user);
console.log("userData",userData)
  const fetchUser = async (): Promise<void> => {
    try {
      if (userData) return;
      const res = await axios.get<ProfileViewResponse>(
        BASE_URL + "/profile/view",
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        dispatch(addUser(res.data as any));
      }

    } catch (err) {
      const error = err as AxiosError<ApiError>;
      if (error.response?.status === 401) {
        navigate("/login");
      }
      console.error("Fetch user error:", error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Navbar />
      <Outlet />
      <Foter />
    </div>
  );
};

export default Body;

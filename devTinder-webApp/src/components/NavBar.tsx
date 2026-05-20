import axios, { type AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants/url";
import { removeUser } from "../utils/slices/userSlice";
import type { RootState } from "../types/store.types";
import type { User } from "../types/user.types";
import type { LogoutApiResponse, ApiError } from "../types/api.types";
import { type FC } from "react";

export const Navbar: FC = () => {
  const user = useSelector((store: RootState) => store.user) as User | null;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async (): Promise<void> => {
    try {
      await axios.post<LogoutApiResponse>(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      console.error("Logout error:", error);
    }
  };
  return (
    <div className="navbar bg-base-100 shadow-sm" data-theme="dark">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">Dev Tinder</Link>
      </div>
      {user && (
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-20 md:w-auto"
          />
          <p className="mt-2">Wecome {user.firstName}</p>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar mr-1"
            >
              <div className="w-10 rounded-full mr-1">
                <img alt="Tailwind CSS Navbar component" src={user?.photoUrl} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
               <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

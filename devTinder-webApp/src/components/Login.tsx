import { type FC, useState } from "react";
import logo from "../assets/logo.png";
import axios, { type AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants/url";
import type { LoginCredentials, LoginResponse } from "../types/user.types";
import type { ApiError } from "../types/api.types";
import validator from "validator";

const Login: FC = () => {
  const [emailId, setEmailId] = useState<string>("shruu@gmail.com");
  const [password, setPassword] = useState<string>("Shruu@123");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleLogin = async (): Promise<void> => {
  setError(null);

  // // Email validation
  if (!validator.isEmail(emailId)) {
    setError("Invalid email");
    return;
  }

  // // Password empty check
  // if (validator.isStrongPassword(password)) {
  //   setError("Password is required");
  //   return;
  // }

  try {
    const credentials: LoginCredentials = {
      emailId,
      password,
    };

    const res = await axios.post<LoginResponse>(
      BASE_URL + "/login",
      credentials,
      { withCredentials: true }
    );

    dispatch(addUser(res.data));
    navigate("/");
  } catch (err) {
    const error = err as AxiosError<ApiError>;

    const message = typeof error.response?.data === 'string' 
      ? error.response.data 
      : error.response?.data?.message || "Login failed";

    setError(message as string);

    console.error("Login error:", error);
  }
};

  return (
    <div className="flex justify-center p-5">
      <div className="card card-side bg-base-100 shadow-sm">
        <figure>
          <img src={logo} alt="Logo" className="w-100 h-100 object-contain" />
        </figure>
        <div className="card-body">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend font-bold text-xl ">
              Login
            </legend>

            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />

            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
            <button className="btn btn-neutral mt-4" onClick={handleLogin}>
              Login
            </button>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default Login;

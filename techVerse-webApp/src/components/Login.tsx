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
import background from "../assets/background.png";

const Login: FC = () => {
  const [emailId, setEmailId] = useState<string>("shruu@gmail.com");
  const [password, setPassword] = useState<string>("Shruu@123");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(false);
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
        { withCredentials: true },
      );

      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Login failed";

      setError(message as string);

      console.error("Login error:", error);
    }
  };
  const handleSignup = async (): Promise<void> => {
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
        firstName,
        lastName,
      };

      const res = await axios.post(
        BASE_URL + "/signup",
        credentials,
        { withCredentials: true },
      );

      dispatch(addUser(res?.data?.data));
      setIsLogin(!isLogin);
      return navigate("/profile");
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Sign Up failed";

      setError(message as string);

      console.error("Login error:", error);
    }
  };

return (
  <div
  className="
    relative flex min-h-screen
    items-center justify-center
    overflow-hidden px-4 py-6
    bg-cover bg-center bg-no-repeat
  "
  style={{
    backgroundImage: `url(${background})`,
  }}
>
    
    {/* Background Glow */}
    <div className="absolute left-[-120px] top-20 h-72 w-72 animate-pulse rounded-full bg-cyan-500/20 blur-3xl"></div>

    <div className="absolute bottom-0 right-[-120px] h-72 w-72 animate-pulse rounded-full bg-purple-500/20 blur-3xl"></div>

    {/* Grid */}
    <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:45px_45px]"></div>

    {/* Main Card */}
    <div
      className="
        relative z-10 flex w-full max-w-4xl
        overflow-hidden rounded-[28px]
        border border-white/10
        bg-white/5 shadow-2xl
        backdrop-blur-2xl
      "
    >
      
      {/* LEFT SIDE */}
      <div
        className="
          hidden w-[45%] flex-col justify-center
          bg-gradient-to-br from-cyan-500/20
          via-blue-500/10 to-purple-500/20
          p-8 lg:flex
        "
      >
        
        <img
          src={logo}
          alt="Logo"
          className="
            mx-auto w-52 object-contain
            drop-shadow-2xl transition duration-500
            hover:scale-105
          "
        />

        <div className="mt-8 text-center">
          
          <h1
            className="
              bg-gradient-to-r from-cyan-300
              via-blue-400 to-purple-400
              bg-clip-text text-4xl
              font-extrabold text-transparent
            "
          >
            Tech Verse
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            Connect with developers and grow your tech network 🚀
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-8">
        
        <div className="w-full max-w-sm">
          
          {/* Heading */}
          <div className="mb-6 text-center">
            
            <p
              className="
                mb-3 inline-flex rounded-full
                border border-cyan-400/20
                bg-cyan-500/10 px-3 py-1
                text-[11px] font-medium tracking-wide text-cyan-300
              "
            >
              Welcome To Tech Verse
            </p>

            <h2 className="text-3xl font-extrabold text-white">
              {isLogin ? "Welcome Back 👋" : "Create Account"}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {isLogin
                ? "Login to continue"
                : "Join the developer community"}
            </p>
          </div>

          {/* Form Card */}
          <div
            className="
              rounded-[24px] border border-white/10
              bg-white/5 p-5 shadow-xl
              backdrop-blur-xl
            "
          >
            
            {!isLogin && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                
                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    First Name
                  </label>

                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    className="
                      w-full rounded-xl border
                      border-white/10 bg-white/5
                      px-3 py-2.5 text-sm text-white
                      outline-none transition duration-300
                      placeholder:text-slate-500
                      focus:border-cyan-400/40
                    "
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Last Name
                  </label>

                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    className="
                      w-full rounded-xl border
                      border-white/10 bg-white/5
                      px-3 py-2.5 text-sm text-white
                      outline-none transition duration-300
                      placeholder:text-slate-500
                      focus:border-cyan-400/40
                    "
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="mt-4">
              
              <label className="mb-1 block text-xs text-slate-300">
                Email
              </label>

              <input
                type="email"
                placeholder="developer@gmail.com"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="
                  w-full rounded-xl border
                  border-white/10 bg-white/5
                  px-3 py-2.5 text-sm text-white
                  outline-none transition duration-300
                  placeholder:text-slate-500
                  focus:border-cyan-400/40
                "
              />
            </div>

            {/* Password */}
            <div className="mt-4">
              
              <label className="mb-1 block text-xs text-slate-300">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full rounded-xl border
                  border-white/10 bg-white/5
                  px-3 py-2.5 text-sm text-white
                  outline-none transition duration-300
                  placeholder:text-slate-500
                  focus:border-cyan-400/40
                "
              />
            </div>

            {/* Error */}
            {error && (
              <p className="mt-3 text-xs text-red-400">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              className="
                mt-5 w-full rounded-xl
                bg-gradient-to-r from-cyan-500
                to-blue-500 px-4 py-3
                text-sm font-semibold text-white
                shadow-lg transition duration-300
                hover:scale-[1.02]
                hover:from-cyan-400
                hover:to-blue-400
              "
              onClick={
                isLogin ? handleLogin : handleSignup
              }
            >
              {isLogin ? "Login" : "Create Account"}
            </button>

            {/* Toggle */}
            <p
              className="
                mt-5 cursor-pointer text-center
                text-xs text-slate-400
                transition duration-300
                hover:text-cyan-300
              "
              onClick={() =>
                setIsLogin((value) => !value)
              }
            >
              {isLogin
                ? "New here? Create an account"
                : "Already registered? Login here"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Login;

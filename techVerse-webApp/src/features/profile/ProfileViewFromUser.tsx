import { type FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { User } from "../../types/user.types";


const ProfileViewFromUser: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  // In this route we expect a user object to be passed via Link state.
  // If not present, we keep UI friendly (you can later add API fetch by id).
  useEffect(() => {
    const stateUser = (location.state as { user?: User } | null)?.user;

    if (stateUser) {
      setUser(stateUser);
      setLoading(false);
      return;
    }

    setError("User details not available.");
    setLoading(false);
  }, [location.state]);


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-white">
        <span className="loading loading-spinner loading-lg text-cyan-400" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-cyan-400">Profile Unavailable</h1>
          <p className="mt-3 text-slate-400">{error ?? "Please login to continue 🚀"}</p>
          <button
            className="mt-6 rounded-full bg-cyan-500 px-6 py-3 font-semibold text-white transition duration-300 hover:scale-105 hover:bg-cyan-400"
            onClick={() => navigate("/login")}
          >
            Go To Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#111827] via-[#172554] to-[#0f172a] px-5 py-10 text-white">
      <div className="absolute left-[-100px] top-20 h-96 w-96 animate-pulse rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-10 right-[-100px] h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-white/5 px-5 py-2 backdrop-blur-lg">
            <span className="text-sm font-medium text-cyan-300">Developer Profile</span>
          </div>
          <h1 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-5xl font-extrabold text-transparent">
            Profile
          </h1>
        </div>

        <div className="rounded-[35px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center gap-8 border-b border-white/10 pb-8 md:flex-row">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-400/20 blur-2xl" />
              <img
                src={user.photoUrl || "https://via.placeholder.com/100"}
                alt={user.firstName}
                className="relative z-10 h-36 w-36 rounded-full border-4 border-cyan-400/40 object-cover shadow-xl transition duration-500 hover:scale-105"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-extrabold tracking-wide text-white">
                {user.firstName} {" "}
                <span className="text-cyan-400">{user.lastName}</span>
              </h2>

              <div className="mt-4 flex flex-col gap-3 text-slate-300">
                <div className="flex items-center justify-center gap-2 md:justify-start">{user.emailId}</div>
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  {(user.gender)?.toUpperCase() || "Not specified"}
                  {user.age ? ` • ${user.age} years` : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-xl font-bold text-cyan-300">About Me</h3>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300 leading-8">
              {user.about ||
                "No bio added yet. Tell the developer community about yourself 🚀"}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-xl font-bold text-cyan-300">Skills & Technologies</h3>
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {user.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition duration-300 hover:scale-105 hover:border-cyan-400/50 hover:bg-cyan-500/20"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-400">
                No skills added yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewFromUser;


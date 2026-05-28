import axios from "axios";
import { type FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/constants/url";
import { addConnections } from "../../utils/slices/connectionSlice";
import type { RootState } from "../../types/store.types";
import type { User } from "../../types/user.types";
import { Link } from "react-router-dom";

import { Search, Users, Sparkles, MessageCircle, Eye } from "lucide-react";

const placeholderImage =
  "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";

const Connections: FC = () => {
  const dispatch = useDispatch();

  const connections = useSelector((store: RootState) => store.connection) as
    | User[]
    | null;

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredConnections = useMemo(() => {
    if (!connections) return null;

    const query = search.trim().toLowerCase();

    if (!query) return connections;

    return connections.filter((connection) => {
      const fullName = `${connection.firstName ?? ""} ${
        connection.lastName ?? ""
      }`.toLowerCase();

      const email = (connection.emailId ?? "").toLowerCase();

      const about = (connection.about ?? "").toLowerCase();

      const skills = (connection.skills ?? []).join(" ").toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        about.includes(query) ||
        skills.includes(query)
      );
    });
  }, [connections, search]);

  const fetchConnections = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error(err);

      setError("Unable to load connections. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#111827] via-[#172554] to-[#0f172a] px-5 py-10 text-white">
      {/* Background Glow */}
      <div className="absolute left-[-100px] top-20 h-96 w-96 animate-pulse rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="absolute bottom-10 right-[-100px] h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"></div>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Hero Section */}
        <section
          className="
    overflow-hidden rounded-[28px]
    border border-white/10 bg-white/5
    p-5 shadow-2xl backdrop-blur-xl
  "
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}
            <div className="max-w-2xl">
              {/* Badge */}
              <div
                className="
          mb-3 inline-flex items-center gap-2
          rounded-full border border-cyan-400/20
          bg-cyan-500/10 px-4 py-1.5
        "
              >
                <Sparkles
                  size={14}
                  className="animate-spin text-cyan-400"
                  style={{ animationDuration: "4s" }}
                />

                <p className="text-xs font-medium tracking-wide text-cyan-300">
                  Developer Network
                </p>
              </div>

              {/* Heading */}
              <h1
                className="
          bg-gradient-to-r from-cyan-300
          via-blue-400 to-purple-400
          bg-clip-text text-2xl
          font-extrabold text-transparent
        "
              >
                My Connections
              </h1>

              {/* Description */}
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                Connect, collaborate, and grow your developer network 🚀
              </p>
            </div>

            {/* Compact Stats */}
            <div
              className="
        flex items-center gap-4 rounded-2xl
        border border-cyan-400/20
        bg-cyan-500/10 px-5 py-4
        shadow-lg backdrop-blur-md
      "
            >
              <div className="rounded-full bg-cyan-500/20 p-3">
                <Users size={24} className="text-cyan-400" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                  Connections
                </p>

                <p className="text-2xl font-extrabold text-white">
                  {connections?.length ?? 0}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="mt-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xl">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search developers, skills, bio..."
                className="
                  w-full rounded-2xl border border-white/10
                  bg-white/5 py-4 pl-12 pr-4
                  text-white outline-none
                  backdrop-blur-lg transition duration-300
                  placeholder:text-slate-400
                  focus:border-cyan-400/50
                  focus:bg-white/10
                "
              />
            </div>

            <div className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-bold text-cyan-300">
                {filteredConnections?.length ?? 0}
              </span>{" "}
              of{" "}
              <span className="font-bold text-cyan-300">
                {connections?.length ?? 0}
              </span>
            </div>
          </div>
        </section>

        {/* States */}
        {loading ? (
          <div className="mt-20 flex justify-center">
            <span className="loading loading-spinner loading-lg text-cyan-400"></span>
          </div>
        ) : error ? (
          <div className="mt-10 rounded-3xl border border-red-400/20 bg-red-500/10 p-5 text-center text-red-300 backdrop-blur-xl">
            {error}
          </div>
        ) : !connections || connections.length === 0 ? (
          <div className="mt-16 rounded-[35px] border border-white/10 bg-white/5 p-12 text-center shadow-2xl backdrop-blur-xl">
            <Users size={60} className="mx-auto text-cyan-400" />

            <h2 className="mt-6 text-3xl font-bold">No Connections Yet</h2>

            <p className="mt-4 text-slate-400">
              Once you connect with developers, they’ll appear here ✨
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8">
            {filteredConnections?.map((connection, index) => (
              <>
                {/* Connection Card */}
                <div
                  key={
                   index
                  }
                  className="
    group overflow-hidden rounded-[28px]
    border border-white/10 bg-white/5
    shadow-2xl backdrop-blur-xl
    transition duration-500
    hover:-translate-y-1
    hover:border-cyan-400/30
    hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
    animate-cardReveal
  "
                  style={{
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  {/* Compact Layout */}
                  <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                      {/* Image */}
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-lg"></div>

                        <img
                          src={connection.photoUrl || placeholderImage}
                          alt={`${connection.firstName}`}
                          className="
            relative z-10 h-20 w-20 rounded-full
            border-2 border-cyan-400/40
            object-cover
          "
                        />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-bold text-white">
                            {connection.firstName}{" "}
                            <span className="text-cyan-400">
                              {connection.lastName}
                            </span>
                          </h2>

                          <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                            Developer
                          </div>
                        </div>

                        <p className="mt-1 text-sm text-slate-400">
                          {connection.emailId}
                        </p>

                        <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-300">
                          {connection.about ||
                            "Passionate developer building modern applications 🚀"}
                        </p>

                        {/* Skills */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {connection.skills && connection.skills.length > 0 ? (
                            connection.skills
                              .slice(0, 5)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="
                    rounded-full border border-cyan-400/20
                    bg-cyan-500/10 px-3 py-1
                    text-xs font-medium text-cyan-300
                    transition duration-300
                    hover:bg-cyan-500/20
                  "
                                >
                                  {skill}
                                </span>
                              ))
                          ) : (
                            <span className="text-xs text-slate-400">
                              No skills listed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 self-end lg:self-center">
                      <button
                        type="button"
                        className="
          flex items-center gap-2 rounded-full
          border border-white/10 bg-white/5
          px-4 py-2 text-sm text-slate-300
          transition duration-300
          hover:border-cyan-400/30
          hover:bg-cyan-500/10
          hover:text-cyan-300
        "
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <Link
                        to={`/chat/${connection._id}`}
                         state={{ user: connection }}
                        className="
          flex items-center gap-2 rounded-full
          bg-cyan-500 px-5 py-2
          text-sm font-semibold text-white
          transition duration-300
          hover:scale-105 hover:bg-cyan-400
        "
                      >
                        <MessageCircle size={16} />
                        Message
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;

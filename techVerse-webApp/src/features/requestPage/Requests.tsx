import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/constants/url";
import { addRequest, removeRequest } from "../../utils/slices/requestSlice";
import type { RootState } from "../../types/store.types";
import type { User } from "../../types/user.types";
import { User as Profile } from "lucide-react";
import { Link } from "react-router-dom";


const placeholderImage =
  "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";

const Requests = () => {
  const dispatch = useDispatch();
  const requestList = useSelector((store: RootState) => store.request) as
    | (User & { fromUserId?: Partial<User> })[]
    | null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search] = useState("");

  const filteredRequests = useMemo(() => {
    if (!requestList) return null;
    const query = search.trim().toLowerCase();
    if (!query) return requestList;

    return requestList.filter((r) => {
      const u: any = (r as any).fromUserId ?? r;

      const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
      const email = `${u.emailId ?? ""}`.toLowerCase();
      const about = `${u.about ?? ""}`.toLowerCase();
      const gender = `${u.gender ?? ""}`.toLowerCase();
      const skills = (u.skills ?? []).join(" ").toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        about.includes(query) ||
        gender.includes(query) ||
        skills.includes(query)
      );
    });
  }, [requestList, search]);

  const fetchRequests = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequest(res?.data?.data ?? []));
    } catch (err) {
      console.error(err);
      setError("Unable to load requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status: string, _id: string): Promise<void> => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(_id));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#111827] via-[#172554] to-[#0f172a] px-5 py-10 text-white">
      <div className="devtinder-anim-fade-up">
        <div className="mx-auto max-w-5xl space-y-8">
         <section
  className="
    overflow-hidden rounded-[28px]
    border border-white/10 bg-white/5
    p-5 shadow-2xl backdrop-blur-xl
  "
>
  
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
    
    <div className="max-w-2xl">
      
      <p
        className="
          mb-2 inline-flex rounded-full
          border border-cyan-400/20
          bg-cyan-500/10 px-4 py-1
          text-xs font-medium tracking-wide text-cyan-300
        "
      >
        Developer Requests
      </p>

      <h1
        className="
          bg-gradient-to-r from-cyan-300
          via-blue-400 to-purple-400
          bg-clip-text text-2xl
          font-extrabold text-transparent
        "
      >
        Connection Requests
      </h1>

      <p className="mt-2 text-sm text-slate-300">
        Accept requests and grow your tech network 🚀
      </p>
    </div>

    <div
      className="
        flex items-center gap-4 rounded-2xl
        border border-cyan-400/20
        bg-cyan-500/10 px-5 py-4
        shadow-lg backdrop-blur-md
      "
    >
      
      <div className="rounded-full bg-cyan-500/20 p-3">
        <Profile size={24} className="text-cyan-400" />
      </div>

      <div>
        
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Requests
        </p>

        <p className="text-2xl font-extrabold text-white">
          {requestList?.length ?? 0}
        </p>
      </div>
    </div>
  </div>
</section>

          <section className="grid gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-500">
                Showing {requestList?.length ?? 0} of {requestList?.length ?? 0}
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl bg-base-100 p-10 text-center shadow-lg">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            ) : error ? (
              <div className="alert alert-error shadow-lg">{error}</div>
            ) : !requestList || requestList.length === 0 ? (
              <div className="rounded-3xl bg-base-100 p-10 text-center shadow-lg">
                <p className="text-xl font-semibold">No connections yet</p>
                <p className="mt-2 text-gray-500">
                  Once you connect with someone, their profile cards will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {((filteredRequests ?? requestList) as any[])?.map(
                  (connection, index) => (
                    <div
                      key={
                        connection.fromUserId._id ??
                        `${connection.fromUserId.firstName}-${connection.fromUserId.emailId}`
                      }
                      className="
          group mx-auto w-full max-w-4xl
          overflow-hidden rounded-[28px]
          border border-white/10
          bg-white/5
          shadow-2xl backdrop-blur-xl
          transition duration-500
          hover:-translate-y-1
          hover:border-cyan-400/30
          hover:shadow-[0_0_30px_rgba(34,211,238,0.18)]
          animate-cardReveal
        "
                      style={{
                        animationDelay: `${index * 0.08}s`,
                      }}
                    >
                      <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
                        {/* LEFT SECTION */}
                        <div className="flex items-center gap-4">
                          {/* Image */}
                          <div className="relative shrink-0">
                            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-lg"></div>

                            <img
                              src={
                                connection.fromUserId.photoUrl ||
                                placeholderImage
                              }
                              alt={`${connection.fromUserId.firstName}`}
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
                                {connection.fromUserId.firstName}{" "}
                                <span className="text-cyan-400">
                                  {connection.fromUserId.lastName}
                                </span>
                              </h2>

                              <div
                                className="
                    rounded-full border border-cyan-400/20
                    bg-cyan-500/10 px-3 py-1
                    text-xs text-cyan-300
                  "
                              >
                                Developer
                              </div>
                            </div>

                            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-300">
                              {connection.fromUserId.about ||
                                "Passionate developer building amazing products 🚀"}
                            </p>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
                          {/* Reject */}
                          <button
                            type="button"
                            onClick={() =>
                              reviewRequest("rejected", connection._id)
                            }
                            className="
                rounded-full border border-red-400/20
                bg-red-500/10 px-5 py-2
                text-sm font-medium text-red-300
                transition duration-300
                hover:scale-105
                hover:bg-red-500
                hover:text-white
              "
                          >
                            Reject
                          </button>

                          {/* Accept */}
                          <button
                            type="button"
                            onClick={() =>
                              reviewRequest("accepted", connection._id)
                            }
                            className="
                rounded-full bg-cyan-500
                px-5 py-2 text-sm
                font-semibold text-white
                transition duration-300
                hover:scale-105
                hover:bg-cyan-400
              "
                          >
                            Accept
                          </button>

                          {/* View */}
                          <Link
                            to="/profile/view"
                            state={{ user: connection.fromUserId }}
                            className="
                rounded-full border border-white/10
                bg-white/5 px-5 py-2
                text-sm text-slate-300
                transition duration-300
                hover:border-cyan-400/30
                hover:bg-cyan-500/10
                hover:text-cyan-300
              "
                          >
                            View Profile
                          </Link>

                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Requests;

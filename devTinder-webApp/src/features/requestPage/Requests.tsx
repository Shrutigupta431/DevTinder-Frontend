import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/constants/url";
import { addRequest } from "../../utils/slices/requestSlice";
import type { RootState } from "../../types/store.types";
import type { User } from "../../types/user.types";

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
console.log("requestList",requestList)
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

  const fetchRequests = async () => {
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

  const reviewRequest = async (status, _id) => {
    console.log("_id",_id)
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
    } catch (err) {}
  };
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8" data-theme="dark">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="overflow-hidden rounded-[30px] bg-gradient-to-r from-primary via-secondary to-accent p-6 shadow-2xl text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.4em] opacity-90">
                Connections Request
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 shadow-xl backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">
                Total profiles {requestList?.length ?? 0}
              </p>
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
            <div className="flex flex-col gap-6">
              {((filteredRequests ?? requestList) as any[])?.map(
                (connection) => (
                  <div
                    key={
                      connection.fromUserId._id ??
                      `${connection.fromUserId.firstName}-${connection.fromUserId.emailId}`
                    }
                    className="mx-auto w-full max-w-4xl overflow-hidden rounded-[30px] border border-base-200 bg-base-100 shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="rounded-t-[30px] bg-gradient-to-r from-primary via-secondary to-accent p-3 text-white shadow-inner">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-6">
                          <div className="avatar">
                            <div className="w-15 rounded-full ring ring-white/30 ring-offset-base-100 ring-offset-2">
                              <img
                                src={
                                  connection.fromUserId.photoUrl ||
                                  placeholderImage
                                }
                                alt={`${connection.fromUserId.firstName} ${connection.fromUserId.lastName ?? ""}`}
                              />
                            </div>
                          </div>
                          {/* Name */}
                          <span>
                            <h2 className="text-xl font-semibold tracking-tight">
                              {connection.fromUserId.firstName}{" "}
                              {connection.fromUserId.lastName}
                            </h2>
                            <p className="text-sm font-semibold tracking-tight">
                              {connection.fromUserId.about}{" "}
                            </p>
                          </span>
                        </div>

                        <span className="card-actions justify-end mt-1 gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              reviewRequest(
                                "rejected",
                                connection._id,
                              )
                            }
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              reviewRequest(
                                "accepted",
                                connection._id,
                              )
                            }
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-ghost"
                          >
                            View profile
                          </button>
                        </span>
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
  );
};

export default Requests;

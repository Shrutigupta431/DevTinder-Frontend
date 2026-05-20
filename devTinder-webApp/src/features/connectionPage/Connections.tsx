import axios from "axios";
import { type FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/constants/url";
import { addConnections } from "../../utils/slices/connectionSlice";
import type { RootState } from "../../types/store.types";
import type { User } from "../../types/user.types";

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
      const fullName = `${connection.firstName ?? ""} ${connection.lastName ?? ""}`.toLowerCase();
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
    <div className="min-h-screen bg-base-200 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="overflow-hidden rounded-[30px] bg-gradient-to-r from-primary via-secondary to-accent p-6 shadow-2xl text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.4em] opacity-90">
                My Connections
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight">
                Your network is growing.
              </h1>
              <p className="mt-4 text-base opacity-90">
                Discover your saved connections, explore what they bring to the
                table, and keep your network organized in one beautiful place.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 shadow-xl backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">
                Total profiles
              </p>
              <p className="mt-2 text-4xl font-bold">
                {connections?.length ?? 0}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, skill or bio"
                className="input input-bordered w-full"
              />
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredConnections?.length ?? 0} of{" "}
              {connections?.length ?? 0}
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-base-100 p-10 text-center shadow-lg">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error shadow-lg">{error}</div>
          ) : !connections || connections.length === 0 ? (
            <div className="rounded-3xl bg-base-100 p-10 text-center shadow-lg">
              <p className="text-xl font-semibold">No connections yet</p>
              <p className="mt-2 text-gray-500">
                Once you connect with someone, their profile cards will appear
                here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredConnections?.map((connection) => (
                <div
                  key={
                    connection._id ??
                    `${connection.firstName}-${connection.emailId}`
                  }
                  className="mx-auto w-full max-w-4xl overflow-hidden rounded-[30px] border border-base-200 bg-base-100 shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="rounded-t-[30px] bg-gradient-to-r from-primary via-secondary to-accent p-3 text-white shadow-inner">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                       
                        <div className="avatar">
                          <div className="w-15 rounded-full ring ring-white/30 ring-offset-base-100 ring-offset-2">
                            <img
                              src={connection.photoUrl || placeholderImage}
                              alt={`${connection.firstName} ${connection.lastName ?? ""}`}
                            />
                          </div>
                        </div>
                        {/* Name */}
                        <div>
                          <h2 className="text-xl font-semibold tracking-tight">
                            {connection.firstName} {connection.lastName}
                          </h2>
                          <p className="text-sm opacity-90">
                            {connection.emailId}
                          </p>
                          <p className="text-sm opacity-90">{connection.age}</p>
                        </div>
                      </div>

                      <span className="badge badge-outline badge-lg text-sm border-white/40 text-white/95 bg-white/10">
                        {connection.gender ?? "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-3">
                    {/* <div className="grid gap-3 sm:grid-cols-2 text-sm text-gray-600">
                      <div className="rounded-3xl bg-base-200 p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Age</p>
                        <p className="mt-1 text-lg font-semibold">{connection.age ?? "-"}</p>
                      </div>
                      <div className="rounded-3xl bg-base-200 p-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Joined</p>
                        <p className="mt-1 text-lg font-semibold">
                          {connection.createdAt ? new Date(connection.createdAt).toLocaleDateString() : "-"}
                        </p>
                      </div>
                    </div> */}

                    <p className="mt-1 text-sm text-gray-700 min-h-[2.5rem]">
                      {connection.about ?? "No bio available."}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-2">
                      {connection.skills && connection.skills.length > 0 ? (
                        connection.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="badge badge-secondary badge-outline"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          No skills listed
                        </span>
                      )}
                    </div>

                    <div className="card-actions justify-end mt-1 gap-2">
                      <button type="button" className="btn btn-sm btn-primary">
                        Message
                      </button>
                      <button type="button" className="btn btn-sm btn-ghost">
                        View profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Connections;

import { type FC } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../types/store.types";
import type { User } from "../types/user.types";

const Profile: FC = () => {
  const user = useSelector((store: RootState) => store?.user) as User | null;
  
  const navigate = useNavigate();
console.log("user",user)
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">No user data available</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">My Profile</h2>

            {/* Profile Header */}
            <div className="flex gap-6 mb-8 pb-6 border-b">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img
                    src={user.photoUrl || "https://via.placeholder.com/100"}
                    alt={user.firstName}
                  />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600">{user.emailId}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate("/profile/edit")}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Age</span>
                </label>
                <p className="text-lg">{user.age || "Not specified"}</p>
              </div>

              {/* Gender */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Gender</span>
                </label>
                <p className="text-lg">{user.gender || "Not specified"}</p>
              </div>

              {/* About */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">About</span>
                </label>
                <p className="text-lg">{user.about || "No bio added"}</p>
              </div>

              {/* Skills */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Skills</span>
                </label>
                {user.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.skills.map((skill, index) => (
                      <div key={index} className="badge badge-primary">
                        {skill}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg">No skills added</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

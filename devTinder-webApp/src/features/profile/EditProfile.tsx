import { type FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios, { type AxiosError } from "axios";
import type { RootState } from "../../types/store.types";
import type { User } from "../../types/user.types";
import type { ApiError } from "../../types/api.types";
import type { ProfileUpdateData } from "../../types/profile.types";
import { BASE_URL } from "../../utils/constants/url";
import { addUser } from "../../utils/slices/userSlice";
import UserCard from "../../components/UserCard";

const EditProfile: FC = () => {
  const user = useSelector((store: RootState) => store.user) as User | null;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const normalizeGender = (gender?: string) => {
    if (!gender) return "";
    const normalized = gender.toLowerCase();
    return normalized === "male" || normalized === "female" || normalized === "other"
      ? normalized
      : gender;
  };

  const [formData, setFormData] = useState<ProfileUpdateData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age,
    gender: normalizeGender(user?.gender),
    about: user?.about || "",
    skills: user?.skills || [],
    photoUrl: user?.photoUrl || "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold">Please login first</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "age" ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index),
    }));
  };

  const previewUser: User = {
    ...user,
    ...formData,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await axios.put(
        BASE_URL + "/profile/edit",
        formData,
        { withCredentials: true }
      );

      if (res.data) {
        dispatch(addUser(res?.data?.data));
        setSuccess(true);
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || "Failed to update profile";
      setError(message);
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
    
    <div className="flex justify-center p-5 min-h-screen bg-base-200">
      <div className="card card-side bg-base-100 shadow-sm w-full max-w-5xl">
        <UserCard user={previewUser} />

        <div className="card-body flex-1 p-8">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend font-bold text-xl">Profile Details</legend>

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success mb-4">
                <span>Profile updated successfully! Redirecting...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">First Name *</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Photo URL</span>
                  </label>
                  <input
                    type="url"
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleInputChange}
                    placeholder="Photo URL"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Age</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age || ""}
                    onChange={handleInputChange}
                    placeholder="Age"
                    className="input input-bordered"
                    min="18"
                    max="100"
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">Gender</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">About</span>
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  className="textarea textarea-bordered h-32"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Skills</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Add a skill"
                    className="input input-bordered flex-1"
                  />
                  <button
                    type="button"
                    className="btn btn-neutral"
                    onClick={handleAddSkill}
                  >
                    Add
                  </button>
                </div>
                {formData.skills && formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="badge badge-outline gap-2">
                        {skill}
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={() => handleRemoveSkill(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-neutral flex-1"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline flex-1"
                  onClick={() => navigate("/profile")}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
    </div>
    
    </>
  );
};

export default EditProfile;
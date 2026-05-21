import { type FC } from "react";
import type { User } from "../types/user.types";
import axios from "axios";
import { removeFromFeed } from "../utils/slices/feedSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants/url";

interface UserCardProps {
  user: User;
}

const UserCard: FC<UserCardProps> = ({ user }) => {
  const dispatch = useDispatch();
  const { firstName, lastName, skills, about, _id } = user;

  const handleSendRequestFrom = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );
      console.log(res);
      dispatch(removeFromFeed(_id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img
            src={
              user.photoUrl ||
              "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            }
            alt={`${firstName} ${lastName}`}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {firstName} {lastName}
            <div className="badge badge-secondary">NEW</div>
          </h2>
          <p>{about || "No description"}</p>
          {skills && skills.length > 0 && (
            <div className="card-actions justify-end flex-wrap">
              {skills.map((skill, index) => (
                <div key={index} className="badge badge-outline">
                  {skill}
                </div>
              ))}
            </div>
          )}
          <span className="card-actions justify-end mt-1 gap-2">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => handleSendRequestFrom("ignored", _id)}
            >
              Ignore
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => handleSendRequestFrom("interested", _id)}
            >
              Interested
            </button>
          </span>
        </div>
      </div>
    </>
  );
};

export default UserCard;

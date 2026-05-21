import { type FC } from "react";
import type { User } from "../types/user.types";
// import axios from "axios";
// import { removeFromFeed } from "../utils/slices/feedSlice";
// import { useDispatch } from "react-redux";
// import { BASE_URL } from "../utils/constants/url";
import { Code2 } from "lucide-react";

interface UserCardProps {
  user: User;
}

const UserCard: FC<UserCardProps> = ({ user }) => {

  const {
    firstName,
    lastName,
    skills,
    about,
    photoUrl,
  } = user;

  // const handleSendRequestFrom = async (
  //   status: string,
  //   userId: string
  // ) => {
  //   try {
  //     await axios.post(
  //       BASE_URL + "/request/send/" + status + "/" + userId,
  //       {},
  //       { withCredentials: true }
  //     );

  //     dispatch(removeFromFeed(_id));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div
      className="
      group relative w-[340px] overflow-hidden rounded-[30px]
      border border-white/10 bg-white/5 p-4
      shadow-2xl backdrop-blur-xl
      transition-all duration-500
      hover:-translate-y-3
      hover:border-cyan-400/40
      hover:shadow-[0_0_50px_rgba(34,211,238,0.25)]
    "
    >
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 transition duration-500 group-hover:opacity-100"></div>

      {/* Profile Image */}
      <div className="relative flex justify-center">
        
        <div className="relative mt-2">
          
          <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-400/20 blur-xl"></div>

          <img
            src={
              photoUrl ||
              "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            }
            alt={`${firstName} ${lastName}`}
            className="
              relative z-10 h-32 w-32 rounded-full
              border-4 border-cyan-400/40
              object-cover shadow-lg
              transition duration-500
              group-hover:scale-105
            "
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-5 text-center">
        
        {/* Name */}
        <h2 className="text-3xl font-extrabold tracking-wide text-white">
          {firstName}{" "}
          <span className="text-cyan-400">{lastName}</span>
        </h2>

        {/* Developer Badge */}
        <div className="mt-3 flex justify-center">
          
          <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-sm font-medium text-cyan-300">
            
            <Code2 size={16} />

            Developer
          </div>
        </div>

        {/* About */}
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-300">
          {about ||
            "Passionate developer who loves building scalable and modern applications 🚀"}
        </p>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            
            {skills.slice(0, 6).map((skill, index) => (
              <div
                key={index}
                className="
                  rounded-full border border-white/10
                  bg-white/5 px-3 py-1
                  text-xs font-medium text-slate-200
                  transition duration-300
                  hover:border-cyan-400/50
                  hover:bg-cyan-500/10
                  hover:text-cyan-300
                "
              >
                {skill}
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-7 flex items-center justify-center gap-6">
          
          {/* Ignore */}
          {/* <button
            type="button"
            onClick={() =>
              handleSendRequestFrom("ignored", _id)
            }
            className="
              group/btn flex items-center gap-2 rounded-full
              bg-red-500/10 px-5 py-3
              text-red-400 backdrop-blur-md
              transition duration-300
              hover:scale-110 hover:bg-red-500
              hover:text-white
            "
          >
            <X size={18} />

            Ignore
          </button> */}

          {/* Interested */}
          {/* <button
            type="button"
            onClick={() =>
              handleSendRequestFrom("interested", _id)
            }
            className="
              group/btn flex items-center gap-2 rounded-full
              bg-cyan-500/10 px-5 py-3
              text-cyan-400 backdrop-blur-md
              transition duration-300
              hover:scale-110 hover:bg-cyan-500
              hover:text-white
            "
          >
            <Heart size={18} />

            Interested
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
import { type FC } from 'react';
import type { User } from '../types/user.types';

interface UserCardProps {
  user: User;
}

const UserCard: FC<UserCardProps> = ({ user }) => {
  const { firstName, lastName, skills, about } = user;

  return (
    <>
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img
            src={user.photoUrl || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
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
        </div>
      </div>
    </>
  );
};

export default UserCard;
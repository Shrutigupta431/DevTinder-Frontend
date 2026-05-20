import { useEffect, type FC } from 'react';
import { BASE_URL } from '../../utils/constants/url';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../../utils/slices/feedSlice';
import UserCard from '../../components/UserCard';
import type { RootState } from '../../types/store.types';
import type { User } from '../../types/user.types';

const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store: RootState) => (store as any).feed);
  console.log("feed", feed);

  const getFeed = async () => {
    try {
      if (feed) return;
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Feed error:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-5 my-10">
      {feed && feed?.data?.map((user: User) => (
        <div key={user._id} className="flex m-5">
          <UserCard user={user} />
        </div>
      ))}
    </div>
  );
};

export default Feed;
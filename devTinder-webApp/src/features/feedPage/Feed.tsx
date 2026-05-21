import { useEffect, type FC } from 'react';
import { BASE_URL } from '../../utils/constants/url';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../../utils/slices/feedSlice';
import UserCard from '../../components/UserCard';
import type { RootState } from '../../types/store.types';
// import type { User } from '../../types/user.types';

const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store: RootState) => (store as any).feed);
  console.log("feed", feed);

  const getFeed = async () => {
    try {
      if (feed) return;
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data.data));
    } catch (err) {
      console.error("Feed error:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);
if (feed&& feed?.length <= 0)
    return <h1 className="flex justify-center my-10">No new users founds!</h1>;
  return (
    feed &&(

    <div className="flex flex-wrap justify-center gap-5 my-10">
       <UserCard user={feed[0]} />
    
    </div>
    )
  );
};

export default Feed;
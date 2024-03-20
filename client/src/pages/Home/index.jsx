import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingAnimation from "src/components/LoadingAnimation";
import NewPostWidget from "src/features/post/components/NewPostWidget";
import Post from "src/features/post/components/Post";
import useSWR from "swr";
import FeedSelection from "./FeedSelection";

const fetcher = (url) => fetch(url).then((res) => res.json());

const HomePage = () => {
  const { id, profile_img_key } = useSelector((state) => state.user.user);
  const [postType, setPostType] = useState("feed");

  const key =
    postType === "feed" ? "http://localhost:6001/posts/" : `http://localhost:6001/users/${id}/feed`;

  const { data, isLoading } = useSWR(key, fetcher);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [postType]);

  return (
    <Box>
      <FeedSelection postType={postType} setPostType={setPostType} />
      <NewPostWidget profile_img_key={profile_img_key} />
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        data?.map((post) => (
          <Post key={post.id} post={post} mutateKey={"http://localhost:6001/posts/"} />
        ))
      )}
    </Box>
  );
};

export default HomePage;

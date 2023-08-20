import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const [posts, setPosts] = useState({});
  const allPosts = useSelector((state) => state.posts.posts);
  const token = useSelector((state) => state.user.token);
  const [isLoading, setIsLoading] = useState(true);

  /* Do not dispatch get user posts to store */
  const getUserPosts = async () => {
    const response = await fetch(`http://localhost:3001/posts/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setPosts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      setPosts(allPosts);
      setIsLoading(false);
    }
  }, [allPosts]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!isLoading &&
        posts.map(
          ({
            _id,
            userId,
            content,
            location,
            pictureKey,
            likes,
            comments,
            createdAt,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              content={content}
              location={location}
              postPictureKey={pictureKey}
              likes={likes}
              comments={comments}
              createdAt={createdAt}
            />
          )
        )}
    </>
  );
};

export default PostsWidget;

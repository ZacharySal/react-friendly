import { useEffect, useState } from "react";
import { setPosts } from "state";
import { useDispatch, useSelector } from "react-redux";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const [isLoading, setIsLoading] = useState(true);

  /* TODO: use async thunk in posts slice instead */

  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
    setIsLoading(false);
  };

  const getUserPosts = async () => {
    const response = await fetch(`http://localhost:3001/posts/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
    setIsLoading(false);
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* In our post model we have: userId, location, content, picturePath, likes, comments */

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
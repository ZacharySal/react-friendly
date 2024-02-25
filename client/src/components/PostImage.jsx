const PostImage = ({ post_picture_key }) => {
  return (
    <img
      width="100%"
      height="auto"
      alt=""
      style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
      src={`http://localhost:6001/posts/image/${post_picture_key}`}
    />
  );
};

export default PostImage;

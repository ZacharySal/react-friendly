const UserImage = ({ picture_key, size = "60px" }) => {
  return (
    <img
      style={{ objectFit: "cover", borderRadius: "50%", zIndex: "10" }}
      width={size}
      height={size}
      alt="user"
      src={`http://localhost:6001/posts/image/${picture_key}`}
    />
  );
};

export default UserImage;

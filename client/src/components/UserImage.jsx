import { Link } from "react-router-dom";
const UserImage = ({ profile_img_key, user_id, size = "60px" }) => {
  return (
    <Link to={`/profile/${user_id}`}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%", zIndex: "10" }}
        width={size}
        height={size}
        alt="user"
        src={`http://localhost:6001/posts/image/${profile_img_key}`}
      />
    </Link>
  );
};

export default UserImage;

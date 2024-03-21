import { useNavigate } from "react-router-dom";
import { API_URL } from "src/utils/misc";

const UserImage = ({ profile_img_key, id, size = "60px" }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${id}`);
  };
  return (
    <img
      onClick={handleClick}
      style={{
        objectFit: "cover",
        borderRadius: "50%",
        zIndex: "10",
        cursor: "pointer",
      }}
      width={size}
      height={size}
      alt="user"
      src={`${API_URL}/image/${profile_img_key}`}
    />
  );
};

export default UserImage;

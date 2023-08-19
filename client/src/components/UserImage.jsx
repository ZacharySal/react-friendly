import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, IconButton, useTheme } from "@mui/material";

const UserImage = ({
  pictureKey,
  size = "60px",
  isSelf,
  isPost = false,
  isFriend,
  authorId,
  patchFriend,
}) => {
  const { palette } = useTheme();

  console.log("Post picture key in user image widget: ", pictureKey);

  return (
    <Box position="relative" width={size} height={size}>
      {pictureKey && (
        <img
          style={{ objectFit: "cover", borderRadius: "50%" }}
          width={size}
          height={size}
          alt="user"
          src={`http://localhost:3001/posts/image/${pictureKey}`}
        />
      )}
      {isPost && !isSelf && (
        <IconButton
          onClick={() => patchFriend(authorId)}
          size="medium"
          edge="start"
          sx={{
            position: "absolute",
            borderRadius: "2rem",
            bottom: "-12px",
            right: "-8px",
            fontSize: "25px",
          }}
        >
          {isFriend ? (
            <RemoveCircleIcon
              fontSize="inherit"
              sx={{
                color: palette.primary.main,
                backgroundColor: "white",
                borderRadius: "2rem",
              }}
            />
          ) : (
            <AddCircleIcon
              fontSize="inherit"
              sx={{
                color: palette.primary.main,
                backgroundColor: "white",
                borderRadius: "2rem",
              }}
            />
          )}
        </IconButton>
      )}
    </Box>
  );
};

export default UserImage;

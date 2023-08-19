import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, Typography, useTheme } from "@mui/material";

const UserImage = ({ pictureKey, size = "60px", isSelf, isPost = false }) => {
  const { palette } = useTheme();
  return (
    <Box position="relative" width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`http://localhost:3001/posts/image/${pictureKey}`}
      />
      {isPost && !isSelf && (
        <IconButton
          sx={{
            position: "absolute",
            backgroundColor: palette.primary.light,
            borderRadius: "2rem",
            bottom: "-5px",
            right: 0,
          }}
        >
          <AddCircleIcon
            sx={{
              color: palette.primary.dark,
            }}
          />
        </IconButton>
      )}
    </Box>
  );
};

export default UserImage;

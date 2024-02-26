import { Box, Button, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import FlexBetween from "./FlexBetween";

const ProfileInfo = ({ user, contentCategory, setContentCategory }) => {
  const { palette } = useTheme();
  const { id } = useSelector((state) => state.user.user);

  const isSelf = id === user.id;

  return (
    <Box display="flex" flexDirection="column">
      <img
        src="../assets/profile-bg.png"
        style={{ maxWidth: "100%", maxHeight: "160px", objectFit: "cover" }}
      />
      <Box px="1rem">
        <FlexBetween marginTop="-0.8rem">
          <Box height="80px" width="80px" position="relative" borderRadius="100vw">
            <Box
              sx={{ position: "absolute", top: "-20px" }}
              borderRadius="100vw"
              width="100%"
              height="100%"
              backgroundColor={palette.background.default}
            />
            <img
              src={`http://localhost:6001/posts/image/${user.picture_key}`}
              style={{
                height: "80px",
                width: "80px",
                borderRadius: "100vw",
                objectFit: "cover",
                position: "absolute",
                border: `1px solid ${palette.background.default}`,
                top: "-20px",
                left: 0,
              }}
            />
          </Box>
          <Button
            sx={{
              color: palette.neutral.lightest,
              backgroundColor: palette.neutral.darkest,
              borderRadius: "3rem",
              padding: "0.5rem 1.25rem",
              textTransform: "none",
              marginLeft: "auto",
              "&:hover": {
                color: palette.neutral.lightest,
                backgroundColor: palette.neutral.dark,
              },
            }}
          >
            <Typography variant="h5" fontWeight="600">
              {isSelf ? "Set up profile" : "Follow"}
            </Typography>
          </Button>
        </FlexBetween>
        <Typography variant="h3" fontWeight="600">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="h5" color={palette.neutral.medium}>
          @{user.display_name}
        </Typography>
        <Box mt="0.75rem" display="flex" flexDirection="column" gap="0.5rem">
          {/* BIO */}
          <Typography variant="h5">
            This is where the users bio would go if that feature was implemented...
          </Typography>
          <Box display="flex" alignItems="center" gap="1rem">
            <Typography variant="h6" fontWeight="600">
              753{" "}
              <span style={{ color: palette.neutral.medium, fontWeight: "400" }}>Followers</span>
            </Typography>
            <Typography variant="h6" fontWeight="600">
              5.3K{" "}
              <span style={{ color: palette.neutral.medium, fontWeight: "400" }}>Following</span>
            </Typography>
          </Box>
          {/* <Typography variant="h6" color={palette.neutral.medium}>
            Not followed by anyone you are following
          </Typography> */}
        </Box>
      </Box>
      <Box mt="1rem" borderBottom={`1px solid ${palette.neutral.light}`}>
        <Box display="flex" justifyContent="flex-start">
          <Box
            onClick={() => setContentCategory("posts")}
            display="flex"
            justifyContent="center"
            sx={{
              color: contentCategory === "posts" ? "" : palette.neutral.medium,
              padding: "1rem",
              letterSpacing: "-0.4px",
              borderBottom: contentCategory === "posts" ? `3px solid ${palette.primary.main}` : "",
              borderWidth: "50%",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: palette.neutral.light,
                cursor: "pointer",
              },
            }}
          >
            <Typography variant="h5" fontWeight="600">
              Posts
            </Typography>
          </Box>
          <Box
            onClick={() => setContentCategory("replies")}
            display="flex"
            justifyContent="center"
            sx={{
              color: contentCategory === "replies" ? "" : palette.neutral.medium,
              padding: "1rem",
              letterSpacing: "-0.4px",
              cursor: "pointer",
              borderBottom:
                contentCategory === "replies" ? `3px solid ${palette.primary.main}` : "",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: palette.neutral.light,
              },
            }}
          >
            <Typography variant="h5" fontWeight="600">
              Replies
            </Typography>
          </Box>
          <Box
            onClick={() => setContentCategory("reposts")}
            display="flex"
            justifyContent="center"
            sx={{
              color: contentCategory === "reposts" ? "" : palette.neutral.medium,
              padding: "1rem",
              letterSpacing: "-0.4px",
              cursor: "pointer",
              borderBottom:
                contentCategory === "reposts" ? `3px solid ${palette.primary.main}` : "",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: palette.neutral.light,
              },
            }}
          >
            <Typography variant="h5" fontWeight="600">
              Reposts
            </Typography>
          </Box>
          <Box
            onClick={() => setContentCategory("media")}
            display="flex"
            justifyContent="center"
            sx={{
              color: contentCategory === "media" ? "" : palette.neutral.medium,
              padding: "1rem",
              letterSpacing: "-0.4px",
              cursor: "pointer",
              borderBottom: contentCategory === "media" ? `3px solid ${palette.primary.main}` : "",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: palette.neutral.light,
              },
            }}
          >
            <Typography variant="h5" fontWeight="600">
              Media
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileInfo;

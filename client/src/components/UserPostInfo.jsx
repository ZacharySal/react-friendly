import { Box, Typography, useTheme } from "@mui/material";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Link } from "react-router-dom";
import UserImage from "./UserImage";

const UserPostInfo = ({ author, post }) => {
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");
  const time = timeAgo.format(new Date(post.created_at), "twitter");

  const { palette } = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
      }}
    >
      <UserImage picture_key={author.picture_key} size="40px" />
      <Link sx={{ width: "100%" }} to={`/profile/${author.id}`}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minwidth: "100%",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="500"
              marginRight="0.25rem"
              // sx={{
              //   marginLeft: "-0.3rem",
              //   "&:hover": {
              //     color: palette.primary.main,
              //     cursor: "pointer",
              //   },
              // }}
            >
              {`${author.first_name} ${author.last_name}`}
            </Typography>
            <Typography variant="h6" color={palette.neutral.medium}>
              {` @${author.display_name} ∙`}
            </Typography>
            <Typography variant="h6" color={palette.neutral.medium}>
              {time ?? ""}
            </Typography>
          </Box>
        </Box>
        <Typography color={palette.neutral.main} sx={{ mt: "1rem" }}>
          {post.content}
        </Typography>
      </Link>
    </Box>
  );
};

export { UserPostInfo as FriendInfo };
export default UserPostInfo;

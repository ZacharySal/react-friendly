import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "app/userSlice";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const UserPostInfo = ({
  authorId,
  name,
  subtitle,
  pictureKey,
  time = null,
  isPost = true,
}) => {
  console.log("Picture key in user post info:", pictureKey);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUserId = useSelector((state) => state.user.user._id);
  const token = useSelector((state) => state.user.token);
  const friends = useSelector((state) => state.user.user.friends);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  /* TODO: Check this functionality */
  const isFriend = friends.find((friend) => friend._id === authorId);
  const isSelf = authorId === loggedInUserId;

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${loggedInUserId}/${authorId}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "application/json",
      }
    );
    const data = await response.json();
    dispatch(setUser({ data }));
  };

  return (
    <FlexBetween>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          gap: "1rem",
        }}
      >
        <UserImage
          pictureKey={pictureKey}
          size="55px"
          isSelf={isSelf}
          isPost={isPost}
          isFriend={isFriend}
          authorId={authorId}
          patchFriend={patchFriend}
        />
        <Box
          sx={{ width: "100%" }}
          onClick={() => {
            navigate(`/profile/${authorId}`);
            /* TODO: Investigate hack */
          }}
        >
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
                gap: "0.25rem",
              }}
            >
              <Typography
                color={main}
                variant="h5"
                fontWeight="500"
                sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}
              >
                {name}
              </Typography>
            </Box>
            {time ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    gap: "0.25rem",
                    flexDirection: "row",
                    color: palette.neutral.mediumMain,
                  }}
                >
                  <AccessTimeIcon />
                  <Typography variant="h6" fontWeight="300">
                    {time}
                  </Typography>
                </Box>
              </>
            ) : null}
          </Box>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </FlexBetween>
  );
};

export { UserPostInfo as FriendInfo };
export default UserPostInfo;

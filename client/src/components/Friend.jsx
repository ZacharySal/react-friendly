import {
  PaletteRounded,
  PersonAddOutlined,
  PersonRemoveOutlined,
} from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";

const Friend = ({
  friendId,
  name,
  subtitle,
  pictureKey,
  time = null,
  isPost = true,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  console.log(`Logged in id: ${_id}`);
  console.log(`Friend Id: ${friendId}`);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  console.log(`Friends: ${JSON.stringify(friends)}`);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  /* TODO: Check this functionality */
  const isFriend = friends.find((friend) => friend._id === friendId);
  const isSelf = friendId === _id;

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "application/json",
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
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
          friendId={friendId}
          patchFriend={patchFriend}
        />
        <Box
          sx={{ width: "100%" }}
          onClick={() => {
            navigate(`/profile/${friendId}`);
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

export default Friend;

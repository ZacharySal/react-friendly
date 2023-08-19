import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/UserPostInfo";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "app/userSlice";

const FriendListWidget = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.user.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    console.log("Getting friends");
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setIsLoading(false);
    console.log(`Friends data recieved from server: ${data}`);
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!isLoading && (
        <WidgetWrapper>
          <Typography
            color={palette.neutral.dark}
            variant="h5"
            fontWeight="500"
            sx={{ mb: "1.5rem" }}
          >
            Friend List
          </Typography>
          <Box display="flex" flexDirection="column" gap="1.5rem">
            {friends.map((friend) => (
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                pictureKey={friend.pictureKey}
                isPost={false}
              />
            ))}
          </Box>
        </WidgetWrapper>
      )}
    </>
  );
};

export default FriendListWidget;

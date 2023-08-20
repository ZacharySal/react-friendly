import { Box, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { FriendInfo } from "components/UserPostInfo";
import WidgetWrapper from "components/WidgetWrapper";

const FriendListWidget = ({ userId }) => {
  const [friends, setFriends] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { palette } = useTheme();

  const loggedInUserId = useSelector((state) => state.user.user._id);
  const loggedInUserFriends = useSelector((state) => state.user.user.friends);
  const token = useSelector((state) => state.user.token);

  const isLoggedInUser = userId === loggedInUserId;

  // we only need to get friends if the friend list widget is not for the logged in user, do not dispatch to store
  const getFriends = async () => {
    const response = await fetch(
      `https://twitter-clone-node-server-production.up.railway.app/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setFriends(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoggedInUser) {
      setFriends(loggedInUserFriends);
      setIsLoading(false);
    } else {
      getFriends();
    }
  }, [loggedInUserFriends]); //eslint-disable-line react-hooks/exhaustive-deps

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
              <FriendInfo
                key={friend._id}
                authorId={friend._id}
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

import { Box, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { FriendInfo } from "components/UserPostInfo";
import WidgetWrapper from "components/WidgetWrapper";

const FriendListWidget = ({ userId }) => {
  const [friends, setFriends] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { palette } = useTheme();

  const loggedInUserId = useSelector((state) => state.user.user.id);
  const loggedInUserFriends = useSelector((state) => state.user.user.friends);
  const token = useSelector((state) => state.user.token);

  const isLoggedInUser = userId === loggedInUserId;

  // we only need to get friends if the friend list widget is not for the logged in user, do not dispatch to store
  const getFriends = async () => {
    const response = await fetch(`http://localhost:6001/users/${userId}/friends`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
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
      {!isLoading && friends.length > 0 && (
        <WidgetWrapper>
          <Typography
            color={palette.neutral.dark}
            variant="h5"
            fontWeight="500"
            sx={{ mb: "1rem" }}
          >
            Friend List
          </Typography>
          <Box display="flex" flexDirection="column" gap="1.5rem">
            {friends &&
              friends.map((friendInfo) => (
                <FriendInfo
                  key={friendInfo.friend.id}
                  authorId={friendInfo.friend.id}
                  name={`${friendInfo.friend.first_name} ${friendInfo.friend.last_name}`}
                  subtitle={friendInfo.friend.occupation}
                  picture_key={friendInfo.friend.picture_key}
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

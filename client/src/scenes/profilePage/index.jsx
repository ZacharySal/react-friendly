import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import NewPostWidget from "scenes/widgets/NewPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserInfoWidget from "scenes/widgets/UserInfoWidget";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const loggedInUserId = useSelector((state) => state.user.user._id);
  const token = useSelector((state) => state.user.token);
  const isDesktopScreen = useMediaQuery("(min-width:1000px)");

  const isSelf = loggedInUserId === userId;
  const getUser = async () => {
    const response = await fetch(
      `https://twitter-clone-node-server-production.up.railway.app/users/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setIsLoading(false);
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!isLoading && (
        <Box>
          <Navbar />
          <Box
            width="100%"
            padding="2rem 6%"
            display={isDesktopScreen ? "flex" : "block"}
            gap="2rem"
            justifyContent="center"
          >
            <Box flexBasis={isDesktopScreen ? "26%" : undefined}>
              <UserInfoWidget userId={userId} pictureKey={user.pictureKey} />
              <Box m="2rem 0" />
              <FriendListWidget userId={userId} />
            </Box>
            <Box
              flexBasis={isDesktopScreen ? "42%" : undefined}
              mt={isDesktopScreen ? undefined : "2rem"}
            >
              {isSelf && (
                <>
                  <NewPostWidget pictureKey={user.pictureKey} />
                  <Box m="2rem 0" />
                </>
              )}
              <PostsWidget userId={userId} isProfile={"true"} />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProfilePage;

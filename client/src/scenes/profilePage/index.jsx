import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import NewPostWidget from "scenes/widgets/NewPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserInfoWidget from "scenes/widgets/UserInfoWidget";
import useSWR from "swr";

const fetcher = async (params) => {
  const [url, token] = params;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return data;
};

const ProfilePage = () => {
  const { user_id } = useParams();
  const loggedInUserId = useSelector((state) => state.user.user.id);
  const token = useSelector((state) => state.user.token);
  const isDesktopScreen = useMediaQuery("(min-width:1000px)");
  const isSelf = loggedInUserId === user_id;

  const { data: user, loading } = useSWR(
    [user_id ? `http://localhost:6001/users/${user_id}` : null, token],
    fetcher
  );

  return (
    <Box key={user_id}>
      {!loading && user && (
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
              <UserInfoWidget key={user_id} userId={user_id} picture_key={user.picture_key} />
              <Box m="2rem 0" />
              {user.friends.length > 0 && <FriendListWidget key={user_id} userId={user_id} />}
            </Box>
            <Box
              flexBasis={isDesktopScreen ? "42%" : undefined}
              mt={isDesktopScreen ? undefined : "2rem"}
            >
              {isSelf && (
                <>
                  <NewPostWidget picture_key={user.picture_key} />
                </>
              )}
              <PostsWidget posts={user.posts} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProfilePage;

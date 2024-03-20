import { useTheme } from "@emotion/react";
import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingAnimation from "src/components/LoadingAnimation";
import Post from "src/features/post/components/Post";
import PostTypeSelector from "src/features/profile/components/PostTypeSelector";
import ProfileInfo from "src/features/profile/components/ProfileInfo";
import useSWR from "swr";
import UserMedia from "./UserMedia";

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
  const { palette } = useTheme();

  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("posts");

  const key = `http://localhost:6001/users/${user_id}`;
  const { data: user, isLoading } = useSWR([key, token], fetcher);

  let selectedMedia = [];

  if (!isLoading && selectedType !== "media") {
    selectedMedia =
      selectedType === "posts"
        ? user.posts
        : selectedType === "replies"
          ? user.posts.filter((post) => post.parent_id !== null && !post.isRepost)
          : user.posts.filter((post) => post.isRepost);
  }

  return (
    <Box>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <Box mt="1rem">
          {/* TOP NAV */}
          <Box className="mb-2 flex items-center md:mb-4 md:gap-4 md:px-4">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="500">
              {`${user.first_name} ${user.last_name}`}{" "}
            </Typography>
          </Box>
          <ProfileInfo user={user} />
          <PostTypeSelector selectedType={selectedType} setSelectedType={setSelectedType} />
          {selectedType === "media" ? (
            <UserMedia user_id={user_id} />
          ) : (
            selectedMedia?.map((post) => (
              <Post key={post.id} post={post} mutateKey={[key, token]} />
            ))
          )}
          {selectedMedia.length === 0 && selectedType !== "media" && (
            <Box className="mt-10 flex justify-center">
              <Typography variant="h4" fontWeight="500" color={palette.neutral.medium}>
                No posts to view
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProfilePage;

import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import Layout from "components/Layout";
import ProfileInfo from "components/ProfileInfo";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PostsWidget from "scenes/widgets/PostsWidget";
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
  const navigate = useNavigate();
  const [contentCategory, setContentCategory] = useState("posts");

  const key = `http://localhost:6001/users/${user_id}`;

  const { data: user, isLoading } = useSWR([key, token], fetcher);

  let posts;

  if (!isLoading) {
    console.log(user);
    posts =
      contentCategory === "posts"
        ? user.posts
        : contentCategory === "replies"
        ? user.posts.filter((post) => post.parent_id !== null && !post.isRepost)
        : user.posts.filter((post) => post.isRepost);
  }

  return (
    <Layout key={user_id}>
      {!isLoading && user && (
        <Box mt="1rem">
          {/* TOP NAV */}
          <Box padding="0rem 1rem" display="flex" alignItems="center" gap="1rem" mb="1rem">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="500">
              {`${user.first_name} ${user.last_name}`}{" "}
              {/* <span style={{ color: palette.neutral.medium, fontSize: "16px" }}>
                {user.posts?.length || "0"} posts
              </span> */}
            </Typography>
          </Box>
          <ProfileInfo
            user={user}
            contentCategory={contentCategory}
            setContentCategory={setContentCategory}
          />
          <PostsWidget posts={posts} mutateURL={[key, token]} />
        </Box>
      )}
    </Layout>
  );
};

export default ProfilePage;

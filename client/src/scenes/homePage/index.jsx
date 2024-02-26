import { Box, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout";
import NewPostWidget from "../widgets/NewPostWidget";
import PostsWidget from "../widgets/PostsWidget";

const HomePage = () => {
  const { picture_key } = useSelector((state) => state.user.user);
  const posts = useSelector((state) => state.posts.posts);
  const { palette } = useTheme();
  const [postType, setPostType] = useState("feed");

  return (
    <Layout>
      <Box width="100%" height="100vh" display="block" overflow="auto">
        <Box
          position="sticky"
          width="100%"
          top="0"
          display="block"
          zIndex="20"
          left="0"
          borderBottom={`1px solid ${palette.neutral.light}`}
          sx={{
            backgroundColor: palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.4)",
            backdropFilter: "blur(15px)",
          }}
        >
          <Box display="flex" justifyContent="space-evenly">
            <Box
              onClick={() => setPostType("feed")}
              display="flex"
              justifyContent="center"
              sx={{
                minWidth: "50%",
                padding: "1rem",
                letterSpacing: "-0.4px",
                borderBottom: postType === "feed" ? `3px solid ${palette.primary.main}` : "",
                borderWidth: "50%",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: palette.neutral.light,
                  cursor: "pointer",
                },
              }}
            >
              <Typography variant="h5" fontWeight="600">
                For you
              </Typography>
            </Box>
            <Box
              onClick={() => setPostType("following")}
              display="flex"
              justifyContent="center"
              sx={{
                minWidth: "50%",
                padding: "1rem",
                letterSpacing: "-0.4px",
                cursor: "pointer",
                borderBottom: postType === "following" ? `3px solid ${palette.primary.main}` : "",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: palette.neutral.light,
                },
              }}
            >
              <Typography variant="h5" fontWeight="600">
                Following
              </Typography>
            </Box>
          </Box>
        </Box>
        <NewPostWidget picture_key={picture_key} />
        <PostsWidget posts={posts} />
      </Box>
    </Layout>
  );
};

export default HomePage;

import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import PostWidget from "./PostWidget";

const PostsWidget = ({ posts, mutateURL, isPostPage = false }) => {
  const { palette } = useTheme();

  return (
    <Box width="100%">
      {posts?.map((post) => (
        <PostWidget key={post.id} post={post} mutateURL={mutateURL} isPostPage={isPostPage} />
      ))}
      {posts.length === 0 && (
        <Box
          minWidth="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="5rem"
        >
          <Typography variant="h5" color={palette.neutral.medium}>
            {true ? "Create posts to view them here" : "This user has not created any posts"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PostsWidget;

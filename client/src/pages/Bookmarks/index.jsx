import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "src/components/LoadingAnimation";
import Post from "src/features/post/components/Post";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());
const BookmarksPage = () => {
  const { id } = useSelector((state) => state.user.user);
  const { data: posts, isLoading } = useSWR(
    `http://localhost:6001/users/${id}/savedPosts`,
    fetcher
  );

  const navigate = useNavigate();
  const { palette } = useTheme();

  return (
    <Box className="mt-1 min-h-[1056px]">
      <Box>
        {/* TOP NAV */}
        <Box
          borderBottom={`1px solid ${palette.neutral.light}`}
          className="flex items-center gap-2 px-0 pb-2 md:gap-4 md:px-4"
        >
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="700">
            Bookmarks
          </Typography>
        </Box>
        {/* SAVED POSTS */}
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          posts.map((post) => (
            <Post
              key={post.post.id}
              post={post.post}
              mutateKey={`http://localhost:6001/users/${id}/savedPosts`}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default BookmarksPage;

import {
  BookmarkBorder,
  CachedOutlined,
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostStatistic from "src/features/post/components/PostStatistic";
import { handleLikePost, handleSavePost } from "src/features/post/store/actions";
import { hoverEffectCSS } from "src/utils/misc";

const InteractionRow = ({ post }) => {
  const { palette } = useTheme();
  const id = useSelector((state) => state.user.user.id);
  const { post_id } = useParams();
  const isLiked = Boolean(post?.likes.some((like) => like.user_id === id));
  const isSaved = Boolean(post?.saves.some((save) => save.user_id === id));
  return (
    <Box
      className="mb-2 mt-4 py-2 "
      borderTop={`1px solid ${palette.neutral.light}`}
      borderBottom={`1px solid ${palette.neutral.light}`}
    >
      <Box className="flex items-start gap-6 pl-3 md:gap-12">
        <PostStatistic hoverColor={palette.primary.main} name="Replies">
          <ChatBubbleOutlineOutlined sx={{ color: palette.neutral.medium, fontSize: "23px" }} />
          <Typography variant="h6" ml="0.35rem" fontWeight={"500"} color={palette.neutral.medium}>
            {post?.children?.length ?? 0}
          </Typography>
        </PostStatistic>
        <PostStatistic hoverColor={"rgb(0,186,124)"} name="Repost">
          <CachedOutlined sx={{ color: palette.neutral.medium, fontSize: "23px" }} />
          <Typography
            variant="h6"
            marginLeft="0.35rem"
            fontWeight={"500"}
            color={palette.neutral.medium}
          >
            {post?.children?.filter((post) => post?.isRepost)?.length}
          </Typography>
        </PostStatistic>
        <PostStatistic
          hoverColor="rgb(229,24,128)"
          name="Likes"
          onClick={() => handleLikePost(post_id, `http://localhost:6001/posts/post/${post_id}`)}
        >
          {isLiked ? (
            <FavoriteOutlined sx={{ color: "rgb(229, 24, 128)", fontSize: "23px" }} />
          ) : (
            <FavoriteBorderOutlined sx={{ color: palette.neutral.medium, fontSize: "23px" }} />
          )}
          <Typography
            color={isLiked ? "rgb(229, 24, 128)" : palette.neutral.medium}
            variant="h6"
            fontWeight={"500"}
            ml="0.25rem"
          >
            {post?.likes.length || "0"}
          </Typography>
        </PostStatistic>
        <PostStatistic
          hoverColor={palette.primary.main}
          name="Saved"
          onClick={() => handleSavePost(post_id, `http://localhost:6001/posts/post/${post_id}`)}
        >
          {isSaved ? (
            <BookmarkIcon sx={{ color: palette.primary.main, fontSize: "23px" }} />
          ) : (
            <BookmarkBorder sx={{ color: palette.neutral.medium, fontSize: "23px" }} />
          )}
          <Typography
            sx={{
              color: isSaved ? palette.primary.main : palette.neutral.medium,
            }}
            ml="0.25rem"
            fontWeight={"500"}
            variant="h6"
          >
            {post?.saves.length || "0"}
          </Typography>
        </PostStatistic>

        <IconButton sx={hoverEffectCSS("red")} disableRipple></IconButton>
      </Box>
    </Box>
  );
};

export default InteractionRow;

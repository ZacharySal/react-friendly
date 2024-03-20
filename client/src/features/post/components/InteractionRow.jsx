import {
  BookmarkBorder,
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Box, Typography, useTheme } from "@mui/material";
import PostStatistic from "src/features/post/components/PostStatistic";
import RepostButton from "src/features/post/components/RepostButton";
import { handleLikePost, handleSavePost } from "../store/actions";
import {
  handleQuoteClick,
  handleReplyClick,
  handleRepostClick,
  userToPostRelation,
} from "../utils/postInteractions";

const InteractionRow = ({ post, mutateKey }) => {
  const { palette } = useTheme();

  const medium = palette.neutral.medium;
  const red = "rgb(229, 24, 128)";

  const originalPostId = post.content === "" ? post.parent.id : post.id;

  const { currUserLiked, currUserSaved, repostCount } = userToPostRelation(post);

  return (
    <Box className="mt-[3px] flex w-full items-center justify-between border-red-400 pr-[10%] md:mt-2 md:pr-[10%]">
      <PostStatistic
        hoverColor={palette.primary.main}
        name="Reply"
        onClick={(e) => handleReplyClick(e, post)}
      >
        <ChatBubbleOutlineOutlined sx={{ fontSize: "18px", color: medium }} />
        <Typography marginLeft="0.35rem" variant="h7" sx={{ color: medium }}>
          {post?.children?.length || "0"}
        </Typography>
      </PostStatistic>
      <RepostButton
        repostCount={repostCount}
        handleQuoteClick={(e) => handleQuoteClick(e, post)}
        handleRepostClick={(e) => handleRepostClick(e, post, mutateKey)}
      />
      <PostStatistic
        hoverColor={red}
        name="Likes"
        onClick={(e) => handleLikePost(e, originalPostId, mutateKey)}
      >
        {currUserLiked ? (
          <FavoriteOutlined sx={{ color: red, fontSize: "18px" }} />
        ) : (
          <FavoriteBorderOutlined sx={{ color: medium, fontSize: "18px" }} />
        )}
        <Typography marginLeft="0.35rem" color={currUserLiked ? red : medium}>
          {post?.likes?.length ?? 0}
        </Typography>
      </PostStatistic>
      <PostStatistic
        hoverColor={palette.primary.main}
        name="Saved"
        onClick={(e) => handleSavePost(e, originalPostId, mutateKey)}
      >
        {currUserSaved ? (
          <BookmarkIcon sx={{ color: palette.primary.main, fontSize: "18px" }} />
        ) : (
          <BookmarkBorder sx={{ color: medium, fontSize: "18px" }} />
        )}

        <Typography
          sx={{
            color: currUserSaved ? palette.primary.main : medium,
          }}
          ml="0.25rem"
          variant="h6"
        >
          {post.saves?.length || "0"}
        </Typography>
      </PostStatistic>
    </Box>
  );
};

export default InteractionRow;

import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import TimeAgo from "javascript-time-ago";
import { useDispatch, useSelector } from "react-redux";
import { patchCommentLike } from "store/postsSlice";
import CommentList from "./CommentList";

const Comment = ({ comment, post_id, setReplyingTo, replies, level, getReplies }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.user.user.id);

  const isLiked = comment.likes.some((like) => like.user_id === loggedInUserId);
  const commentId = comment.id;

  const timeAgo = new TimeAgo("en-US");
  const time = timeAgo.format(new Date(comment.created_at), "twitter");

  return (
    <Box width="100%">
      {!comment.parent_id && <Divider />}
      <Box width="100%" height="100%" margin="0rem 0rem">
        {/* USER INFO */}

        <Box
          display="grid"
          gridTemplateColumns="auto 1fr auto"
          padding="0"
          alignItems="center"
          columnGap="0.7rem"
          rowGap="0"
          width="100%"
        >
          <UserImage picture_key={comment.author.picture_key} size="25px" />
          <Box
            maxWidth="100%"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            marginTop="0.5rem"
          >
            <Typography
              display="block"
              maxWidth="100%"
              overflow="hidden"
              whiteSpace="wrap"
              textOverflow="ellipsis"
              fontWeight="500"
            >
              {`${comment.author.display_name} `}
              {comment?.parent && (
                <a href={`/profile/${comment.parent.author.id}`} style={{ textDecoration: "none" }}>
                  @{comment.parent.author.display_name}{" "}
                </a>
              )}
              <span style={{ color: palette.neutral.main, fontWeight: "400" }}>
                {comment.content}
              </span>
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <Typography variant="h8" color={palette.neutral.main}>
                {time}
              </Typography>
              <Typography
                variant="h8"
                fontWeight="500"
                color={palette.neutral.main}
                onClick={() => setReplyingTo(comment)}
                sx={{ cursor: "pointer" }}
              >
                Reply
              </Typography>
              {comment._count.likes > 0 && (
                <Typography variant="h8" color={palette.neutral.main}>
                  {comment._count.likes} likes
                </Typography>
              )}
            </Box>
          </Box>

          <IconButton onClick={() => dispatch(patchCommentLike({ commentId, post_id }))}>
            {isLiked ? <FavoriteOutlined sx={{ color: "red" }} /> : <FavoriteBorderOutlined />}
          </IconButton>
        </Box>
      </Box>
      {replies && (
        <CommentList
          rootComments={replies}
          post_id={post_id}
          level={++level}
          setReplyingTo={setReplyingTo}
          getReplies={getReplies}
        />
      )}
    </Box>
  );
};

export default Comment;

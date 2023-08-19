import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Divider,
  Icon,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import Comment from "./CommentWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect, useDebugValue } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "app/postsSlice";

const PostWidget = ({
  postId,
  postUserId,
  content,
  location,
  postPictureKey,
  likes,
  comments,
  createdAt,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isComments, setIsComments] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [commentValue, setCommentValue] = useState("");

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");
  const time = timeAgo.format(new Date(createdAt));

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const loggedInUserId = useSelector((state) => state.user.user._id);

  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const getUserInfo = async () => {
    const response = await fetch(`http://localhost:3001/users/${postUserId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUserInfo(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getUserInfo();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      patchComment();
    }
  };

  const patchComment = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, content: commentValue }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const patchCommentLike = async (commentId) => {
    const response = await fetch(
      `http://localhost:3001/posts/comment/${commentId}/like`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, postId: postId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <>
      {!isLoading && (
        <WidgetWrapper m="2rem 0">
          <Friend
            friendId={postUserId}
            name={`${userInfo.firstName} ${userInfo.lastName}`}
            subtitle={location}
            pictureKey={userInfo.pictureKey}
            time={time}
          />
          <Typography color={main} sx={{ mt: "1rem" }}>
            {content}
          </Typography>
          {postPictureKey && (
            <img
              width="100%"
              height="auto"
              alt="post"
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
              src={`http://localhost:3001/posts/image/${postPictureKey}`}
            />
          )}
          <FlexBetween mt="0.25rem">
            <FlexBetween gap="1rem">
              <FlexBetween>
                <IconButton onClick={patchLike}>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography>{likeCount}</Typography>
              </FlexBetween>

              <FlexBetween>
                <IconButton onClick={() => setIsComments(!isComments)}>
                  <ChatBubbleOutlineOutlined />
                </IconButton>
                <Typography>{comments.length}</Typography>
              </FlexBetween>
            </FlexBetween>

            <IconButton>
              <ShareOutlined />
            </IconButton>
          </FlexBetween>
          {isComments && (
            <Box mt="0.5rem">
              {comments.map((comment, i) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  token={token}
                  loggedInUserId={loggedInUserId}
                  patchCommentLike={patchCommentLike}
                />
              ))}

              <Divider />
              {/* ADD COMMENT */}
              <Box
                sx={{
                  marginTop: "0.5rem",
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "1rem",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  wordBreak: "break-all",
                }}
              >
                <InputBase
                  fullWidth
                  multiline
                  placeholder="Add a comment"
                  onChange={(e) => setCommentValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <IconButton onClick={patchComment}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </WidgetWrapper>
      )}
    </>
  );
};

export default PostWidget;

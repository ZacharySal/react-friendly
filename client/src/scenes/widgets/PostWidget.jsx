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
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import FlexBetween from "components/FlexBetween";
import Comment from "./CommentWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { patchLike, patchComment } from "app/postsSlice";
import UserPostInfo from "components/UserPostInfo";

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
  const [authorInfo, setAuthorInfo] = useState({});
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

  //console.log("Post picture key in post widget: ", postPictureKey);

  const getAuthorInfo = async () => {
    const response = await fetch(
      `https://twitter-clone-node-server-production.up.railway.app/users/${postUserId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setAuthorInfo(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getAuthorInfo();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      patchComment();
    }
  };

  return (
    <>
      {!isLoading && (
        <WidgetWrapper m="1rem 0">
          <UserPostInfo
            authorId={postUserId}
            name={`${authorInfo.firstName} ${authorInfo.lastName}`}
            subtitle={location}
            pictureKey={authorInfo.pictureKey}
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
              src={`https://twitter-clone-node-server-production.up.railway.app/posts/image/${postPictureKey}`}
            />
          )}
          <FlexBetween mt="0.25rem">
            <FlexBetween gap="1rem">
              <FlexBetween>
                <IconButton onClick={() => dispatch(patchLike(postId))}>
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
              {/* REPLACE */}
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
                  postId={postId}
                />
              ))}

              <Divider />
              {/* ADD COMMENT */}
              <Box
                sx={{
                  width: "100%",
                  marginTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "0.5rem 1.25rem",
                }}
              >
                <InputBase
                  fullWidth
                  sx={{}}
                  placeholder="Add a comment"
                  onChange={(e) => setCommentValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <IconButton
                  onClick={() =>
                    dispatch(patchComment({ postId, commentValue }))
                  }
                >
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

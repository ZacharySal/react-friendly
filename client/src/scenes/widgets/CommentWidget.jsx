import { Box, Divider, Typography, useTheme, IconButton } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import UserImage from "components/UserImage";

const Comment = ({ comment, token, loggedInUserId, patchCommentLike }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { palette } = useTheme();
  const main = palette.neutral.main;

  const isLiked = Boolean(comment.likes[loggedInUserId]);
  const likeCount = Object.keys(comment.likes).length;

  const getCommentAuthorInfo = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${comment.userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setUserInfo(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getCommentAuthorInfo();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!isLoading && (
        <Box>
          <Divider />

          {/* USER INFO */}
          <Box
            sx={{
              marginTop: "0.5rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              color: main,
              gap: "0.5rem",
            }}
          >
            <UserImage pictureKey={userInfo.pictureKey} size="40px" />
            <Typography>{`${userInfo.firstName} ${userInfo.lastName}`}</Typography>
          </Box>

          {/* COMMENT CONTENT*/}
          <FlexBetween>
            <Typography
              sx={{
                color: palette.neutral.mediumMain,
                m: "0.75rem 1rem 0.75rem 0rem",
              }}
            >
              {comment.content}
            </Typography>
            <FlexBetween>
              <IconButton onClick={() => patchCommentLike(comment._id)}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: "red" }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>
          </FlexBetween>
        </Box>
      )}
    </>
  );
};

export default Comment;

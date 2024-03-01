import SendIcon from "@mui/icons-material/Send";
import { Box, Button, IconButton, InputBase, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { patchComment } from "store/postsSlice";
import UserImage from "./UserImage";

const NewComment = ({ post_id, replyingTo, setReplyingTo }) => {
  const [commentValue, setCommentValue] = useState("");
  const status = useSelector((state) => state.posts.status);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const { palette } = useTheme();
  const handlePatchComment = () => {
    const parent_id = replyingTo?.id;
    if (commentValue !== "") {
      dispatch(patchComment({ post_id, parent_id, commentValue }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handlePatchComment();
    }
  };

  useEffect(() => {
    if (status === "succeeded") {
      setCommentValue("");
    }
  }, [status]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.75rem" }}>
        <UserImage picture_key={user.profile_img_key} size="40px" />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `2px solid ${palette.neutral.light}`,
            borderRadius: "2rem",
            padding: "0.25rem 1rem",
          }}
        >
          <InputBase
            fullWidth
            placeholder={`Add a comment as ${user.display_name}`}
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <IconButton
            sx={{
              padding: 0,
              opacity: commentValue ? "1" : "0.3",
              transition: "opacity 0.45s ease",
            }}
            onClick={handlePatchComment}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
      {replyingTo && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "0.5rem",
            marginLeft: "3.75rem",
            marginTop: "0.1rem",
            marginBottom: 0,
          }}
        >
          <Typography
            variant="h8"
            sx={{ color: palette.neutral.main }}
          >{`Replying to ${replyingTo.author.display_name}`}</Typography>
          <Button
            onClick={() => {
              setReplyingTo(null);
              setCommentValue("");
            }}
          >
            <Typography variant="h8" sx={{ color: palette.neutral.main }}>
              Cancel
            </Typography>
          </Button>
        </Box>
      )}
    </>
  );
};

export default NewComment;

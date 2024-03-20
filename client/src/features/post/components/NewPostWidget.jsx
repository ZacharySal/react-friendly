import { Box, InputBase, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ActionButton from "src/components/ActionButton";
import UserImage from "src/components/UserImage";
import { handleAddPost } from "src/features/post/store/actions";
import AttachmentRow from "./AttachmentRow";
import UploadedAttachment from "./UploadedAttachment";

const NewPostWidget = () => {
  const [attachment, setAttachment] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { id: user_id, profile_img_key } = useSelector((state) => state.user.user);
  const postStatus = useSelector((state) => state.posts.status);

  const handlePostClick = async () => {
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("content", post);
    formData.append("isRepost", false);

    if (attachment) {
      const name = attachment.type === "gif" ? "gif_url" : "attachment";
      formData.append(name, attachment.content);
    }

    handleAddPost(formData);
  };

  useEffect(() => {
    if (postStatus === "succeeded") {
      setAttachment(null);
      setPost("");
    }
  }, [postStatus]);

  return (
    <Box
      className="grid grid-cols-[40px_1fr] gap-3 p-2 md:gap-4 md:pb-3 md:pl-4 md:pr-6 md:pt-4"
      borderBottom={`1px solid ${palette.neutral.light}`}
    >
      <UserImage profile_img_key={profile_img_key} id={user_id} size="40px" />
      <Box className="mt-1 flex max-w-full flex-col ">
        <Box className="max-w-full overflow-hidden">
          <InputBase
            multiline
            fullWidth
            placeholder="What's on your mind?"
            onChange={(e) => setPost(e.target.value)}
            value={post}
            sx={{ fontSize: "16px" }}
          />
          {attachment && (
            <UploadedAttachment attachment={attachment} setAttachment={setAttachment} />
          )}
        </Box>

        <Box className="mt-4 flex w-full items-center justify-between gap-2">
          <AttachmentRow setAttachment={setAttachment} setReply={setPost} />
          <Box className="flex items-center gap-4">
            {post.length > 0 && (
              <Typography
                color={post.length === 260 ? "#900D09" : palette.neutral.medium}
                variant="h6"
              >
                {260 - Number(post.length)}/260
              </Typography>
            )}
            <ActionButton
              backgroundColor={palette.primary.main}
              disabled={!post}
              text="post"
              status={postStatus}
              handleClick={handlePostClick}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewPostWidget;

import { ClearOutlined } from "@mui/icons-material";
import {
  Box,
  Dialog,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionButton from "src/components/ActionButton";
import FlexBetween from "src/components/FlexBetween";
import UserImage from "src/components/UserImage";
import Attachment from "src/features/post/components/Attachment";
import Post from "src/features/post/components/Post";
import { resetAddPostStatus } from "src/store/slices/postsSlice";
import { getTwitterTime } from "src/utils/time";
import { handleAddPost, handleSetModal } from "../store/actions";
import AttachmentRow from "./AttachmentRow";
import AuthorInfo from "./AuthorInfo";
import ChainLink from "./ChainLink";
import UploadedAttachment from "./UploadedAttachment";

const NewPostModal = () => {
  const isDesktopScreen = useMediaQuery("(min-width:768px)");

  const { id: user_id, profile_img_key } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const postStatus = useSelector((state) => state.posts.addPostStatus);
  const modal = useSelector((state) => state.app.modal);

  const [reply, setReply] = useState("");
  const [attachment, setAttachment] = useState(null);

  const { palette } = useTheme();

  const parentPost = modal?.post ? modal.post : null;
  const time = getTwitterTime(parentPost.created_at);
  const isRepost = modal?.type === "quote";

  const handlePostClick = () => {
    const formData = new FormData();

    formData.append("user_id", user_id);
    formData.append("content", reply);
    formData.append("isRepost", isRepost);

    if (parentPost) {
      formData.append("parent_id", parentPost.id);
    }

    if (attachment) {
      const name = attachment.type === "gif" ? "gif_url" : "attachment";
      formData.append(name, attachment.content);
    }

    handleAddPost(formData);
  };

  useEffect(() => {
    if (postStatus === "succeeded") {
      handleSetModal({ enabled: false });
      dispatch(resetAddPostStatus());
    }
  }, [postStatus]);

  return (
    <Dialog
      sx={{ backgroundImage: "none !important" }}
      fullWidth
      fullScreen={!isDesktopScreen}
      open
    >
      <Box className="p-3 md:p-4">
        <FlexBetween mb="1rem">
          <IconButton onClick={() => handleSetModal({ enabled: false })}>
            <ClearOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
          {!isDesktopScreen && (
            <ActionButton
              backgroundColor={palette.primary.main}
              disabled={!reply && !attachment}
              status={postStatus}
              handleClick={handlePostClick}
              text="reply"
            />
          )}
        </FlexBetween>

        {modal.type === "reply" && (
          <Box className="mb-1 grid grid-cols-[auto_1fr] gap-4">
            <Box>
              <UserImage
                profile_img_key={parentPost.author.profile_img_key}
                id={parentPost.author.id}
                size="40px"
              />
              <ChainLink />
            </Box>
            <Box>
              <Box className="flex min-w-full items-center">
                <AuthorInfo author={parentPost.author} time={time} clickable={false} />
              </Box>
              <Typography marginBottom="0.5rem" variant="h5" lineHeight="1.4">
                {parentPost.content}
              </Typography>
              <Attachment attachment_key={parentPost.attachment_key} />
              <Typography color={palette.neutral.medium} variant="h6">
                Replying to{" "}
                <span style={{ color: palette.primary.main }}>
                  @{parentPost.author.display_name}
                </span>
              </Typography>
            </Box>
          </Box>
        )}

        <Box className="mb-4 grid w-full grid-cols-[auto_1fr] gap-x-4">
          <UserImage id={user_id} profile_img_key={profile_img_key} size="40px" />
          <Box className="flex max-w-full flex-col gap-1 overflow-hidden">
            <InputBase
              sx={{ fontSize: "20px" }}
              multiline
              value={reply}
              onChange={(e) => {
                if (reply.length <= 260) setReply(e.target.value);
                else return;
              }}
              placeholder="Post your reply"
            />
            {attachment && (
              <UploadedAttachment attachment={attachment} setAttachment={setAttachment} />
            )}
            {modal.type === "quote" && <Post post={parentPost} condensed />}
          </Box>
        </Box>
        <Divider color={palette.neutral.light} mt="1rem" flexItem />
        <Box className="mt-4 flex items-center justify-between">
          <AttachmentRow setAttachment={setAttachment} setReply={setReply} size="25px" />
          <Box className="flex items-center gap-4">
            {reply.length > 0 && (
              <Typography
                color={reply.length === 260 ? "#900D09" : palette.neutral.medium}
                variant="h6"
              >
                {260 - Number(reply.length)}/260
              </Typography>
            )}
            {isDesktopScreen && (
              <ActionButton
                backgroundColor={palette.primary.main}
                disabled={!reply}
                status={postStatus}
                handleClick={handlePostClick}
                text="reply"
              />
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default NewPostModal;

import {
  DeleteOutlined,
  EditCalendarOutlined,
  EditOutlined,
  EmojiEmotionsOutlined,
  FormatListBulletedOutlined,
  GifBoxOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import { Box, Button, IconButton, InputBase, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "store/postsSlice";

const NewPostWidget = ({ profile_img_key }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { id } = useSelector((state) => state.user.user);
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("content", post);
    formData.append("isRepost", false);

    if (image) {
      formData.append("picture", image);
    }

    dispatch(addPost({ formData }));
    setImage(null);
    setPost("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (post) handlePost();
    }
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns="auto 1fr"
      gap="1rem"
      padding="1rem 1.5rem 0.75rem 1rem"
      borderBottom={`1px solid ${palette.neutral.light}`}
    >
      <UserImage profile_img_key={profile_img_key} user_id={id} size="40px" />
      <Box marginTop="3px">
        <InputBase
          multiline
          fullWidth
          placeholder="What's on your mind?"
          onChange={(e) => setPost(e.target.value)}
          onKeyDown={handleKeyPress}
          value={post}
          sx={{ fontSize: "16px" }}
        />

        {/* {post.length > 0 && (
          <Box marginTop="1rem" display="flex" alignItems="center" gap="0.25rem">
            <PublicOutlined sx={{ color: palette.primary.main }} />
            <Typography fontWeight="600" color={palette.primary.main} variant="h7">
              Everyone can view and reply
            </Typography>
          </Box>
        )} */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            gap: "0.5rem",
          }}
        >
          <Box display="flex" gap="1rem">
            <ImageOutlined
              fontSize="medium"
              onClick={() => setIsImage(!isImage)}
              sx={{ color: palette.primary.main }}
            />
            <GifBoxOutlined
              fontSize="medium"
              onClick={() => setIsImage(!isImage)}
              sx={{ color: palette.primary.main }}
            />
            <FormatListBulletedOutlined sx={{ color: palette.primary.main }} />
            <EmojiEmotionsOutlined sx={{ color: palette.primary.main }} />
            <EditCalendarOutlined sx={{ color: palette.primary.main }} />
          </Box>
          <Box display="flex" alignItems="center" gap="1rem">
            {post.length > 0 && (
              <Typography
                color={post.length === 260 ? "#900D09" : palette.neutral.medium}
                variant="h6"
              >
                {260 - Number(post.length)}/260
              </Typography>
            )}

            <Button
              disabled={!post}
              onClick={handlePost}
              sx={{
                color: "white",
                backgroundColor: palette.primary.main,
                borderRadius: "3rem",
                fontWeight: "800",
              }}
            >
              POST
            </Button>
          </Box>
        </Box>
      </Box>
      {isImage && (
        <Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="1rem">
          <Dropzone
            acceptedFiles="image/jpeg,image/png,image/gif"
            accept={{
              "image/jpeg": [".jpeg", ".JPEG"],
              "image/png": [".png", ".PNG"],
              "image/gif": [".gif", ".GIF"],
            }}
            nultiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dotted ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <Typography variant="h8" fontWeight="400" color={palette.neutral.medium}>
                      Click to upload attatchment
                    </Typography>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton onClick={() => setImage(null)} sx={{ width: "15%" }}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}
    </Box>
  );
};

export default NewPostWidget;

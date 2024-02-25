import {
  ClearOutlined,
  EditCalendarOutlined,
  EmojiEmotionsOutlined,
  FormatListBulletedOutlined,
  GifBoxOutlined,
  PhotoOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { ModalContext } from "contexts/ModalContext";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PostWidget from "scenes/widgets/PostWidget";
import { addPost } from "store/postsSlice";
import { useSWRConfig } from "swr";

const NewPostModal = () => {
  const { modalContext, setModalContext } = useContext(ModalContext);
  const isDesktopScreen = useMediaQuery("(min-width:700px)");

  const { id: logged_in_user_id, picture_key: user_picture_key } = useSelector(
    (state) => state.user.user
  );
  const [reply, setReply] = useState("");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const { mutate } = useSWRConfig();
  const navigate = useNavigate();

  const post = modalContext?.post ? modalContext.post : null;

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");
  const time = timeAgo.format(new Date(post.created_at), "twitter");

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("user_id", logged_in_user_id);
    formData.append("content", reply);
    formData.append("parent_id", post.id);
    formData.append("isRepost", modalContext.type === "quote");

    dispatch(addPost({ formData, mutate }));
    navigate(`/post/${post.id}`);
    setModalContext({ show: false });
  };

  return (
    <Box
      id="modal"
      position="absolute"
      width={isDesktopScreen ? "600px" : "100vw"}
      height={isDesktopScreen ? "auto" : "100vh"}
      top={isDesktopScreen ? "35%" : "0"}
      borderRadius={isDesktopScreen ? "10px" : "0px"}
      backgroundColor={palette.background.default}
      padding="1rem"
      left={isDesktopScreen ? "50%" : "0"}
      zIndex="100"
      boxShadow="0px 0px 100px 2000px rgba(200,200,255,0.15)"
      sx={{ transform: isDesktopScreen ? "translateX(-50%) translateY(-50%)" : "" }}
    >
      <FlexBetween mb="1rem">
        <IconButton onClick={() => setModalContext({ show: false })}>
          <ClearOutlined />
        </IconButton>
        {!isDesktopScreen && (
          <Button
            disabled={!reply}
            onClick={handlePost}
            sx={{
              color: "white",
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              marginLeft: "auto",
              fontWeight: "800",
            }}
          >
            REPLY
          </Button>
        )}
      </FlexBetween>
      {modalContext.type === "reply" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "1rem",
            rowGap: "0rem",
            mb: "1.5rem",
          }}
        >
          <Box>
            <UserImage picture_key={post.author.picture_key} size="40px" />
            <Box
              sx={{
                position: "relative",
                top: "1px",
                left: "50%",
                width: "2px",
                height: "88%",
                backgroundColor: palette.neutral.light,
              }}
            />
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                minwidth: "100%",
                flexDirection: "row",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" fontWeight="500" marginRight="0.25rem">
                  {`${post.author.first_name} ${post.author.last_name}`}
                </Typography>
                <Typography variant="h6" color={palette.neutral.medium}>
                  {` @${post.author.display_name} ∙`}
                </Typography>
                <Typography variant="h6" color={palette.neutral.medium}>
                  {time ?? ""}
                </Typography>
              </Box>
            </Box>
            <Typography marginBottom="1rem" variant="h5" lineHeight="1.4">
              {post.content}
            </Typography>

            <Typography color={palette.neutral.medium} variant="h6">
              Replying to{" "}
              <span style={{ color: palette.primary.main }}>@{post.author.display_name}</span>
            </Typography>
          </Box>
        </Box>
      )}

      <Box width="100%" mb="1rem" display="grid" gridTemplateColumns="auto 1fr" columnGap="1rem">
        <UserImage picture_key={user_picture_key} size="40px" />
        <Box width="100%" display="flex" flexDirection="column" gap="1rem">
          <InputBase
            sx={{ fontSize: "20px" }}
            multiline
            minWidth="100%"
            fullWidth
            value={reply}
            onChange={(e) => {
              if (reply.length <= 260) setReply(e.target.value);
              else return;
            }}
            placeholder="Post your reply"
          />
          {modalContext.type === "quote" && <PostWidget post={post} />}
        </Box>
      </Box>
      <Divider color={palette.neutral.light} mt="1rem" fullWidth flexItem />
      <FlexBetween marginTop="1rem" display="flex" justifyContent="end">
        <Box display="flex" gap="1rem">
          <PhotoOutlined sx={{ color: palette.primary.main, fontSize: "22px" }} />
          <GifBoxOutlined sx={{ color: palette.primary.main, fontSize: "22px" }} />
          <FormatListBulletedOutlined sx={{ color: palette.primary.main, fontSize: "22px" }} />
          <EmojiEmotionsOutlined sx={{ color: palette.primary.main, fontSize: "22px" }} />
          <EditCalendarOutlined sx={{ color: palette.primary.main, fontSize: "22px" }} />
        </Box>
        <Box display="flex" gap="1rem" alignItems="center">
          {reply.length > 0 && (
            <Typography
              color={reply.length === 260 ? "#900D09" : palette.neutral.medium}
              variant="h6"
            >
              {260 - Number(reply.length)}/260
            </Typography>
          )}
          {isDesktopScreen && (
            <Button
              disabled={!reply}
              onClick={handlePost}
              sx={{
                color: "white",
                backgroundColor: palette.primary.main,
                borderRadius: "3rem",
                marginLeft: "auto",
                fontWeight: "800",
              }}
            >
              REPLY
            </Button>
          )}
        </Box>
      </FlexBetween>
    </Box>
  );
};

export default NewPostModal;

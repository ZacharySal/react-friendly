import {
  ArrowBack,
  BookmarkBorder,
  CachedOutlined,
  ChatBubbleOutlineOutlined,
  EmojiEmotionsOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  GifBoxOutlined,
  PhotoOutlined,
} from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Box, Button, IconButton, InputBase, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Layout from "components/Layout";
import PostStatistic from "components/PostStatistic";
import UserImage from "components/UserImage";
import { getDateAndTime, hoverEffectCSS } from "helpers/utils";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PostWidget from "scenes/widgets/PostWidget";
import { addPost, patchLike, patchSave } from "store/postsSlice";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const setScrollPosition = (element) => {
  window.scrollTo({
    top: element.current.offsetTop - 20,
    behavior: "auto",
  });
};

const PostPage = () => {
  const { post_id } = useParams();

  const {
    data: postInfo,
    loading,
    error,
  } = useSWR(`http://localhost:6001/posts/post/${post_id}`, fetcher);

  if (error) console.log(error);

  return <Layout>{!loading && postInfo?.post?.author && <FullPost postInfo={postInfo} />}</Layout>;
};

const FullPost = ({ postInfo }) => {
  const [reply, setReply] = useState("");
  const [focusReply, setFocusReply] = useState(false);

  const mainPostRef = useRef(null);

  const post = postInfo.post;

  const { palette } = useTheme();
  const dispatch = useDispatch();
  const { mutate } = useSWRConfig();
  const navigate = useNavigate();

  const { id, picture_key } = useSelector((state) => state.user.user);

  const post_id = post.id;

  const isLiked = Boolean(post?.likes.some((like) => like.user_id === id));
  const isSaved = Boolean(post?.saves.some((save) => save.user_id === id));
  const { time, date } = getDateAndTime(post.created_at);

  const replies = post?.children?.filter((post) => post.content != null);

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("content", reply);
    formData.append("parent_id", post.id);
    formData.append("isRepost", false);

    dispatch(addPost({ formData, mutateKey: `http://localhost:6001/posts/post/${post_id}` }));
    setReply("");
    setFocusReply(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (post) handlePost();
    }
  };

  useEffect(() => {
    if (post.parent && !post.isRepost) {
      setScrollPosition(mainPostRef);
    }
  }, []);

  return (
    <Box mt="1rem" minHeight="1056px">
      {/* ALL POST INFO */}
      <Box borderBottom={`1px solid ${palette.neutral.light}`}>
        {/* TOP NAV */}
        <Box padding="0rem 1rem" display="flex" alignItems="center" gap="1rem" mb="1rem">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="500">
            Post
          </Typography>
        </Box>
        {/* PARENT POSTS */}
        {post.parent_id && !post.isRepost && (
          <Box mb="0.5rem">
            {postInfo.parent_posts?.map((parentPost) => (
              <PostWidget
                key={parentPost.id}
                post={parentPost}
                postPageId={post.id}
                isPostPage={true}
                isChain={true}
              />
            ))}
          </Box>
        )}

        {/* POST HEADER */}
        <Box ref={mainPostRef} padding="0rem 1rem">
          <FlexBetween mb="1rem">
            <FlexBetween pl="-8px" gap="0.75rem">
              <UserImage
                picture_key={post.author.picture_key}
                user_id={post.author.id}
                size="40px"
              />
              <Box display="flex" flexDirection="column">
                <Typography
                  variant="h5"
                  fontWeight="500"
                >{`${post.author.first_name} ${post.author.last_name}`}</Typography>
                <Typography
                  variant="h5"
                  color={palette.neutral.medium}
                >{`@${post.author.display_name}`}</Typography>
              </Box>
            </FlexBetween>
            <Button
              sx={{
                color: palette.neutral.lightest,
                backgroundColor: palette.neutral.darkest,
                borderRadius: "3rem",
                padding: "0.25rem 1rem",
                textTransform: "none",
                marginLeft: "auto",
                "&:hover": {
                  color: palette.neutral.lightest,
                  backgroundColor: palette.neutral.dark,
                },
              }}
            >
              <Typography variant="h5" fontWeight="600">
                Follow
              </Typography>
            </Button>
          </FlexBetween>
          {/* POST CONTENT */}
          <Box display="flex" flexDirection="column" gap="1rem" mb="1rem">
            <Typography variant="h4">{post.content}</Typography>
            {post.isRepost && <PostWidget post={post.parent} condensed={true} />}
          </Box>
          {/* TIME, DATE, VIEW COUNT */}
          <Box display="flex" mb="1rem">
            <Typography variant="h5" color={palette.neutral.medium}>
              {time} ∙
            </Typography>
            <Typography variant="h5" color={palette.neutral.medium}>
              {date} ∙
            </Typography>
            <Typography variant="h5" color={palette.neutral.medium}>
              {/* TODO: Add real view count */}
              <span style={{ color: palette.neutral.darkest, fontWeight: "500" }}>155K</span> Views
            </Typography>
          </Box>
          {/* ICON BUTTONS */}
          <Box
            display="flex"
            mb="1rem"
            gap="3rem"
            borderTop={`1px solid ${palette.neutral.light}`}
            borderBottom={`1px solid ${palette.neutral.light}`}
            alignItems="flex-start"
          >
            <PostStatistic hoverColor={palette.primary.main} name="Replies">
              <ChatBubbleOutlineOutlined sx={{ color: palette.neutral.medium, fontSize: "23px" }} />
              <Typography variant="h6" ml="0.35rem" color={palette.neutral.medium}>
                {post?.children?.length ?? 0}
              </Typography>
            </PostStatistic>
            <PostStatistic hoverColor={"rgb(0,186,124)"} name="Repost">
              <CachedOutlined sx={{ color: palette.neutral.medium, fontSize: "23px" }} />
              <Typography variant="h6" marginLeft="0.35rem" color={palette.neutral.medium}>
                {post?.children?.filter((post) => post?.isRepost)?.length}
              </Typography>
            </PostStatistic>
            <PostStatistic
              hoverColor="rgb(229,24,128)"
              name="Likes"
              onClick={() =>
                dispatch(
                  patchLike({ post_id, mutateKey: `http://localhost:6001/posts/post/${post_id}` })
                )
              }
            >
              {isLiked ? (
                <FavoriteOutlined sx={{ color: "rgb(229, 24, 128)", fontSize: "23px" }} />
              ) : (
                <FavoriteBorderOutlined sx={{ color: palette.neutral.medium, fontSize: "23px" }} />
              )}
              <Typography
                color={isLiked ? "rgb(229, 24, 128)" : palette.neutral.medium}
                variant="h6"
                ml="0.25rem"
              >
                {post?.likes.length || "0"}
              </Typography>
            </PostStatistic>
            <PostStatistic
              hoverColor={palette.primary.main}
              name="Saved"
              onClick={() =>
                dispatch(
                  patchSave({ post_id, mutateKey: `http://localhost:6001/posts/post/${post_id}` })
                )
              }
            >
              {isSaved ? (
                <BookmarkIcon sx={{ color: palette.primary.main, fontSize: "23px" }} />
              ) : (
                <BookmarkBorder sx={{ color: palette.neutral.medium, fontSize: "23px" }} />
              )}

              <Typography
                sx={{ color: isSaved ? palette.primary.main : palette.neutral.medium }}
                ml="0.25rem"
                variant="h6"
              >
                {post?.saves.length || "0"}
              </Typography>
            </PostStatistic>

            <IconButton sx={hoverEffectCSS("red")} disableRipple></IconButton>
          </Box>
          {/* ADD COMMENT */}
          <Box mb="0rem" display="flex" flexDirection="column" gap="0.15rem">
            {focusReply && (
              <Typography color={palette.neutral.medium} pl="3.25rem" variant="h7">
                Replying to{" "}
                <span style={{ color: palette.primary.main }}>@{post.author.display_name}</span>
              </Typography>
            )}
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              gap="0.15rem"
              marginBottom={focusReply ? "0rem" : "1.5rem"}
            >
              <Box width="100%" display="flex" gap="1rem">
                <UserImage picture_key={picture_key} user_id={id} size="40px" />
                <InputBase
                  sx={{ fontSize: "20px" }}
                  multiline
                  fullWidth
                  value={reply}
                  onChange={(e) => {
                    if (reply.length <= 260) setReply(e.target.value);
                    else return;
                  }}
                  onKeyDown={handleKeyPress}
                  onFocus={() => setFocusReply(true)}
                  placeholder="Post your reply"
                ></InputBase>
                <Button
                  disabled={!reply}
                  onClick={handlePost}
                  sx={{
                    color: "white",
                    visibility: focusReply ? "hidden" : "visble",
                    backgroundColor: palette.primary.main,
                    borderRadius: "3rem",
                    marginLeft: "auto",
                    fontWeight: "800",
                    marginLeft: "auto",
                    padding: "0.2rem 1rem",
                    minHeight: "auto",
                    minWidth: "auto",
                  }}
                >
                  REPLY
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            display={focusReply ? "flex" : "none"}
            marginLeft="8%"
            alignItems="center"
            marginTop="0.5rem"
            justifyContent="space-between"
            mb="1rem"
          >
            <Box display="flex" gap="1rem">
              <PhotoOutlined sx={{ color: palette.primary.main }} />
              <GifBoxOutlined sx={{ color: palette.primary.main }} />
              <EmojiEmotionsOutlined sx={{ color: palette.primary.main }} />
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
              <Button
                disabled={!reply}
                onClick={handlePost}
                sx={{
                  color: "white",
                  backgroundColor: palette.primary.main,
                  visibility: focusReply ? "visible" : "hidden",
                  borderRadius: "3rem",
                  marginLeft: "auto",
                  fontWeight: "800",
                  marginLeft: "auto",
                }}
              >
                REPLY
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      {replies?.map((childPost) => (
        <PostWidget
          key={childPost.id}
          post={childPost}
          mutateURL={`http://localhost:6001/posts/post/${post_id}`}
          isPostPage={true}
        />
      ))}
    </Box>
  );
};

export default PostPage;

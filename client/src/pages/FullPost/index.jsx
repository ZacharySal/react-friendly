import { ArrowBack, PersonRemoveAlt1Outlined, PersonRemoveOutlined } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useClickAway } from "@uidotdev/usehooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "src/components/ActionButton";
import FlexBetween from "src/components/FlexBetween";
import UserImage from "src/components/UserImage";
import Attachment from "src/features/post/components/Attachment";
import AttachmentRow from "src/features/post/components/AttachmentRow";
import Post from "src/features/post/components/Post";
import UploadedAttachment from "src/features/post/components/UploadedAttachment";
import { handleAddPost } from "src/features/post/store/actions";
import { patchFollow } from "src/store/slices/userSlice";
import { API_URL, getDateAndTime } from "src/utils/misc";
import useSWR from "swr";
import InteractionRow from "./InteractionRow";
const fetcher = (url) => fetch(url).then((r) => r.json());

const PostPage = () => {
  const { post_id } = useParams();

  const { data: postInfo, isLoading } = useSWR(`${API_URL}/posts/post/${post_id}`, fetcher);

  return <>{!isLoading && postInfo?.post?.author && <FullPost postInfo={postInfo} />}</>;
};

const FullPost = ({ postInfo }) => {
  const [reply, setReply] = useState("");
  const [focusReply, setFocusReply] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [showUnfollow, setShowUnfollow] = useState(false);

  const mainPostRef = useRef(null);
  const containerRef = useRef(null);

  const post = postInfo.post;

  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedUser = useSelector((state) => state.user.user);
  const postStatus = useSelector((state) => state.posts.status);

  const isSelf = post.author.id === loggedUser.id;

  const isFollowing = useMemo(
    () => Boolean(loggedUser.following?.find((r) => r.followee_id === post.author.id)),
    [loggedUser]
  );

  const post_id = post.id;

  const ref = useClickAway(() => {
    setShowUnfollow(false);
  });

  const { time, date } = getDateAndTime(post.created_at);

  const replies = post?.children?.filter((post) => post.content != null);

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("user_id", loggedUser.id);
    formData.append("content", reply);
    formData.append("parent_id", post.id);
    formData.append("isRepost", false);

    if (attachment) {
      const name = attachment.type === "gif" ? "gif_url" : "attachment";
      formData.append(name, attachment.content);
    }

    handleAddPost(formData, `${API_URL}/posts/post/${post_id}`);
  };

  useEffect(() => {
    if (postStatus === "succeeded") {
      setReply("");
      setAttachment(null);
      setFocusReply(false);
    }
  }, [postStatus]);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${post.author.id}`);
  };

  return (
    <Box className="min-h-[1056px]" ref={containerRef}>
      {/* ALL POST INFO */}
      <Box borderBottom={`1px solid ${palette.neutral.light}`}>
        {/* TOP NAV */}
        <Box
          className="py-2 sticky top-0 flex items-center gap-2 px-0 md:mb-4 md:gap-4 md:px-4 z-[100]"
          sx={{
            backgroundColor: palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
            backdropFilter: "blur(40px)",
          }}
        >
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="700">
            Post
          </Typography>
        </Box>
        {/* PARENT POSTS */}
        {post.parent_id && !post.isRepost && (
          <Box className="mb-2">
            {postInfo.parent_posts?.map((parentPost) => (
              <Post
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
        <Box ref={mainPostRef}>
          <Box className="mb-4 flex justify-between px-2 md:px-4">
            <FlexBetween className="gap-3 pl-[-8px]">
              <UserImage
                profile_img_key={post.author.profile_img_key}
                id={post.author.id}
                size="40px"
              />
              <Box display="flex" flexDirection="column">
                <Typography
                  variant="h5"
                  fontWeight="500"
                  className="cursor-pointer"
                  onClick={handleProfileClick}
                >{`${post.author.first_name} ${post.author.last_name}`}</Typography>
                <Typography
                  variant="h5"
                  color={palette.neutral.medium}
                >{`@${post.author.display_name}`}</Typography>
              </Box>
            </FlexBetween>
            {!isSelf && (
              <>
                {!isFollowing ? (
                  <ActionButton
                    handleClick={() => dispatch(patchFollow(loggedUser.id))}
                    disabled={false}
                    backgroundColor={palette.neutral.darkest}
                    textColor={palette.neutral.light}
                    text={"Follow"}
                  />
                ) : (
                  <IconButton
                    onClick={() => setShowUnfollow((curr) => !curr)}
                    sx={{
                      border: `1px solid ${palette.primary.main}`,
                      position: "relative",
                      height: "40px",
                      aspectRatio: "1",
                    }}
                  >
                    <PersonRemoveOutlined sx={{ fontSize: "20px", color: palette.primary.main }} />
                    {showUnfollow && (
                      <Box
                        position="absolute"
                        ref={ref}
                        borderRadius="10px"
                        color={palette.neutral.darkest}
                        sx={{
                          boxShadow: `0px 0px 5px 2px ${palette.neutral.dark}50`,
                        }}
                        backgroundColor={palette.background.default}
                        right={"15px"}
                        whiteSpace={"nowrap"}
                        top={"0px"}
                        zIndex="40"
                        p="0"
                      >
                        <List disablePadding>
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => dispatch(patchFollow(loggedUser.id))}
                              sx={{
                                display: "flex",
                                gap: "0.25rem",
                                alignItems: "center",
                              }}
                            >
                              <PersonRemoveAlt1Outlined className="mr-2" />
                              <Typography variant="h5" fontWeight="600">
                                {`Unfollow @${loggedUser.display_name}`}
                              </Typography>
                            </ListItemButton>
                          </ListItem>
                        </List>
                      </Box>
                    )}
                  </IconButton>
                )}
              </>
            )}
          </Box>
          {/* POST CONTENT */}
          <Box className="mb-4 flex flex-col gap-1 px-2 md:px-4">
            <Typography variant="h4">{post.content}</Typography>
            {post.attachment_key && <Attachment attachment_key={post.attachment_key} />}
            {post.isRepost && <Post post={post.parent} condensed={true} />}
          </Box>
          {/* TIME, DATE, VIEW COUNT */}
          <Box className="mb-4 flex items-center px-2 md:px-4">
            <Typography variant="h5" color={palette.neutral.medium}>
              {`${time} • ${date} • `}
            </Typography>
            <Typography variant="h5" color={palette.neutral.medium}>
              {/* TODO: Add real view count */}
              <span style={{ color: palette.neutral.darkest, fontWeight: "500" }}>155K</span> Views
            </Typography>
          </Box>
          {/* ICON BUTTONS */}
          <InteractionRow post={post} />
          {/* ADD COMMENT */}
          <Box className="grid grid-cols-[50px_1fr] gap-1 px-2 pt-2 md:px-4">
            <UserImage
              profile_img_key={loggedUser.profile_img_key}
              id={loggedUser.id}
              size="40px"
            />
            <Box
              className="grid items-center gap-1"
              marginBottom={focusReply ? "0.5rem" : "1.5rem"}
              gridTemplateColumns={focusReply ? "90%" : "1fr 90px"}
            >
              <Box className="flex flex-col">
                {focusReply && (
                  <Typography color={palette.neutral.medium} variant="h7" fontWeight="500">
                    Replying to{" "}
                    <span style={{ color: palette.primary.main }}>@{post.author.display_name}</span>
                  </Typography>
                )}
                <InputBase
                  sx={{ fontSize: "20px" }}
                  multiline
                  fullWidth
                  value={reply}
                  onChange={(e) => {
                    if (reply.length <= 260) setReply(e.target.value);
                    else return;
                  }}
                  onFocus={() => setFocusReply(true)}
                  placeholder="Post your reply"
                />
                {attachment && (
                  <UploadedAttachment attachment={attachment} setAttachment={setAttachment} />
                )}
              </Box>
              {!focusReply && (
                <ActionButton
                  backgroundColor={palette.primary.main}
                  visibility={focusReply ? "hidden" : "visble"}
                  disabled={!reply}
                  handleClick={handlePost}
                  text="reply"
                />
              )}
            </Box>
          </Box>
          <Box
            display={focusReply ? "flex" : "none"}
            className="mb-4 ml-[3.25rem] items-center justify-between px-2 md:px-4"
          >
            <AttachmentRow setReply={setReply} setAttachment={setAttachment} />

            <Box className="flex items-center gap-4">
              {reply.length > 0 && (
                <Typography
                  color={reply.length === 260 ? "#900D09" : palette.neutral.medium}
                  variant="h6"
                >
                  {260 - Number(reply.length)}/260
                </Typography>
              )}
              <ActionButton
                backgroundColor={palette.primary.main}
                visibility={!focusReply ? "hidden" : "visble"}
                disabled={!reply}
                status={postStatus}
                handleClick={handlePost}
                text="reply"
              />
            </Box>
          </Box>
        </Box>
      </Box>
      {replies?.reverse().map((childPost) => (
        <Post
          key={childPost.id}
          post={childPost}
          mutateKey={`${API_URL}/posts/post/${post_id}`}
          isPostPage={true}
        />
      ))}
    </Box>
  );
};

export default PostPage;

// @ts-nocheck
import { Box, Typography, useTheme } from "@mui/material";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import UserImage from "src/components/UserImage";
import { getTwitterTime } from "src/utils/time";
import Attachment from "./Attachment";
import AuthorInfo from "./AuthorInfo";
import ChainLink from "./ChainLink";
import InteractionRow from "./InteractionRow";
import RepostMessage from "./RepostMessage";

const Post = memo(function Post({
  post,
  mutateKey,
  hideInteractionRow = false,
  isChain = false,
  isRepost = false,
  condensed = false,
}) {
  if (!post) return null;
  const time = getTwitterTime(post.created_at);

  const navigate = useNavigate();
  const { palette } = useTheme();

  const postAuthorName = isRepost ? post.author.display_name : post.parent?.author?.display_name;

  const isPostPage = window.location.href.includes("post");

  const handleProfileClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${post.author.id}`);
  };

  // if post is a repost without a quote
  if (post.content == null) return <Post post={post.parent} mutateKey={mutateKey} isRepost />;

  return (
    <Box
      padding={
        condensed ? "0.75rem !important" : hideInteractionRow ? "0 0 0.5rem 0 !important" : "null"
      }
      className="p-2 cursor-pointer md:pl-4 md:pr-6 md:pt-2 md:pb-1"
      border={condensed ? `1px solid ${palette.neutral.light}` : null}
      borderRadius={condensed ? "12px" : "0px"}
      borderBottom={isChain || condensed ? null : `1px solid ${palette.neutral.light}`}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/post/${post.id}`);
      }}
    >
      {isRepost && <RepostMessage authorName={post.author.display_name} />}
      <Box
        className="grid h-full gap-2 md:gap-4"
        sx={{
          gridTemplateColumns: condensed ? null : "40px 1fr",
          gridTemplateRows: condensed ? "auto auto" : null,
          gap: condensed ? "0rem" : "null",
        }}
      >
        <Box
          display={condensed ? "flex" : "grid"}
          gap={condensed ? "0.5rem" : null}
          gridTemplateRows={condensed ? null : "auto 1fr"}
        >
          <UserImage
            id={post.author.id}
            profile_img_key={post.author.profile_img_key}
            size={condensed ? "25px" : "40px"}
          />
          {isChain && <ChainLink isPostPage />}
          {condensed && (
            <AuthorInfo author={post.author} time={time} handleClick={handleProfileClick} />
          )}
        </Box>

        <Box className="max-w-full">
          {!condensed && (
            <AuthorInfo author={post.author} time={time} handleClick={handleProfileClick} />
          )}
          {post.parent_id && !isPostPage && !post.isRepost && (
            <Box className="mb-1 flex items-center gap-1">
              <Typography variant="h7" color={palette.neutral.medium}>
                Replying to
              </Typography>
              <Typography
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${post.author.id}`);
                }}
                className="cursor-pointer"
                fontWeight="500"
                variant="h7"
                color={palette.primary.main}
              >
                {`@${postAuthorName}`}
              </Typography>
            </Box>
          )}
          <Typography
            className="max-w-full overflow-hidden break-words"
            variant="h5"
            lineHeight="1.4"
          >
            {post.content}
          </Typography>
          {post.attachment_key && <Attachment attachment_key={post.attachment_key} />}
          {post.isRepost && !condensed && !isPostPage && (
            <Box mt="0.5rem">
              <Post post={post.parent} condensed={true} />
            </Box>
          )}
          {!condensed && !hideInteractionRow && (
            <InteractionRow post={post} mutateKey={mutateKey} />
          )}
        </Box>
      </Box>
    </Box>
  );
});

export default Post;

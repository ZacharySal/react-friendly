import { Box, Divider } from "@mui/material";
import CommentList from "components/CommentList";
import NewComment from "components/NewComment";
import { useMemo, useState } from "react";

const CommentWidget = ({ comments, post_id }) => {
  const [replyingTo, setReplyingTo] = useState(null);

  const commentsByParentId = useMemo(() => {
    const group = {};
    comments.forEach((comment) => {
      group[comment?.parent?.id] ||= [];
      group[comment?.parent?.id].push(comment);
    });
    return group;
  }, [comments]);

  const rootComments = commentsByParentId[undefined];

  const getReplies = (parentId) => {
    return commentsByParentId[parentId];
  };

  return (
    <Box>
      <CommentList
        rootComments={rootComments}
        post_id={post_id}
        setReplyingTo={setReplyingTo}
        getReplies={(id) => getReplies(id)}
      />
      <Divider />
      <NewComment post_id={post_id} replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
    </Box>
  );
};

export default CommentWidget;

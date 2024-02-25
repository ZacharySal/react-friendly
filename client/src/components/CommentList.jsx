import { Box } from "@mui/material";
import Comment from "components/Comment";

const CommentList = ({ rootComments, post_id, level = 0, setReplyingTo, getReplies }) => {
  return (
    <Box width="100%" pl={level === 1 ? "clamp(0.75rem, 3vw, 3rem)" : "0"}>
      {rootComments?.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          post_id={post_id}
          setReplyingTo={setReplyingTo}
          getReplies={getReplies}
          replies={getReplies(comment.id)}
          level={level}
        />
      ))}
    </Box>
  );
};

export default CommentList;

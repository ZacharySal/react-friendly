import { store } from "src/store/store.js";
import { handleAddPost, handleSetModal } from "../store/actions";

export const handleReplyClick = (e, post) => {
  e.stopPropagation();
  handleSetModal({
    enabled: true,
    type: "reply",
    post: post,
  });
};

export const handleQuoteClick = (e, post) => {
  e.stopPropagation();
  handleSetModal({
    enabled: true,
    type: "quote",
    post: post,
  });
};

export const handleRepostClick = (e, post, mutateKey = "http://192.168.1.247:6001/posts/") => {
  e.stopPropagation();
  const formData = new FormData();
  const loggedInUserId = store.getState().user.user.id;

  formData.append("user_id", loggedInUserId);
  formData.append("parent_id", post.id);
  formData.append("isRepost", true);

  handleAddPost(formData, mutateKey);
};

export const userToPostRelation = (post) => {
  const loggedInUserId = store.getState().user.user.id;

  const currUserLiked = Boolean(post?.likes?.some((post) => post.user_id === loggedInUserId));
  const currUserSaved = Boolean(post?.saves?.some((save) => save.user_id === loggedInUserId));
  const repostCount = post?.children?.filter((post) => post?.isRepost)?.length;

  return { currUserLiked, currUserSaved, repostCount };
};

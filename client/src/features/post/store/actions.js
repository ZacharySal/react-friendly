import { setModal } from "src/store/slices/appSlice";
import { addPost, patchLike, patchSave } from "src/store/slices/postsSlice";
import { store } from "src/store/store.js";
import { API_URL } from "src/utils/misc";

const DEFAULT_MUTATE_KEY = `${API_URL}/posts/`;

export const handleLikePost = (postId, mutateKey) => {
  store.dispatch(
    patchLike({
      post_id: postId,
      mutateKey: mutateKey,
    })
  );
};

export const handleSetModal = (options) => {
  store.dispatch(setModal(options));
};

export const handleAddPost = (formData, mutateKey = DEFAULT_MUTATE_KEY) => {
  store.dispatch(addPost({ formData, mutateKey }));
};

export const handleSavePost = (postId, mutateKey) => {
  store.dispatch(
    patchSave({
      post_id: postId,
      mutateKey: mutateKey,
    })
  );
};

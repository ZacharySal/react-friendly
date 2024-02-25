import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (args = null, { getState }) => {
    const state = getState();
    const response = await fetch("http://localhost:6001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${state.user.token}` },
    });
    const data = await response.json();
    return data;
  }
);

export const addPost = createAsyncThunk(
  "posts/addPost",
  async ({ formData, mutate }, { getState }) => {
    const state = getState();
    const parent_id = formData.get("parent_id");
    const response = await fetch(`http://localhost:6001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${state.user.token}` },
      body: formData,
    });
    const data = await response.json();
    if (mutate) {
      mutate(`http://localhost:6001/posts/post/${parent_id}`);
    }
    return data;
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (post_id, { getState, fulfillWithValue, reject }) => {
    const state = getState();
    const response = await fetch(`http://localhost:6001/posts/${post_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${state.user.token}` },
    });
    if (response.status === 200) {
      return post_id;
    } else {
      reject();
    }
  }
);

export const patchLike = createAsyncThunk(
  "posts/patchLike",
  async ({ post_id, parent_id, mutate }, { getState }) => {
    const state = getState();
    const response = await fetch(`http://localhost:6001/posts/${post_id}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${state.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: state.user.user.id }),
    });
    const data = await response.json();
    mutate(`http://localhost:6001/posts/post/${parent_id}`);
    return data;
  }
);

export const patchSave = createAsyncThunk(
  "posts/patchSave",
  async ({ post_id, parent_id, mutate }, { getState }) => {
    console.log(post_id, parent_id, mutate);
    const state = getState();
    const response = await fetch(`http://localhost:6001/posts/${post_id}/save`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${state.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: state.user.user.id }),
    });
    const data = await response.json();
    console.log("Mutating URL -> ", `http://localhost:6001/posts/post/${parent_id}`);
    mutate(`http://localhost:6001/posts/post/${parent_id}`);
    return data;
  }
);

export const patchComment = createAsyncThunk(
  "posts/patchComment",
  async (postInfo, { getState }) => {
    const state = getState();
    const response = await fetch(`http://localhost:6001/posts/${postInfo.post_id}/comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${state.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: state.user.user.id,
        parent_id: postInfo.parent_id,
        content: postInfo.commentValue,
      }),
    });
    const data = await response.json();
    return data;
  }
);

export const patchCommentLike = createAsyncThunk(
  "posts/patchCommentLike",
  async (postInfo, { getState }) => {
    const state = getState();
    const response = await fetch(`http://localhost:6001/posts/comment/${postInfo.commentId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${state.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: state.user.user.id, post_id: postInfo.post_id }),
    });
    const data = await response.json();
    return data;
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post.id === action.payload.id) {
          return action.payload;
        } else {
          return post;
        }
      });
      state.posts = updatedPosts;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deletePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const post_id = action.payload;
        state.status = "succeeded";
        state.posts = state.posts.filter((post) => post.id !== post_id);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(patchLike.pending, (state) => {
        state.status = "loading";
      })
      .addCase(patchLike.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsSlice.caseReducers.setPost(state, action);
      })
      .addCase(patchLike.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(patchSave.pending, (state) => {
        state.status = "loading";
      })
      .addCase(patchSave.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsSlice.caseReducers.setPost(state, action);
      })
      .addCase(patchSave.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(patchComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(patchComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsSlice.caseReducers.setPost(state, action);
      })
      .addCase(patchComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(patchCommentLike.pending, (state) => {
        state.status = "loading";
      })
      .addCase(patchCommentLike.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsSlice.caseReducers.setPost(state, action);
      })
      .addCase(patchCommentLike.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setPost } = postsSlice.actions;

export default postsSlice.reducer;

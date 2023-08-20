import { DatasetLinkedSharp } from "@mui/icons-material";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    posts: [],
    status: 'idle',
    error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (args = null, { getState }) => {
    const state = getState();
    const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${state.user.token}` },
    });
    const data = await response.json();
    return data;
});

export const addPost = createAsyncThunk("posts/addPost", async (formData, { getState }) => {
    const state = getState();
    const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${state.user.token}` },
        body: formData,
    });
    const data = await response.json();
    return data;
});

export const patchLike = createAsyncThunk("posts/patchLike", async (postId, { getState }) => {
    const state = getState();
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${state.user.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: state.user.user._id }),
    });
    const data = await response.json();
    return data;
});

export const patchComment = createAsyncThunk("posts/patchComment", async (postInfo, { getState }) => {
    const state = getState();
    const response = await fetch(`http://localhost:3001/posts/${postInfo.postId}/comment`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${state.user.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: state.user.user._id, content: postInfo.commentValue }),
    });
    const data = await response.json();
    return data;
});

export const patchCommentLike = createAsyncThunk("posts/patchCommentLike", async (postInfo, { getState }) => {
    const state = getState();
    const response = await fetch(`http://localhost:3001/posts/comment/${postInfo.commentId}/like`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${state.user.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: state.user.user._id, postId: postInfo.postId }),
    });
    const data = await response.json();
    return data;
});

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload._id) {
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
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addPost.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(addPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(patchLike.pending, (state) => {
                state.status = "loading";
            })
            .addCase(patchLike.fulfilled, (state, action) => {
                state.status = 'succeeded';
                postsSlice.caseReducers.setPost(state, action);
            })
            .addCase(patchLike.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(patchComment.pending, (state) => {
                state.status = "loading";
            })
            .addCase(patchComment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                postsSlice.caseReducers.setPost(state, action);
            })
            .addCase(patchComment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(patchCommentLike.pending, (state) => {
                state.status = "loading";
            })
            .addCase(patchCommentLike.fulfilled, (state, action) => {
                state.status = 'succeeded';
                postsSlice.caseReducers.setPost(state, action);
            })
            .addCase(patchCommentLike.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
}
);

export const { setPost } = postsSlice.actions;

export default postsSlice.reducer;
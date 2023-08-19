import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import state from "state";

const initialState = {
    posts: [],
    status: 'idle',
    error: null,
};

export const fetchPosts = createAsyncThunk(`posts/fetchPosts`, async () => {
    const response = await axios.get("localhost:3001/posts");
    return response.data;
});



// we need fetch posts, set posts, and update post reducer 
export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) {
                    return action.payload.post;
                } else {
                    return post;
                }
            });
            state.posts = updatedPosts;
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchPosts.fulfilled, (staet, action) => {
                state.status = 'succeeded';
                state.posts = state.posts.concat(action.payload);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
}
);

export const { setPost, setPosts } = postsSlice.actions;

export default postsSlice.reducer;
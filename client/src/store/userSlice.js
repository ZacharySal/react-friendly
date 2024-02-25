import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  error: null,
  status: "idle",
  friends: [],
};

export const patchFriend = createAsyncThunk(
  "user/patchFriend",
  async (authorId, { getState, rejectWithValue }) => {
    const state = getState();
    const response = await fetch(`http://localhost:6001/users/${state.user.user.id}/${authorId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${state.user.token}` },
      "Content-Type": "application/json",
    });
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      return rejectWithValue("Failed to add/remove friend.");
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("No friends for user found");
      }
    },
  },
  /* Add all status cases */
  extraReducers(builder) {
    builder
      .addCase(patchFriend.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(patchFriend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.friends = action.payload.friends;
      })
      .addCase(patchFriend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setMode, setLogin, setLogout, setFriends, setUser } = userSlice.actions;

export default userSlice.reducer;

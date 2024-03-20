import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  error: null,
  status: "idle",
  friends: [],
};

export const patchFollow = createAsyncThunk(
  "user/patchFollow",
  async (followee_id, { getState, rejectWithValue }) => {
    console.log("[atch follow ");
    const state = getState();
    const response = await fetch(
      `http://192.168.1.247:6001/users/${state.user.user.id}/${followee_id}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${state.user.token}` },
        "Content-Type": "application/json",
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      return rejectWithValue("Failed to add/remove friend.");
    }
  }
);

export const patchUser = createAsyncThunk(
  "user/patchUser",
  async (formData, { getState, rejectWithValue }) => {
    const state = getState();
    const response = await fetch(`http://192.168.1.247:6001/user/${state.user.user.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${state.user.token}` },
      "Content-Type": "multipart/form-data",
      body: formData,
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
      }
    },
  },
  /* Add all status cases */
  extraReducers(builder) {
    builder
      .addCase(patchFollow.pending, (state) => {
        state.status = "loading";
      })
      .addCase(patchFollow.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(patchFollow.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(patchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(patchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(patchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setMode, setLogin, setLogout, setFriends, setUser } = userSlice.actions;

export default userSlice.reducer;

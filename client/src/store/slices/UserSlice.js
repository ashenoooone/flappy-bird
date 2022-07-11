import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './thunks/userLoginThunk';
import { registerUser } from './thunks/userRegisterThunk';
import { getLeaders } from './thunks/userGetLeaders';

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    email: '',
    score: 0,
    isLoading: false,
    error: '',
    leaders: [],
  },
  reducers: {
    removeUser(state, action) {
      state.username = '';
      state.email = '';
      state.score = 0;
      state.isLoading = false;
      state.error = '';
      state.leaders = [];
    },
  },
  extraReducers: {
    [registerUser.pending]: (state, action) => {
      state.isLoading = true;
      state.error = '';
    },
    [registerUser.fulfilled]: (state, action) => {
      state.error = '';
      state.isLoading = false;
    },
    [registerUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [loginUser.pending]: (state, action) => {
      state.isLoading = true;
      state.error = '';
    },
    [loginUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.error = '';
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.score = action.payload.score;
    },
    [loginUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [getLeaders.fulfilled]: (state, action) => {
      state.leaders = action.payload;
      state.isLoading = false;
      state.error = '';
    },
    [getLeaders.pending]: (state, action) => {
      state.isLoading = true;
      state.error = '';
    },
    [getLeaders.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { removeUser } = UserSlice.actions;

export default UserSlice.reducer;

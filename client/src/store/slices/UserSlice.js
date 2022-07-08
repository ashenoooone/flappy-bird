import { createSlice } from '@reduxjs/toolkit';
import { registerUser } from './thunks/userRegisterThunk';

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    email: '',
    score: 0,
    isLoading: false,
    error: '',
  },
  reducers: {
    addUser(state, action) {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.score = action.payload.score;
    },
    editUser(state, action) {
      state.username = action.payload.username;
    },
    removeUser(state, action) {
      state.username = '';
      state.email = '';
      state.score = '';
    },
    updateScore(state, action) {
      state.score = action.payload.score;
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
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.score = action.payload.score;
    },
    [registerUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

export const { addUser, editUser, removeUser, updateScore } = UserSlice.actions;

export default UserSlice.reducer;

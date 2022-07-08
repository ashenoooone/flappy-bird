import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    email: '',
    score: 0,
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
});

export const { addUser, editUser, removeUser, updateScore } = UserSlice.actions;

export default UserSlice.reducer;

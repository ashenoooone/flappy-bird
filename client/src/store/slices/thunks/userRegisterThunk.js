import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk(
  'user/register',
  async function (
    { email, username, password },
    { rejectWithValue, dispatch }
  ) {
    try {
      const responce = await axios.post(
        'http://localhost:5000/api/user/registration',
        {
          email: email,
          username: username,
          password: password,
        }
      );
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

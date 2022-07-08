import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'user/register',
  async function ({ email, password }, { rejectWithValue }) {
    try {
      const responce = await axios.post(
        'http://localhost:5000/api/user/login',
        {
          email: email,
          password: password,
        }
      );
      console.log(responce.data);
      localStorage.setItem('jwt', responce.data.token);
      return responce.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

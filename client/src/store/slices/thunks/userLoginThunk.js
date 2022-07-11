import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'user/login',
  async function ({ email, password, jwt, setter }, { rejectWithValue }) {
    try {
      if (jwt) {
        const responce = await axios.get(
          'http://localhost:5000/api/user/auth',
          {
            headers: {
              authorization: `BEARER ${jwt}`,
            },
          }
        );
        return responce.data;
      } else {
        const responce = await axios.post(
          'http://localhost:5000/api/user/login',
          {
            email: email,
            password: password,
          }
        );
        localStorage.setItem('jwt', responce.data.token);
        return responce.data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

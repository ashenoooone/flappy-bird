import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const updateScore = createAsyncThunk(
  'user/updateScore',
  async function ({ jwt, score }, { rejectWithValue }) {
    try {
      const leaders = await axios.post(
        'http://localhost:5000/api/user',
        {
          score: score,
        },
        {
          headers: {
            authorization: `BEARER ${jwt}`,
          },
        }
      );
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getLeaders = createAsyncThunk(
  'user/getLeaders',
  async function (_, { rejectWithValue }) {
    try {
      const leaders = await axios.get('http://localhost:5000/api/user/leaders');
      return leaders.data[0];
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// LOGIN
export const loginUser = createAsyncThunk(
  'user/login',
  async function ({ email, password, jwt }, { dispatch, rejectWithValue }) {
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
        localStorage.setItem('isLogged', true);
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
        localStorage.setItem('isLogged', true);
        console.log(responce.data);
        dispatch(editUser(responce.data));
        return responce.data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// --------
// register
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
      return rejectWithValue(error.response.data.message);
    }
  }
);
// -------
// get leaders
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
// ------------
// update score
export const updateUser = createAsyncThunk(
  'user/updateScore',
  async function ({ jwt, score, username }, { dispatch, rejectWithValue }) {
    try {
      if (score) {
        const user = await axios.post(
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
        dispatch(editUser({ score: score }));
      } else if (username) {
        const user = await axios.post(
          'http://localhost:5000/api/user',
          {
            username: username,
          },
          {
            headers: {
              authorization: `BEARER ${jwt}`,
            },
          }
        );
        dispatch(editUser({ username }));
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// -------------
// slice
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
      localStorage.setItem('username', '');
      localStorage.setItem('email', '');
      localStorage.setItem('score', 0);
      state.isLoading = false;
      state.error = '';
      state.leaders = [];
    },
    editUser(state, action) {
      localStorage.setItem(
        'username',
        action.payload.username || localStorage.getItem('username')
      );
      localStorage.setItem(
        'email',
        action.payload.email || localStorage.getItem('email')
      );
      localStorage.setItem(
        'score',
        action.payload.score || localStorage.getItem('score')
      );
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

export const { removeUser, editUser } = UserSlice.actions;

export default UserSlice.reducer;

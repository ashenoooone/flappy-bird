import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {$api} from '../../api/api'
import {toast} from "react-toastify";


// LOGIN
export const loginUser = createAsyncThunk(
	'user/login',
	async function ({email, password, jwt}, {dispatch, rejectWithValue}) {
		try {
			if (jwt) {
				const responce = await $api.get(
					'/user/auth');
				sessionStorage.setItem('isLogged', true);
				dispatch(setUser(responce.data));
				return responce.data;
			} else {
				const responce = await $api.post(
					'/user/login',
					{
						email: email,
						password: password,
					}
				);
				localStorage.setItem('jwt', responce.data.token);
				sessionStorage.setItem('isLogged', true);
				dispatch(setUser(responce.data));
				return responce.data;
			}
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
// --------
// register
export const registerUser = createAsyncThunk(
	'user/register',
	async function (
		{email, username, password},
		{rejectWithValue, dispatch}
	) {
		try {
			const responce = await $api.post(
				'/user/registration',
				{
					email: email,
					username: username,
					password: password,
				}
			);
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
// -------
// get leaders
export const getLeaders = createAsyncThunk(
	'user/getLeaders',
	async function (_, {rejectWithValue}) {
		try {
			const leaders = await $api.get('/user/leaders');
			return leaders.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
// ------------
// update score
export const updateUser = createAsyncThunk(
	'user/updateScore',
	async function (data, {dispatch, rejectWithValue}) {
		try {
			const user = await $api.post(
				'/user',
				data
			);
			dispatch(setUser(user.data));
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
// -------------
// slice

const initialState = {
	username: '',
	email: '',
	score: 0,
	coins: 0,
	isLoading: false,
	error: '',
	leaders: [],
	settings: {},
	userRole: ''
}

const UserSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		updateUser(state, action) {
			return action.payload
		},
		removeUser(state, action) {
			return initialState;
		},
		setUser(state, action) {
			const {user} = action.payload;
			state.username = user.username;
			state.email = user.email;
			state.score = user.leaderboardScores[0].score;
			state.settings = user.settings;
			state.userRole = user.userRole;
			state.coins = user.coins;
			state.isLoading = false;
			state.error = '';
		},
		editUser(state, action) {
			sessionStorage.setItem(
				'username',
				action.payload.username || sessionStorage.getItem('username')
			);
			sessionStorage.setItem(
				'email',
				action.payload.email || sessionStorage.getItem('email')
			);
			sessionStorage.setItem(
				'coins',
				action.payload.coins || sessionStorage.getItem('coins')
			);
			if (action.payload.score === 0 || action.payload.score > 0)
				sessionStorage.setItem('score', action.payload.score);
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

export const {removeUser, editUser, setUser} = UserSlice.actions;

export default UserSlice.reducer;

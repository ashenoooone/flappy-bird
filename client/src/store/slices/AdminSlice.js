import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {$api} from "../../api/api";


export const getAllUsers = createAsyncThunk(
	'admin/getAllUsers',
	async function (_, {fulfillWithValue, dispatch, rejectWithValue}) {
		try {
			const users = await $api.get('/admin/users');
			dispatch(setUsers(users.data))
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const addBalance = createAsyncThunk(
	'admin/addBalance',
	async function ({userId, add}, {fulfillWithValue, dispatch, rejectWithValue}) {
		try {
			const response = await $api.post('/admin/user/balance/add', {userId, add});
			return response.data
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);


export const subtractBalance = createAsyncThunk(
	'admin/subtractBalance',
	async function ({userId, sub}, {fulfillWithValue, dispatch, rejectWithValue}) {
		try {
			const response = await $api.post('/admin/user/balance/sub', {userId, sub});
			return response.data
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const banUser = createAsyncThunk(
	'admin/banUser',
	async function (userId, {fulfillWithValue, dispatch, rejectWithValue}) {
		try {
			const response = await $api.post('/admin/user/ban', {userId});
			return response.data
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const unbanUser = createAsyncThunk(
	'admin/unbanUser',
	async function (userId, {fulfillWithValue, dispatch, rejectWithValue}) {
		try {
			const response = await $api.post('/admin/user/unban', {userId});
			return response.data
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const AdminSlice = createSlice({
	name: 'admin',
	initialState: {
		users: [],
	},
	reducers: {
		setUsers(state, action) {
			state.users = [...action.payload.users]
		},
	},
});
export const {setUsers} = AdminSlice.actions;

export default AdminSlice.reducer;
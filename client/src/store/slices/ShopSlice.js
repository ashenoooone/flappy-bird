import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {$api} from "../../api/api";


export const getMySkins = createAsyncThunk(
	'shop/getMySkins',
	async function (_, {fulfillWithValue, rejectWithValue}) {
		try {
			const skins = await $api.get('/user/skin');
			return skins.data
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const buySkin = createAsyncThunk(
	'shop/buySkin',
	async function ({skinId}, {fulfillWithValue, rejectWithValue}) {
		try {
			const skins = await $api.post('/skin/buy', {skinId});
			fulfillWithValue(skins)
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const getAllSkins = createAsyncThunk(
	'shop/getAllSkins',
	async function (_, {rejectWithValue}) {
		try {
			const skins = await $api.get('/skin/');
			return skins.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const ShopSlice = createSlice({
	name: 'shop',
	initialState: {
		mySkins: [],
		allSkins: [],
		balance: 0,
		isLoading: false,
		error: '',
	},
	reducers: {
		removeUser(state, action) {
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getMySkins.fulfilled, (state, action) => {
			state.mySkins = action.payload;
			state.isLoading = false;
			state.error = '';
		});
		builder.addCase(getMySkins.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
			state.mySkins = [];
		});
		builder.addCase(getMySkins.pending, (state, action) => {
			state.isLoading = true;
			state.error = '';
			state.allSkins = [];
		});
		builder.addCase(getAllSkins.fulfilled, (state, action) => {
			state.allSkins = action.payload;
			state.isLoading = false;
			state.error = '';
		});
		builder.addCase(getAllSkins.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
			state.allSkins = [];
		});
		builder.addCase(getAllSkins.pending, (state, action) => {
			state.isLoading = true;
			state.error = '';
			state.allSkins = [];
		});
		builder.addCase(buySkin.fulfilled, (state, action) => {
			state.isLoading = false;
			state.error = '';
		});
		builder.addCase(buySkin.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		});
		builder.addCase(buySkin.pending, (state, action) => {
			state.isLoading = true;
			state.error = '';
		});
	}
});


export default ShopSlice.reducer;
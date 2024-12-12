import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    users: [],
    loading: false,
    error: null
}

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://chat-server-0vlq.onrender.com/api/user/friends');
            console.log("RESPNOSE",response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);



const usersSlice = createSlice({
    initialState,
    name: 'users',
    reducers: {
        setUsers: (state, actions) => {
            state.users = actions.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchUsers.fulfilled, (state, actions) => {
            state.loading = false;
            state.users = actions.payload;
        })
        builder.addCase(fetchUsers.rejected, (state, actions) => {
            state.loading = false;
            state.error = actions.payload;
        })
    }
})

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;


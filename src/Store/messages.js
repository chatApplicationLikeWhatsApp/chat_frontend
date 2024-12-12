import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    messages: [],
    loading: false,
    error: null,
    socket: null
}

export const fetchMessages = createAsyncThunk(
    'users/fetchMessage',
    async (accessToken, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://chat-server-0vlq.onrender.com/api/message/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("RESPNOSE", response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);



const messagesSlice = createSlice({
    initialState,
    name: 'messages',
    reducers: {
        addMessage: (state, actions) => {
            console.log("reeviced__MesS>>>>>>>>>>>>>>>>>>", actions.payload)
            state.messages = [...state.messages, actions.payload]
        },
        setSocket: (state, actions) => {
            state.socket = actions.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMessages.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchMessages.fulfilled, (state, actions) => {
            state.loading = false;
            state.messages = actions.payload;
        })
        builder.addCase(fetchMessages.rejected, (state, actions) => {
            state.loading = false;
            state.error = actions.payload;
        })
    }
})

export const { addMessage, setSocket } = messagesSlice.actions;
export default messagesSlice.reducer;


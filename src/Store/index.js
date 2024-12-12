import { configureStore } from "@reduxjs/toolkit";
import ChatSlice from './chat';
import Users from './user'
import messages from './messages'

const store = configureStore({
    reducer: {
        Users,
        ChatSlice,
        messages
    }
})


export default store;
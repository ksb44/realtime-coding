import { configureStore } from '@reduxjs/toolkit';
import codeReducer from '../utility/codeSlice'
const store=configureStore({
    reducer:{
        code :codeReducer
    }
})

export default store
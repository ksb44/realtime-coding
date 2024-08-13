
import {createSlice} from '@reduxjs/toolkit'
const codeSlice=createSlice({

    name:'code',
    initialState:{
        initCode:''
    },
    reducers:{

        setCode:(state,action)=>{

            state.initCode= action.payload
        }
    }

})

export const {setCode} = codeSlice.actions

export default codeSlice.reducer
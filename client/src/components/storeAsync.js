import { createSlice, configureStore,createAsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
const apiUrl = process.env.REACT_APP_API_URL;
const today = new Date();


const asyncUpFetch = createAsyncThunk('getRenter/asyncUpFetch', async () => {
  const resp = await fetch(apiUrl+'/jbd/searchRenter');
  const data = await resp.json();
  console.log(data)
  return data;
});

const Slice = createSlice({
  name: 'getRenter',
  initialState: {
    value: 0,
    status: 'Welcome',
  },
  reducers: {
    renter: (state, action) => {
      state.value = state.value + action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncUpFetch.pending, (state, action) => {
      state.status = 'Loading';
    });
    builder.addCase(asyncUpFetch.fulfilled, (state, action) => {
        console.log('fulfilled',{state:state,action:action})
      state.value = action.payload;
      state.status = 'complete';
    });
    builder.addCase(asyncUpFetch.rejected, (state, action) => {
      state.status = 'fail';
    });
  },
});



const rootReducer = {
  Slice: Slice.reducer,
};

const store = configureStore({
  reducer: rootReducer
});

export default store;
export {  asyncUpFetch };

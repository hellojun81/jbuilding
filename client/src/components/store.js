import { createSlice, configureStore } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const today = new Date();

const chgMonth = createSlice({
  name: 'chgMonth',
  initialState: { value: dayjs(today).format('YYYY-MM') },
  reducers: {
    reset: (state, action) => {
      const reset = dayjs(action.payload).format('YYYY-MM')
      console.log('reset', reset)
      state.value = reset
    },
    prev: (state, action) => {
      const prev = dayjs(state.value).subtract(1, 'month').format('YYYY-MM')
      // console.log('prev', prev)
      state.value = prev
    },
    next: (state, action) => {
      const next = dayjs(state.value).add(1, 'month').format('YYYY-MM')
      // console.log('next', next)
      state.value = next
    }
  }
});

const contentPop = createSlice({
  name: 'contentPop',
  initialState: { value: '스시바다' },
  reducers: {
    setCurrentName: (state, action) => {
       console.log('state : ',action.payload)
      state.value = action.payload.value
      state.title = action.payload.title
    }
  }
});

const rootReducer = {
  chgMonth: chgMonth.reducer,
  contentPop: contentPop.reducer,
};

const store = configureStore({
  reducer: rootReducer
});

export default store;
export const { reset, prev, next } = chgMonth.actions;
export const { setCurrentName } = contentPop.actions;

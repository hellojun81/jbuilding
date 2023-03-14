import React, { useState } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store'
import { prev, next ,reset} from './store';
const today = new Date();



export default function MyDatePicker(props) {
const[value,setvalue]=useState(dayjs(today).format('YYYY-MM'))


 
        function ChgMonth() {
            const dispatch = useDispatch();
            const count = useSelector(state => {
                // console.log(dayjs(state.chgMonth.value).format('YYYY-MM'))
                // setvalue(dayjs(state.chgMonth.value).format('YYYY-MM'))
                return dayjs(state.chgMonth.value).format('YYYY-MM');
            })
        
            const handleChange = (event) => {
                console.log(dayjs(event).format('YYYY-MM'))
                let a=dayjs(event).format('YYYY-MM')
                setvalue(a)
                
                console.log('a',a)
                dispatch(reset(a));
                }


            return (
  
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{
                        width: '60%',
                        position: 'fixed',
                        backgroundColor: '#fff',
                        right: '10px',
                        left: '50%',
                        top: '13%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '400px',
                        height: '40px'
                    }}>
                        <Button variant="contained" sx={{ width: '25%', opacity: '1' }} name='prev'
                            onClick={() => {
                                dispatch(prev(1));
                            }}
                        >
                            <ArrowBackIosIcon />
                        </Button>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label={count}
                            openTo="month"
                            views={["year", "month"]}
                            onChange={handleChange}
                        // value={today}
                        />
                    </LocalizationProvider>
                        <Button variant="contained" sx={{ width: '25%' }}
                          onClick={() => {
                                        dispatch(next(1));
                                    }}
                        ><ArrowForwardIosIcon /></Button>
                    </ButtonGroup>
               
            );
        }
    return (
        <Provider store={store}>
            <div>
                <ChgMonth></ChgMonth>
            </div>
        </Provider>

    );
}

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// import 'dayjs/locale/zh-cn';
export default function MyDatePicker() {
    const [selectedDate, setselectedDate] = useState(dayjs());
    
    const [prev, setprev] = useState(dayjs(new Date()).subtract(1, 'month').format("MM"));
    const [next, setnext] = useState(dayjs().add(1, 'month').format("MM"));


    function handleDateChange(newDate) {
        setselectedDate(newDate);
    }
    function ButtonClick(event) {
        if(event.target.name==='prev'){
            setselectedDate(dayjs(selectedDate).subtract(1, 'month'))
            // setprev(prev-dayjs(new Date()).subtract(1, 'month').format("MM"))
            // setnext(next-1)
        }else{
            setselectedDate(dayjs(selectedDate).add(1, 'month'))
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{
                width: '60%', 
                position: 'fixed',
                backgroundColor: '#fff', 
                right: '10px',
                left: '50%',
                top:'13%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '400px',
                height:'40px'
            }}>
                <Button variant="contained" sx={{ width: '25%', opacity: '1' }} 
                name='prev' 
                onClick={(e)=>{ButtonClick(e)}} ><ArrowBackIosIcon /></Button>
                <DatePicker
                    inputFormat="MM/YYYY"
                    views={['month', 'year']}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className='dtpicker'
                    renderInput={(params) => <input {...params} />}
                    sx={{ width: '50%', opacity: '1' ,height:'30px'}}
                />
                <Button variant="contained" sx={{ width: '25%' }} 
                name='next'
                onClick={(e) => {
                    ButtonClick(e)
                  }}
                ><ArrowForwardIosIcon /></Button>
            </ButtonGroup>
        </LocalizationProvider>
    );
}

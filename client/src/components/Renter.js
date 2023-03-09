import React, { useRef, useEffect, useState, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Provider from './Provider.js'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const textValue = [['건물명', '동호수', '입주자[상호]', '사업자번호', '담당자', '연락처', '이메일', '비고'], ['보증금', '임대료', '관리비', '기타']]


const GridCss = {
    width: '100%',
    "& label.Mui-focused": {
        color: "black"
    },
};
const TextfileStyle = {
    width: '100%',

    borderWidth: '1px!important',
    "& label.Mui-focused": {
        color: "#333"
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#333"
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "#333"
        },
        "&:hover fieldset": {
            borderColor: "#333"
        },
        "&.Mui-focused fieldset": {
            borderColor: "#333"
        }
    },
    // backgroundColor:'#fff'
};

export default function Renter(props) {
    const today = new Date();
    const [open, setOpen] = React.useState(true);
    const [value, setValue] = React.useState(dayjs(today));
    var grids = [[]];



    function createGridWithTextField(value, key) {
        return (

            <Grid item xs={6} sx={GridCss} key={key}>
                <TextField label={value} sx={TextfileStyle} size="small" focused />
            </Grid>
        );
    }

    function createGridWithDtpicker(label) {
        return (
            <LocalizationProvider size="small" dateAdapter={AdapterDayjs} sx={{
                height: '30px', width: '100%', opacity: '1'
            }}>
                <MobileDatePicker
                    label={label}
                    inputFormat="MM/DD/YYYY"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} className="datePickerTextField" />}
                    className="datePickerClass"
                    sx={TextfileStyle}

                />
            </LocalizationProvider>
        )
    }
    grids.push([]);
    let key = 0
    for (let i = 0; i < textValue.length; i++) {
        for (let j = 0; j < textValue[i].length; j++) {
            grids[i].push(createGridWithTextField(textValue[i][j], key));
            key++
        }
        grids[i].push(
            <Grid item xs={12} sx={GridCss} key={`divider-${i}`}>
                <Divider />
            </Grid>
        );
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleChange = (newValue) => {
        setValue(newValue);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Box sx={{
                padding: '20px',
            }}>


                <Grid container sx={{ backgroundColor: '#F7F7F7' }} spacing={3}>
                    <Grid item xs={6} sx={GridCss} >
                        <Provider />
                    </Grid>
                    <Grid item xs={6} sx={GridCss} >
                        {createGridWithDtpicker('수납일')}
                    </Grid>
                    {grids[0]}

                    <Grid item xs={6} sx={GridCss} >
                        {createGridWithDtpicker('계약시작일')}
                    </Grid>
                    <Grid item xs={6} sx={GridCss} >
                        {createGridWithDtpicker('계약종료일')}
                    </Grid>
                    {grids[1]}

                    <Grid item xs={12} >
                        <Button variant="contained" onClick={handleClickOpen} sx={{
                            width: '100%',
                            height: '50px',
                            marginTop: '30px', marginBottom: '90px'
                        }}>
                            저장
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
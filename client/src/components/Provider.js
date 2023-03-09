import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as React from 'react';
import { useState } from 'react';
const FormControlStyle = {
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

export default function Provider() {
    const [value, setValue] = useState('');
    const handleChange = (newValue) => {
        setValue(newValue);
    };

    return (
        <>
        <FormControl fullWidth sx={FormControlStyle} size="small">
            <InputLabel id="demo-simple-select-label">임차인</InputLabel>
            <Select
                label="임차인"
                onChange={handleChange}
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
        </FormControl>
        </>
    )
}
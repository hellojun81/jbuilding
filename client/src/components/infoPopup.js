import React, { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import SelProvider from './Provider.js'
import { getPromise } from './common.js'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import { NumericFormat } from 'react-number-format';
import store from './store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { setCurrentName } from './store';
import { asyncUpFetch } from './storeAsync.js';
import {createGridWithDtpicker,TextfileStyle} from './common.js'
import TextField from '@mui/material/TextField';

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;
    // console.log('NumericFormatCustom',props)
    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value
                    }
                });
            }}
            thousandSeparator
            valueIsNumericString
        />
    );
});

NumericFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};
const GridCss = {
    width: '100%',
    "& label.Mui-focused": {
        color: "black"
    },
};

export default function InfoPopup(props) {
    const today = new Date();
    const [DialOpen, setDialOpen] = useState(props.open);
   
    const [getbill, setGetbill] = useState([]);
    const [total, setTotal] = useState('0');
    const [startdate, setStartdate] = useState(dayjs(today));
    const [enddate, setEnddate] = useState(dayjs(today));
    const [value, setValue] = useState(dayjs(today));
    const [selprovider, setselprovider] = useState('선택');
    const [grids, setGrids] = useState([]);
    const [gridDtpicker, setGridDtpicker] = useState([]);
    const [title, setTitle] = useState(props.title)

    const textValue = [['건물명', '동호수', '입주자[상호]', '사업자번호', '담당자', '연락처', '이메일', '메모'], ['계약시작일','계약종료일','보증금', '임대료', '관리비', '기타']];
    const textValueName = [['buildingName', 'add', 'name', 'liceness', 'manager', 'tel', 'email', 'memo'], ['depogit', 'rentbill', 'mngbill', 'etc']];
    const texthandleChange = (index, event) => {
        setGetbill(prevState => {
            const newValues = [...prevState];
            newValues[index] = event.target.value;
            console.log('texthandleChange', { index: index, event: event, value: event.target.value, prevState: prevState, newValues: newValues })
            return newValues;
        });
    };


    // const vatUpdate = (values) => {
    //     let vatMoney = 0;
    //     for (let i = 0; i < 2; i++) {
    //         vatMoney = vatMoney + Number(values[i]);
    //     }
    //     vatMoney = vatMoney * 0.1
    //     values[2] = vatMoney
    //     setGetbill(values)
    // };

    const totalBillUpdate = (values) => {
        let tMoney = 0;
        for (let i = 0; i < 4; i++) {
            // console.log(values[i]);
            tMoney = tMoney + Number(values[i]);
        }
        setTotal(tMoney)
    };
    const handleClickOpen = () => {
        // setOpen(true);
    };
    const handleChange = (newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const subscribeCallback = () => {
            const state = store.getState();
            const renter = state.contentPop.value
            const title = state.contentPop.title

        };
        store.subscribe(subscribeCallback);
        return () => {
            store.unsubscribe(subscribeCallback);
        };
    }, []);

    async function Clickgetbill() {
        console.log('clickgetbill')
        setGetbill([4, 5, 6, 7, 7])
    }


    function PopupInit() {
        console.log('Popup init 텍스트필드 : ', { textValueName: textValueName, length: textValueName.length })
        let arr = []
        for (let i = 0; i < textValueName.length; i++) {
            for (let j = 0; j < textValueName[i].length; j++) {
                arr.push('')
            }
        }
        setTotal(0)

        setselprovider('선택')
    }


   function TotalComponents() {
        // let content = null

        // if (props.title !== '계약정보' && props.title !== '임차인추가') {
        //     content = <> <Grid item xs={12} sx={{ textAlign: 'right' }}>
        //         <TextField
        //             name='total'
        //             value={`합계: ${total}`}
        //             InputProps={{
        //                 inputComponent: NumericFormatCustom
        //             }}
        //             variant="standard"
        //         />
        //     </Grid>
        //     </>

        // }
        // console.log({title:props.title,content:content})
        // return content
    }
    function PopTextfield() {
        console.log('textValuelength : ',textValue.length)
        const extractedValues = textValue.map((arr) =>
            arr.map((value, index) =>
                <Grid item xs={6} sx={GridCss} >
                    {  value==='계약시작일' || value==='계약종료일'?  createGridWithDtpicker(value,startdate,enddate,value,handleChange):
                    <TextField
                        name={value}
                        label={value}
                        sx={TextfileStyle}
                        size="small"
                        value={getbill[index]}
                        onChange={(event) => texthandleChange(index, event)}
                        InputProps={
                            title !== '계약정보' && title !== '임차인추가'
                                ? { inputComponent: NumericFormatCustom }
                                : value === '보증금'
                                    ? { inputComponent: NumericFormatCustom }
                                    : value === '임대료'
                                        ? { inputComponent: NumericFormatCustom }
                                        : value === '관리비'
                                            ? { inputComponent: NumericFormatCustom }
                                            : null
                        }
                        key={index}
                        focused
                    />}
                </Grid>
            ))
        console.log(extractedValues)
        return (
            extractedValues
        )

    }




    return (
        <>

            <button
                onClick={() => {
                    Clickgetbill()
                }}
            >
                + Clickgetbill
            </button>

            <form onSubmit={event => {
                event.preventDefault();
                const renter = event.target.renter.value
                const paydate = value
                const rentBill = event.target.rentBill.value
                const mngBill = event.target.mngBill.value
                const etc = event.target.etc.value
                const vat = event.target.vat.value
                const memo = event.target.memo.value

                console.log({ renter: renter, paydate: paydate, rentBill: rentBill, mngBill: mngBill, etc: etc })
            }}>
                <Box sx={{
                    padding: '20px',
                }}>
                    <TextField

                        value={getbill[0] || ''}
                        onChange={(event) => texthandleChange(0, event)}

                        key={1}
                        focused
                    />
                    <Grid container sx={{ backgroundColor: '#F7F7F7' }} spacing={3}>
                        <Grid item xs={6} sx={GridCss} >
                            <SelProvider
                                value={selprovider}
                                title={title}
                            />
                        </Grid>
                        <Grid item xs={6} sx={GridCss} >
                            {props.title === '계약정보' ?
                                createGridWithDtpicker('계약일')
                                : createGridWithDtpicker('수납일')
                            }
                        </Grid>

                        <PopTextfield />

                        {/* {grids[0]}
                        {gridDtpicker}
                        {grids[1]} */}
                        <Grid item xs={12} >
                            <TotalComponents />
                            <Button variant="contained" onClick={handleClickOpen}
                                sx={{
                                    width: '100%',
                                    height: '50px',
                                    marginTop: '30px', marginBottom: '90px'
                                }}
                                type="submit"
                            >
                                저장
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </form></>)
}
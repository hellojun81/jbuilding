import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';

const apiUrl = process.env.REACT_APP_API_URL;
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
};






// console.log(apiUrl)
async function getPromise(param) {
    return await new Promise(async function (resolve, reject) {
        // console.log('getPromise',param)
        const Response = await fetch(apiUrl + param)
        const data = await Response.json();
        resolve(data)
    })
}

async function getRenter(renter) {
    let buildingName, add, name, liceness, manager, tel, email, memo, deposit, rentbill, mngbill, etc, vat
    let start_date, end_date, contract_date
    let field = "building_name,address,name, name2,"
        + "licensenum,name2,tel,email,etc,"
        + "start_date,end_date,contract_date,"
        + "deposit,rent_bill,mng_bill"
    const data = await getPromise('/jbd/GetrentBill?renter=' + renter + "&field=" + field)
    // console.log(data)
    if (data.length > 0) {
        contract_date = data[0].contract_date
        buildingName = data[0].building_name
        add = data[0].address
        name = data[0].name
        liceness = data[0].licensenum
        manager = data[0].name2
        tel = data[0].tel
        email = data[0].email
        deposit = data[0].deposit
        memo = data[0].etc
        rentbill = data[0].rent_bill
        mngbill = data[0].mng_bill
        etc = data[0].etc_bill
        start_date = data[0].start_date
        end_date = data[0].end_date

        vat = Number(rentbill) + Number(mngbill)
        vat = vat * 0.1

        // setValue(dayjs(contract_date))
        // setStartdate(dayjs(start_date))
        // setEnddate(dayjs(end_date))
        let getbill = [buildingName, add, name, liceness, manager, tel, email, memo, deposit, rentbill, mngbill, etc]
        // setGetbill(getbill);
        // console.log('getRenter',{ getbill: getbill})
        return getbill
    } // const newValues = [...getbill];
    // totalBillUpdate([rent_Bill, mng_Bill, vat, 0]);
}


async function getRentbill(renter) {
    let rent_Bill, mng_Bill, etc_Bill, vat, memo
    let field = "rent_bill,mng_bill,etc"
    const data = await getPromise('/jbd/GetrentBill?renter=' + renter + "&field=" + field)
    if (data.length > 0) {
        rent_Bill = data[0].rent_bill
        mng_Bill = data[0].mng_bill
        etc_Bill = data[0].etc_bill
        memo = data[0].etc
        vat = Number(rent_Bill) + Number(mng_Bill)
        vat = vat * 0.1
        // const newValues = [...getbill];
        // newValues = [rent_Bill, mng_Bill, etc_Bill,'','']
        // setGetbill([rent_Bill, mng_Bill, vat, 0, memo]);
        // const newValues = [...getbill];
        // totalBillUpdate([rent_Bill, mng_Bill, vat, 0]);
    }
}
function createGridWithDtpicker(label,startdate,enddate,value,handleChange) {
    
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
                label={label}
                inputFormat="MM/YYYY"
                views={['month', 'year']}
                value={
                    label === '계약시작일' ? startdate :
                        label === '계약종료일' ? enddate : value

                }
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        name="paydate"
                        className="datePickerTextField"
                        sx={TextfileStyle}
                    />
                )}
                className="datePickerClass"
                sx={{ height: '30px', width: '100%', opacity: 1 }}
            />
        </LocalizationProvider>
    );
}



export { getPromise ,createGridWithDtpicker,TextfileStyle }
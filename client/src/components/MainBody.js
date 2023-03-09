import React, { useRef, useEffect, useState, useCallback, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl)
async function searchBtn() {

    let query = ''
    const data = await getPromise('/jbd/searchRenter')
    // setOrderData(data)
    // props.sendData({ value: data, strDate: str_date, endDate: end_date, proname: proname });
  }


async function getPromise(param) {
    return await new Promise(async function (resolve, reject) {
      console.log(apiUrl)
      const Response = await fetch(apiUrl + param)
      const data = await Response.json();
      resolve(data)
    })
}


const MainTable = forwardRef((props, ref) => {
 
    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0),
        createData('Ice cream sandwich', 237, 9.0),
        createData('Eclair', 262, 16.0),
        createData('Cupcake', 305, 3.7),
        createData('Gingerbread', 356, 16.0),

    ];


    const SwitchComponent = (event) => {
        const [checked, setChecked] = useState(false);

        const handleChange = useCallback((e) => {
          const isChecked = e.target.checked;
          setChecked(isChecked);
          props.sendData({Payment:e})
          console.log('e',e.target.name)
        }, []);
      
        return (
          <FormControlLabel
            control={<Switch checked={checked} onChange={handleChange} name={event.name}  key={event.name} />}
            label=""
          />
        );
      };
  
      
    function BasicTable() {
            return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>상호(업체명)</TableCell>
                            <TableCell align="right">납부현황</TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row"
                                    name={row.name}
                                    onClick={() => {
                                        props.sendData({ MainTable: row.name });
                                    }}>
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">
                                <SwitchComponent name={row.name}/>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }



    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off" >
            <Grid container>
                <Grid item xs={12} >
                    <ButtonGroup variant="contained" aria-label="outlined primary button group"
                        sx={{ width: '100%', bgcolor: '#fff', borderRadius: 0 }}>
                        <TextField id="outlined-search" sx={{ width: '100%' }}
                            style={{ width: '100%' }}
                            label="Search field" type="search" />
                        <Button variant="contained"
                            style={{ margin: '8px' }}
                            sx={{ width: '20%', padding: '5px' }}
                            onClick={searchBtn}
                            >검색</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} >
                    <BasicTable />
                </Grid>
            </Grid>
        </Box>
    )

})

export default MainTable;
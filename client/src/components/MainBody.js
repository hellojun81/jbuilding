import React, { useState, useCallback, } from 'react';
import Dtpicker from './Dtpicker.js'
import LinearProgress from './LinearProgress.js'
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import InfoPopup from './infoPopup.js'
import { Provider, useDispatch } from 'react-redux';
import store from './store'
import { setCurrentName } from './store';

const apiUrl = process.env.REACT_APP_API_URL;
const rowsInit = [
    createData('Frozen yoghurt', 159, 6.0),
    createData('Frozen yoghurt2', 159, 6.0),
    createData('Frozen yoghurt3', 159, 6.0),
];
let a = createData('Frozen yoghurt', 159, 6.0)
// console.log(a)
function createData(name) {
    return { name };
}


function MainTable(props) {
    const [Rows, setRows] = useState(rowsInit);
    const [Search, setSearch] = useState();
    const [DialogOpen, setDialogOpen] = useState(false);
    const [popTitle, setpopTitle] = useState();
    const [PopContent, setPopContent] = useState();


    let prevState = store.getState();
    React.useEffect(() => {
        const subscribeCallback = () => {
            const state = store.getState();
            if (state.chgMonth !== prevState.chgMonth) {
                searchBtn();
            }
            prevState = state;
        };
        store.subscribe(subscribeCallback);

        return () => {
            store.unsubscribe(subscribeCallback);
        };
    }, []);




    async function searchBtn() {
        const state = store.getState();
        let date = state.chgMonth.value
        let month = date.slice(5, 7)
        let year = date.slice(0, 4)
        if (Number(month) < 10) {
            month = month.slice(-1)
        }

        console.log('searchBtn', date)        // console.log('searchBtn', { MainDate: date, state: year, month: month, Search: Search })
        const data = await getPromise('/jbd/searchRenter?year=' + year + '&month=' + month + '&renter=' + Search)
       
        setRows(data)
    }


    async function getPromise(param) {
        return await new Promise(async function (resolve, reject) {
            const Response = await fetch(apiUrl + param)
            const data = await Response.json();
            resolve(data)
        })
    }



    function BasicTable() {
        const dispatch = useDispatch();
        const SwitchComponent = (event) => {
            const [checked, setChecked] = useState(false);
            const handleChange = useCallback((e) => {
                const isChecked = e.target.checked;
                const renter = e.target.name
                setChecked(isChecked);
                dispatch(setCurrentName({value:renter,title:'수납하기'}))
                setPopContent(<InfoPopup/>)
                setDialogOpen(true)
            }, []);
            return (
                <FormControlLabel
                    control={<Switch checked={checked} onChange={handleChange} name={event.name} key={event.name} />}
                    label=""
                />
            );
        };
        const TableRowClick = (e) => {
            const renter = e.target.innerHTML
            console.log('tablerowClick : ',renter)
            dispatch(setCurrentName(''))
            dispatch(setCurrentName({value:renter,title:'계약정보'}))
            setPopContent(<InfoPopup/>);
            setDialogOpen(true);
        }

        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>상호(업체명)</TableCell>
                            <TableCell align="right">납부현황</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row"
                                    name={row.name}
                                    onClick={TableRowClick}
                                >
                                    {/* <input type="text" value={row.name} onChange={TableRowClick} /> */}
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">
                                    <SwitchComponent name={row.name} />
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
       const handleClose = () => {
        //   dispatch(setCurrentName(''));
        setDialogOpen(false);
          };
    function DialogComponents() {
        // const dispatch=useDispatch()
        const handleClose = () => {
        //   dispatch(setCurrentName(''));
        setDialogOpen(false);
          };

        return (
            <>
                < Dialog
                    open={DialogOpen}
                    keepMounted
                    onClose={handleClose}
                >
                    <DialogTitle>
                        <Grid container spacing={2} >
                            <Grid item xs={10} ><DialogTitle id="scroll-dialog-title">{popTitle}</DialogTitle></Grid>
                            <Grid item xs={2} >
                                <DialogActions>
                                    <Button onClick={handleClose}>CLOSE</Button>
                                </DialogActions>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    {PopContent}
                </Dialog>
            </>
        )
    }


    return (
        <Provider store={store}>
            <>  
                {/* <DialogComponents /> */}
                     < Dialog
                    open={DialogOpen}
                    keepMounted
                    onClose={handleClose}
                >
                    <DialogTitle>
                        <Grid container spacing={2} >
                            <Grid item xs={10} ><DialogTitle id="scroll-dialog-title">{popTitle}</DialogTitle></Grid>
                            <Grid item xs={2} >
                                <DialogActions>
                                    <Button onClick={handleClose}>CLOSE</Button>
                                </DialogActions>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    {PopContent}
                </Dialog>

                <div>
                    <React.Fragment>
                        <Box>
                            <Dtpicker />
                            <LinearProgress />
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <Grid container sx={{ width: '100%', backgroundColor: 'blud' }}>
                                <Grid item xs={12} >
                                    <ButtonGroup variant="contained" aria-label="outlined primary button group"
                                        sx={{ width: '100%', bgcolor: '#fff', borderRadius: 0 }}>
                                        <TextField id="outlined-search"
                                            sx={{ width: '100%', marginTop: '10px', marginLeft: '10px' }}
                                            label="Search" type="search"
                                            onChange={e => {
                                                setSearch(e.target.value)
                                            }}
                                            value={Search}
                                        />

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
                    </React.Fragment>
                </div>
            </>

        </Provider>
    )
}

export default MainTable;
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import store from './store'
import { getPromise } from './common.js'
import { Provider, useDispatch } from 'react-redux';
import { setCurrentName } from './store';
import { asyncUpFetch } from './storeAsync';
import storeAsync from './storeAsync';

const apiUrl = process.env.REACT_APP_API_URL;
var i=0;

export default function ProviderSelect(props) {
    const state = store.getState();
    const getRenter=storeAsync.getState()

    const [renter, setRenter] = React.useState([]);
    const [renterName, setRenterName] = React.useState(props.value);



    React.useEffect(() => {
        i++
        const searchBtn = async () => {
          const data = await getPromise('/jbd/searchRenter')
        //   console.log(data)
          console.log(props.title)
          setRenter(data);
        }
        searchBtn();
        setRenterName(props.value)
        console.log(i)
      }, [props.title,props.value]);
      



    function Pro() {
        const dispatch = useDispatch();
        const subscribeCallback = () => {
            const state = store.getState();
            setRenterName(state.contentPop.value)
        };
        store.subscribe(subscribeCallback);



        const handleChange = (event) => {
            event.preventDefault();
            setRenterName(event.target.value)
            dispatch(setCurrentName(event.target.value))
            // props.onChange(event.target.value)
            // console.log('prohandleChange', { eventTaget: event.target.value, value: renterName })
        };
        return (
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">임차인</InputLabel>

                    <Select
                        value={state.contentPop.value}
                        onChange={handleChange}
                        sx={{ height: '42px' }}
                    >
                        <MenuItem value="선택">- 선택 -</MenuItem>
                         {renter.map((item) => (
                            <MenuItem key={item.name} value={item.name}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        );
    }
    return (
        <Provider store={store}>
            <div>
                <Pro></Pro>
            </div>
        </Provider>

    );
}
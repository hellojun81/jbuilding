import './App.css';
import Dtpicker from './components/Dtpicker.js'
import LinearProgress from './components/LinearProgress.js'
import Mainbody from './components/MainBody.js'
import React, { useRef, useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Payment from './components/Payment.js'
import RentBill from './components/RentBill.js'
import Grid from '@mui/material/Grid';
import RentEr from './components/Renter.js'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import BungalowIcon from '@mui/icons-material/Bungalow';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
const apiUrl = process.env.REACT_APP_API_URL;
const actions = [
  { icon: <DownloadIcon />, name: '엑셀다운로드2', operation: 'excelDown' },
  { icon: <ArticleIcon />, name: '청구서생성', operation: 'RentBill' },
  { icon: <BungalowIcon />, name: '임차인추가', operation: 'RentEr' },
  { icon: <CheckIcon />, name: '수납하기', operation: 'Payment' },
];


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function Header(props) {
  return <header>
    <h1 style={{ textAlign: 'left', paddingLeft: '20px' }}><a className="MainTitle" href='/'
      style={{ textDecoration: 'none' }}
      onClick={(e) => {
        e.preventDefault();
        props.onChangeMode()
      }}>{props.title}</a></h1>
  </header>
}


function App() {
  const [Mode, setMode] = useState('main');
  const [DialogOpen, setDialogOpen] = React.useState(false);
  const [popTitle, setpopTitle] = React.useState();
  const [PopContent, setPopContent] = React.useState();
  const mainTable = useRef(null);

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };



  if (Mode === 'main') {

  }


  const SpeedDialClick = (e) => {
    console.log('SpeedDialClick', e)
    if (e === 'RentBill') {
      setPopContent(<RentBill />)
      setDialogOpen(true)
      setpopTitle('청구서생성')
    } else if (e === 'RentEr') {
      setPopContent(<RentEr />)
      setDialogOpen(true)
      setpopTitle('임차인추가')
    } else if (e === 'Payment') {
      setPopContent(<Payment />)
      setDialogOpen(true)
      setpopTitle('수납하기')
    } else if (e === 'excelDown') {

    }

  };
  const ReciveData = (event) => {
    if (event) {
      if ('Payment' in event) {
        setPopContent(<Payment />)
        setDialogOpen(true)
        setpopTitle('수납하기')
      }else  if ('MainTable' in event) {
        setPopContent(<RentEr />)
        setDialogOpen(true)
        setpopTitle('계약정보')
      }
    }
  }

  return (
    <div className="App">
      <Header title="제이빌딩 임대료관리" />
      <Dtpicker />
      <LinearProgress />

      <Dialog
        open={DialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
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

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {PopContent}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
          <Box sx={{ bgcolor: '#fff', height: '100%', borderRadius: '16px', marginTop: '30px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Mainbody ref={mainTable} sendData={(value) => ReciveData(value)} >
            </Mainbody>
          </Box>
        </Container>
      </React.Fragment>
      <Box sx={{
        height: 320, transform: 'translateZ(0px)', flexGrow: 1,
        position: 'fixed',
        bottom: '10px',
        right: '10px',
      }}>


        <SpeedDial
          ariaLabel="SpeedDial example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon openIcon={<CloseIcon />} />}
          onClick={SpeedDialClick}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={(e) => {
                console.log(action.operation)
                SpeedDialClick(action.operation)
              }}
            />
          ))}
        </SpeedDial>
      </Box>
    </div >
  );
}

export default App;

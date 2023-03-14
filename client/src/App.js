import './App.css';
import Mainbody from './components/MainBody.js'
import LinearProgress from './components/LinearProgress.js'
import React, { useRef, useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Payment from './components/Payment.js'
import Grid from '@mui/material/Grid';
import InfoPopup from './components/infoPopup.js'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import BungalowIcon from '@mui/icons-material/Bungalow';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import store from './components/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
// import { setCurrentName } from './store';


const actions = [
  { icon: <DownloadIcon />, name: '엑셀다운로드2', operation: 'excelDown' },
  { icon: <ArticleIcon />, name: '청구서생성', operation: 'RentBill' },
  { icon: <BungalowIcon />, name: '임차인추가', operation: 'RentEr' },
  { icon: <CheckIcon />, name: '수납하기', operation: 'Payment' },
];



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
  const [DialogOpen, setDialogOpen] = useState(false);
  const [popTitle, setpopTitle] = useState();
  const [PopContent, setPopContent] = useState();
  const handleClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    const subscribeCallback = () => {
        const state = store.getState();
        const renter = state.contentPop.value
        const title = state.contentPop.title
        console.log('App : state change')
    };
    store.subscribe(subscribeCallback);
    return () => {
        store.unsubscribe(subscribeCallback);
    };
}, []);



  const SpeedDialClick = (e) => {
     console.log('SpeedDialClick')
    if (e === 'RentBill') {
      setPopContent(<InfoPopup
        textValue={[['임대료', '관리비', '부가세', '기타', '메모']]}
        textValueName={[['rentBill', 'mngBill', 'vat', 'etc', 'memo']]}
        title={'청구서생성'}
        send={'App.js'}
      />)
      setDialogOpen(true)
      setpopTitle('청구서생성')
    } else if (e === 'RentEr') {
      setPopContent(<InfoPopup
        textValue={[['건물명', '동호수', '입주자[상호]', '사업자번호', '담당자', '연락처', '이메일', '메모'], ['보증금', '임대료', '관리비', '기타']]}
        textValueName={[['buildingName', 'add', 'name', 'liceness', 'manager', 'tel', 'email', 'memo'], ['depogit', 'rentbill', 'mngbill', 'etc']]}
        title={'임차인추가'}
        send={'App.js'}
      />)
      setDialogOpen(true)
      setpopTitle('임차인추가')
    } else if (e === 'Payment') {
      setPopContent(<InfoPopup 
        textValue={[['임대료', '관리비', '부가세', '기타', '메모']]}
        textValueName={[['rentBill', 'mngBill', 'vat', 'etc', 'memo']]}
        title={'수납하기'}
        send={'App.js'}
      />)
      setDialogOpen(true)
      setpopTitle('수납하기')
    } else if (e === 'excelDown') {

    }

  };


  return (

    <div className="App" sx={{ maxWidth: '600px' }}>

      {/* <ContentPop /> */}
      <Header title="제이빌딩 임대료관리" />
      <Dialog
        open={DialogOpen}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description">
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
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
          <Mainbody />
        </Container>
      </React.Fragment>
      <Box sx={{
        height: 320, transform: 'translateZ(0px)', flexGrow: 1,
        // position: 'fixed',
        bottom: '10px',
        right: '10px',
      }}>


        <SpeedDial
          ariaLabel="SpeedDial example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon openIcon={<CloseIcon />} />}
          // onClick={SpeedDialClick}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={(e) => {
                // console.log(action.operation)
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

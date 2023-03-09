import React, { useRef, useEffect, useState, useImperativeHandle } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
// import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
// import SaveIcon from '@mui/icons-material/Save';
// import PrintIcon from '@mui/icons-material/Print';
// import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import BungalowIcon from '@mui/icons-material/Bungalow';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
const actions = [
    { icon: <DownloadIcon />, name: '엑셀다운로드' },
    { icon: <ArticleIcon />, name: '청구서생성' },
    { icon: <BungalowIcon />, name: '임차인추가' },
];

export default function OpenIconSpeedDial() {
    return (
        <Box sx={{
            height: 320, transform: 'translateZ(0px)', flexGrow: 1,
            position: 'fixed',
            bottom: '10px',
            right: '10px',
        }}>
            <SpeedDial
                ariaLabel="SpeedDial openIcon example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon openIcon={<EditIcon />} />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}


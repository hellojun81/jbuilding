import React, { useRef, useEffect, useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{  }}>
            <Box sx={{ width: '100%',height:'10px'}}>
                <LinearProgress variant="determinate" {...props} sx={{ width: '100%',height:'10px'}}/>
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

export default function LinearWithValueLabel() {
    const [progress, setProgress] = useState(10);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Box sx={{ marginTop: '80px' }}>
            <Grid container>
                <Grid item xs={2}></Grid>
                <Grid item xs={8} >
                    <LinearProgressWithLabel value={Number(100)} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={2}></Grid>
            </Grid>
        </Box>

    );
}
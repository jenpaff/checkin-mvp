import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import { CheckinInterface, deployApp, LocationCheck } from './CheckIn.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

let CheckIn; // this will hold the dynamically imported './sudoku-zkapp.ts'

ReactDOM.render(<App />, document.querySelector('#root'));

function App() {
  const [lat, setLat] = useState<any | null>(null);
  const [lng, setLng] = useState<any | null>(null);
  // const [geoHash, setGeoHash] = useState<any | null>(null);
  // const [geoHashInt, setGeoHashInt] = useState<any | null>(null);
  let [zkapp, setZkapp] = useState();
  let [isLoading, setLoading] = useState(false);
  let [isFirstRender, setFirstRender] = useState(true);
  let [showSubmissionSuccess, setSubmissionSuccess] = useState(false);
  let [showSubmissionError, setSubmissionError] = useState(false);

  useEffect(() => {
    // 👇️ only runs once
    console.log('useEffect ran');

    async function deploy() {
      if (!isFirstRender) return;
      setFirstRender(true);
      CheckIn = await import('../build/CheckIn.js');
      let zkapp = await CheckIn.deployApp();
      setZkapp(zkapp);
      setFirstRender(false);
      console.log('Initial state checkedIn '+zkapp.getState().checkedIn);
      console.log('Initial state targetGeoHash '+zkapp.getState().targetGeoHash);
      console.log(zkapp);
    }

    deploy();
  }, []);

  const shareLocation = () => {
    if (showSubmissionError) {
      setSubmissionError(false);
    }
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('Latitude is :', position.coords.latitude);
      console.log('Longitude is :', position.coords.longitude);
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
      // setGeoHashInt(
      //   geohash.encode_int(
      //     position.coords.latitude,
      //     position.coords.longitude,
      //     9
      //   )
      // );
    });
  };

  const submit = async (zkapp: CheckinInterface) => {
    console.log('Submitting location: '+lat+','+lng);
    setLoading(true);
    // uncomment line below to test happy path
    // let location = new CheckIn.LocationCheck(48.208487, 16.372571);
    let location = new CheckIn.LocationCheck(48.208487, 16.372571);
    await zkapp.checkIn(location);
    let checkin = zkapp?.getState().checkedIn;
    if (checkin) {
      setSubmissionSuccess(true);
    } else {
      setSubmissionError(true);
      setLat(null);
      setLng(null);
    }
    setLoading(false);
  }

  return (
    <>
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading || isFirstRender}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
    <div>
        <Container fixed>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <p className="riddle">Some question on sharing location ... </p>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="10vh"
          >
            <p>
              Solve by sharing your location 👉 <FontAwesomeIcon icon={faLocationDot} onClick={shareLocation} style={{color: '#ffafbd'}} size="2x" />
            </p>
          </Box>
          {!showSubmissionError && !showSubmissionSuccess && <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="20vh"
          >
            <p>
              {lat && <p>Latitude: {lat}, </p>}
              {lng && <p>Longitude: {lng}</p>}
            </p>
            <p style={{ marginLeft: '20px', marginTop: '10px' }}>
              {lat && lng && (
                <Button
                  variant="contained"
                  onClick={()=>{
                    submit(zkapp);
                  }}
                  style={{ backgroundColor: '#ffafbd' }}
                >
                  Submit solution
                </Button>
              )}
            </p>
          </Box>}

          {showSubmissionError && <Box component="div"
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="20vh"
          >
            <p className="submission-error">
              Wrong Location, try again!
            </p>
      </Box>}

      {showSubmissionSuccess && <Box component="div"
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="20vh"
          >
            <p className="submission-error">
              Nice one! 
            </p>
      </Box>}

        </Container>
      </div>
      </>
  );
}
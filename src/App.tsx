import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import geohash from 'ngeohash';
import { Box } from '@mui/material';

function App() {
  const [lat, setLat] = useState<any | null>(null);
  const [lng, setLng] = useState<any | null>(null);
  const [geoHash, setGeoHash] = useState<any | null>(null);
  const [geoHashInt, setGeoHashInt] = useState<any | null>(null);

  const shareLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('Latitude is :', position.coords.latitude);
      console.log('Longitude is :', position.coords.longitude);
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
      setGeoHash(
        geohash.encode(position.coords.latitude, position.coords.longitude, 9)
      );
      setGeoHashInt(
        geohash.encode_int(
          position.coords.latitude,
          position.coords.longitude,
          9
        )
      );

      // Latitude: 48.208492 Longitude: 16.373755
      let center_geohash = geohash.encode(48.20849, 16.373755, 9);
      console.log('vienna viennaCenter geohash :', center_geohash);
      let viennaCenter = geohash.neighbors(center_geohash);
      console.log('vienna viennaCenter + neighbours :', viennaCenter);
      let center_geohash_int = geohash.encode_int(48.20849, 16.373755);
      console.log('vienna viennaCenter geohash int:', center_geohash_int);
      let viennaCenter_neighbours_int =
        geohash.neighbors_int(center_geohash_int);
      console.log(
        'vienna viennaCenter_neighbours_int :',
        viennaCenter_neighbours_int
      );
    });
  };

  function submit() {
    console.log('Hello!');
  }

  return (
    <Container fixed>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <p className="riddle">Some question on sharing location ... </p>
        <Button
          variant="contained"
          onClick={shareLocation}
          style={{ backgroundColor: 'grey' }}
        >
          Share Location
        </Button>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="20vh"
      >
        <p>
          {lat && <p>Latitude: {lat}, </p>}
          {lng && <p>Longitude: {lng}</p>}
        </p>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="20vh"
      >
        <p style={{ marginTop: '10px' }}>
          {lat && lng && (
            <Button
              variant="contained"
              onClick={submit}
              style={{ backgroundColor: 'grey' }}
            >
              Submit solution
            </Button>
          )}
        </p>
      </Box>
    </Container>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));

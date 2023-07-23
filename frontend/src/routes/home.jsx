import { Box, Button } from '@mui/joy';
import { Link } from 'react-router-dom';
import hero from '../assets/hero.svg';
const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img src={hero} style={{ height: '40vmax' }} alt="" />
      <Button component={Link} to="students" color="success">
        go to dashboard
      </Button>
    </Box>
  );
};

export default Home;

```js
const nestedData = (data) => {
  const buildTree = (items, parentId = null) => {
    const result = [];
    const children = _.filter(items, { parent: parentId });

    for (const child of children) {
      const { ...rest } = child; // Omit the "_id" and "parent" properties

      const subRows = buildTree(items, rest._id);
      if (subRows.length > 0) {
        rest.subRows = subRows.reverse();
      }

      result.push(rest);
    }

    return result;
  };

  // const rootItems = _.filter(data, { parent: null });

  return buildTree(data, null);
};
```

```jsx
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
```

```jsx
import { Container } from '@mui/joy';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Outlet />
    </Container>
  );
};
```

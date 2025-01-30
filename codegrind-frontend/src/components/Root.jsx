import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

function Root() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

export default Root; 
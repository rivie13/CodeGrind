import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  return (
    <nav>
      <div className="nav-container">
        <h1>CodeGrind</h1>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link 
            to="/problems" 
            className={location.pathname.includes('/problems') ? 'active' : ''}
          >
            Problem List
          </Link>
          <Link 
            to="/profile" 
            className={location.pathname === '/profile' ? 'active' : ''}
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

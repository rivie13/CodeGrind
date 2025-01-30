import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="welcome-container">
      <h1>Welcome to CodeGrind</h1>
      <p>Master Data Structures and Algorithms through interactive practice</p>
      <Link to="/problems" className="cta-button">
        Start Practicing
      </Link>
    </div>
  );
}

export default Home;

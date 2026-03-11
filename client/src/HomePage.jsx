import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div>
      <h1>Asset Allocator</h1>
      <div>
        <Link to="/portfolio">Let's go to Portfolio Page!!</Link>
      </div>
      <div>
        <Link to="/scenariocomparison">
          Let's go to Scenario Comparison Page!!
        </Link>
      </div>
    </div>
  );
}
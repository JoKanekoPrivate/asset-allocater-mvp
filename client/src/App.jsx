import { Routes, Route } from 'react-router-dom'
import { HomePage } from './HomePage'
import { PortfolioPage } from './Portfoliopage'
import { ScenarioComparisonPage } from './ScenarioComparisonPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/scenariocomparison" element={<ScenarioComparisonPage />} />
    </Routes>
  );
}

export default App

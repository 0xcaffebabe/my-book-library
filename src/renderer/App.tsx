import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from '../views/pages/HomePage'

export default function App() {
  return (
    <Router>
      <div className='test'>111</div>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

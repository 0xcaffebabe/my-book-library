import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from '../views/pages/home/HomePage'
import ReaderPage from '../views/pages/reader/ReaderPage';
import TitleBar from '../views/components/TitleBar'

export default function App() {
  return (
    <div>
    <TitleBar />
    <div style={{paddingTop: '34px'}}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/reader" element={<ReaderPage />} />
        </Routes>
      </Router>
    </div>
    </div>
  );
}

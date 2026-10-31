import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CTCoreProvider } from './lib/store';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Interview from './pages/Interview';
import LiveInterview from './pages/LiveInterview';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import QuestionBank from './pages/QuestionBank';

export default function App() {
  return (
    <CTCoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/results" element={<Results />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/question-bank" element={<QuestionBank />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          {/* Immersive full-screen interview shell (no nav/footer) */}
          <Route path="/interview/live" element={<LiveInterview />} />
        </Routes>
      </HashRouter>
    </CTCoreProvider>
  );
}

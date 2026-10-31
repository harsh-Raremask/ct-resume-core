import { ToastProvider } from './context/ToastContext';
import Home from './pages/Home';

export default function App() {
  return (
    <ToastProvider>
      <Home />
    </ToastProvider>
  );
}

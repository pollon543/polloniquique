import { PollonProvider } from './context/PollonContext.jsx';
import { Home } from './pages/Home.jsx';

export default function App() {
  return (
    <PollonProvider>
      <Home />
    </PollonProvider>
  );
}

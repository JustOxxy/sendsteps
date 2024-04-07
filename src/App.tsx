import { NextUIProvider } from '@nextui-org/react';
import { Home } from './Home';

function App() {
  return (
    <NextUIProvider>
      <Home />
    </NextUIProvider>
  );
}

export default App;

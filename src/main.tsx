import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { registerSW } from 'virtual:pwa-register';
import { App } from './app';
import './styles.css';

function Root() {
  const [offlineReady, setOfflineReady] = useState(false);
  useEffect(() => {
    registerSW({
      immediate: true,
      onOfflineReady: () => {
        setOfflineReady(true);
        window.setTimeout(() => setOfflineReady(false), 4000);
      },
    });
  }, []);
  return <App offlineReady={offlineReady} />;
}

render(<Root />, document.getElementById('app')!);

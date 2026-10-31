import { useEffect, useState } from 'preact/hooks';

// Hash routing works from any folder (GitHub Pages, a school server, a USB stick) without server config.
const parse = () =>
  window.location.hash
    .replace(/^#\/?/, '')
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent);

export const useRoute = () => {
  const [parts, setParts] = useState(parse);
  useEffect(() => {
    const onChange = () => {
      setParts(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return parts;
};

export const go = (...parts: string[]) => {
  window.location.hash = '/' + parts.map(encodeURIComponent).join('/');
};

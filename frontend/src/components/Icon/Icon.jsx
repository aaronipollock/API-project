import Favicon from 'react-favicon';

const Icon = () => {
  const iconUrl = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
      <text x="2" y="18" font-family="monospace" font-size="20" fill="#ff0000">{}</text>
    </svg>
  `);

  return <Favicon url={iconUrl} />;
}

export default Icon;

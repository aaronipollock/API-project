import Favicon from 'react-favicon';
import { HiOutlineLink } from 'react-icons/hi';

const Icon = () => {
  const iconUrl = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
      <path d="M17.657 6.343a8 8 0 0 1 0 11.314l-1.414-1.414a6 6 0 0 0 0-8.486l-2.828-2.828 1.414-1.414 2.828 2.828zm-5.657 9.657a6 6 0 0 0 8.485 0l1.415 1.415a8 8 0 0 1-11.314 0l-2.828-2.829 1.414-1.414 2.828 2.828zm-4.242-4.242a6 6 0 0 0 8.485 0l-2.828-2.829-1.414 1.414 2.829 2.828a4 4 0 0 1-5.656 0l-2.828-2.829 1.414-1.414 2.829 2.828z"/>
    </svg>
  `);

  return (
    <>
      <Favicon url={iconUrl} />
      <div>
        <HiOutlineLink size={64} />
      </div>
    </>
  );
}

export default Icon;

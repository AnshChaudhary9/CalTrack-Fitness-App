import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Logo = () => {
  const { user } = useContext(AuthContext);

  return (
    <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3">
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <g>
          <circle cx="20" cy="25" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M 20 31 L 20 60" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M 20 38 Q 12 34 10 28" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M 20 38 L 28 46" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M 20 60 L 16 78" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M 20 60 L 24 78" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="16" y="31" width="8" height="6" fill="currentColor" />
          <path d="M 18 45 L 18 60 L 22 60 L 22 45 Z" fill="currentColor" />
          <path d="M 14 25 Q 8 20 6 12 Q 5 5 8 4 Q 12 3 14 8" fill="currentColor" />
          <rect x="26" y="44" width="3" height="2" stroke="currentColor" strokeWidth="0.8" fill="none" rx="0.3" />
          <rect x="45" y="15" width="28" height="35" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="48" y="18" width="22" height="29" rx="1.5" fill="white" stroke="currentColor" strokeWidth="0.8" />
          <rect x="70" y="30" width="2" height="6" fill="currentColor" rx="0.5" />
          <g transform="translate(51, 21)">
            <path d="M 3 4 Q 4 2 5 4 Q 6 2 7 4 L 7 6" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <rect x="2" y="2" width="6" height="6" fill="currentColor" />
          </g>
          <g transform="translate(60, 21)">
            <path d="M 4 2 Q 5 4 4 6 Q 3 5 4 2" stroke="currentColor" strokeWidth="1" fill="none" />
          </g>
          <g transform="translate(51, 32)">
            <rect x="1" y="4" width="1.5" height="3" fill="currentColor" />
            <rect x="3" y="3" width="1.5" height="4" fill="currentColor" />
            <rect x="5" y="1" width="1.5" height="6" fill="currentColor" />
          </g>
          <g transform="translate(60, 32)">
            <rect x="1" y="3" width="5" height="1.5" fill="currentColor" />
            <rect x="0" y="2.5" width="1.5" height="2.5" fill="currentColor" />
            <rect x="6.5" y="2.5" width="1.5" height="2.5" fill="currentColor" />
          </g>
          <rect x="45" y="50" width="28" height="6" fill="currentColor" />
        </g>
      </svg>
      <span className="text-2xl font-bold text-[#1F1F1F] tracking-tight">CalTrack</span>
    </Link>
  );
};

export default Logo;


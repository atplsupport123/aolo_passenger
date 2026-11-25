import React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';

interface ChaiCupIconProps {
  size?: number;
}

export const ChaiCupIcon: React.FC<ChaiCupIconProps> = ({ size = 28 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      {/* Saucer / Plate underneath */}
      <Ellipse cx="16.5" cy="27" rx="13" ry="4.2" fill="#8B7BBD" opacity={0.5} />
      <Ellipse cx="16.5" cy="26" rx="12.5" ry="3.6" fill="#A495D6" />
      <Ellipse cx="16.5" cy="25.2" rx="8.5" ry="2" fill="#7E6FB2" opacity={0.6} />

      {/* Cup Handle on the right */}
      <Path
        d="M23 16.2 C28.5 16.2 29.5 22.5 22.8 23.5"
        stroke="#A495D6"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M23 17 C26.8 17 27.8 21.8 22.8 22.5"
        stroke="#7A6BAE"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cup Body (tapered) */}
      <Path
        d="M7 15.5 C7 23.5 10 25.5 16.5 25.5 C23 25.5 26 23.5 26 15.5 Z"
        fill="#9887CF"
      />
      {/* Cup Body Shading */}
      <Path
        d="M7 15.5 C7 23.5 10 25.5 16.5 25.5 C11.5 25.5 8 22.5 7.5 15.5 Z"
        fill="#7A6BAE"
        opacity={0.55}
      />
      <Path
        d="M25.5 15.5 C25 22.5 21.5 25.5 16.5 25.5 C21.5 25.5 24.5 23.5 25.5 15.5 Z"
        fill="#BDB1E8"
        opacity={0.6}
      />

      {/* Cup Rim */}
      <Ellipse cx="16.5" cy="15.5" rx="9.5" ry="3.6" fill="#B4A6E4" />

      {/* Dark Chai / Tea Surface */}
      <Ellipse cx="16.5" cy="15.7" rx="8.2" ry="2.8" fill="#3D1D0D" />

      {/* Warm Chai Layer Highlight */}
      <Ellipse cx="16" cy="15.9" rx="6.2" ry="1.9" fill="#582B14" />
      <Path
        d="M12.5 15.7 C13.8 14.8 16.5 14.8 18.2 15.6"
        stroke="#80411F"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Steam Wisps */}
      <Path
        d="M13.5 10.5 C12.8 9 13.8 8 13.2 6.5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity={0.75}
      />
      <Path
        d="M18.5 11 C19.2 9.5 18.2 8.5 18.8 7"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity={0.75}
      />
    </Svg>
  );
};

export default ChaiCupIcon;

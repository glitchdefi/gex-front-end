import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 36 36" {...props}>
      <g clipPath="url(#clip0_1782_8054)">
      <circle cx="18" cy="18" r="32" fill="#23353B"/>
      <path d="M2 45.7128C-2.37337 43.1878 -6.08707 39.6637 -8.83746 35.4284C-11.5879 31.1932 -13.2968 26.3672 -13.8247 21.3449C-14.3526 16.3226 -13.6843 11.2467 -11.8746 6.53222C-10.0648 1.8177 -7.165 -2.40158 -3.41217 -5.78064C0.340662 -9.15971 4.83994 -11.6026 9.7178 -12.9096C14.5957 -14.2166 19.7136 -14.3507 24.6532 -13.3007C29.5928 -12.2508 34.2137 -10.0467 38.1383 -6.86866C42.0628 -3.69063 45.1795 0.371101 47.2335 4.98445L18 18L2 45.7128Z" fill="#395660"/>
      </g>
      <defs>
      <clipPath id="clip0_1782_8054">
      <rect width="36" height="36" rx="18" fill="white"/>
      </clipPath>
      </defs>
    </Svg>
  );
};

export default Icon;

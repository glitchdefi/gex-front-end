import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <svg width="74" height="64" {...props} viewBox="0 0 74 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_dd_1839_1924)">
<circle cx="37" cy="32" r="32" fill="#001529"/>
</g>
<path d="M38.618 32L46.8211 22.2219C46.9586 22.0594 46.843 21.8125 46.6305 21.8125H44.1368C43.9899 21.8125 43.8493 21.8781 43.7524 21.9906L36.9868 30.0563L30.2211 21.9906C30.1274 21.8781 29.9868 21.8125 29.8368 21.8125H27.343C27.1305 21.8125 27.0149 22.0594 27.1524 22.2219L35.3555 32L27.1524 41.7781C27.1216 41.8143 27.1018 41.8586 27.0955 41.9058C27.0891 41.9529 27.0964 42.0008 27.1164 42.0439C27.1365 42.087 27.1685 42.1235 27.2087 42.1489C27.2489 42.1744 27.2955 42.1878 27.343 42.1875H29.8368C29.9836 42.1875 30.1243 42.1219 30.2211 42.0094L36.9868 33.9438L43.7524 42.0094C43.8461 42.1219 43.9868 42.1875 44.1368 42.1875H46.6305C46.843 42.1875 46.9586 41.9406 46.8211 41.7781L38.618 32Z" fill="#D32029"/>
<defs>
<filter id="filter0_dd_1839_1924" x="0" y="0" width="74" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.945098 0 0 0 0 0 0 0 0 0 0.960784 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1839_1924"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_1839_1924" result="effect2_dropShadow_1839_1924"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1839_1924" result="shape"/>
</filter>
</defs>
</svg>

    // <Svg viewBox="0 0 24 24" {...props}>
    //   <path d="M12 7C12.55 7 13 7.45 13 8V12C13 12.55 12.55 13 12 13C11.45 13 11 12.55 11 12V8C11 7.45 11.45 7 12 7ZM11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM13 17H11V15H13V17Z" />
    // </Svg>
  );
};

export default Icon;

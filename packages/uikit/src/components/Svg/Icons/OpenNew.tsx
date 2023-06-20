import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 14 14" {...props}>
      <path d="M1.25 0.75H12.75C13.0266 0.75 13.25 0.973437 13.25 1.25V12.75C13.25 13.0266 13.0266 13.25 12.75 13.25H7.125C7.05625 13.25 7 13.1938 7 13.125V12.25C7 12.1812 7.05625 12.125 7.125 12.125H12.125V1.875H1.875V6.875C1.875 6.94375 1.81875 7 1.75 7H0.875C0.80625 7 0.75 6.94375 0.75 6.875V1.25C0.75 0.973437 0.973437 0.75 1.25 0.75ZM4.79219 8.36563L3.97656 7.55C3.96004 7.5334 3.94851 7.51249 3.94328 7.48965C3.93805 7.46682 3.93934 7.44298 3.94699 7.42084C3.95464 7.3987 3.96835 7.37915 3.98656 7.36442C4.00477 7.34969 4.02675 7.34036 4.05 7.3375L6.85312 7.00937C6.93281 7 7.00156 7.06719 6.99219 7.14844L6.66406 9.95156C6.65156 10.0547 6.525 10.0984 6.45156 10.025L5.63281 9.20625L1.62969 13.2094C1.58125 13.2578 1.50156 13.2578 1.45312 13.2094L0.790625 12.5469C0.742188 12.4984 0.742188 12.4187 0.790625 12.3703L4.79219 8.36563Z"/>
    </Svg>
  );
};

export default Icon;

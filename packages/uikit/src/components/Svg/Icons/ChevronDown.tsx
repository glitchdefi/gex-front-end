import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 12 8" {...props} width={12}>
      <path d="M11.8125 0H10.6406C10.5609 0 10.4859 0.0390626 10.439 0.103125L5.99995 6.22188L1.56089 0.103125C1.51402 0.0390626 1.43902 0 1.35933 0H0.187454C0.0858913 0 0.0265163 0.115625 0.0858913 0.198438L5.59527 7.79375C5.79527 8.06875 6.20464 8.06875 6.40308 7.79375L11.9125 0.198438C11.9734 0.115625 11.914 0 11.8125 0Z" fill="#00FFFF"/>
    </Svg>
  );
};

export default Icon;

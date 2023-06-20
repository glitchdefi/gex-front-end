import React from "react";
import styled from 'styled-components'
import {
  Image,
} from '@pancakeswap/uikit'
import { SvgProps } from "../types";

const LogoWrapper = styled.div`
  width: 100%;
`;

interface LogoProps extends SvgProps {
  isDark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isDark, ...props }) => {
  return (
    <LogoWrapper>
      <img src="/images/gex-logo.png" height={60} width={148} alt="Gex logo" />
    </LogoWrapper>

  );
};

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark);

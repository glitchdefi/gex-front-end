import styled from "styled-components";
import { m as Motion } from "framer-motion";

export const Arrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    z-index: -1;
  }

  &::before {
    content: "";
    transform: rotate(45deg);
    background: #1C2A2F;
  }
`;

export const StyledTooltip = styled(Motion.div)`
  padding: 16px;
  font-size: 14px;
  line-height: 130%;
  max-width: 320px;
  z-index: 101;
  background: #1C2A2F;
  color: #E5ECEF;
  box-shadow: 1px -1px 10px 5px rgba(0,0,0,0.53);

  &[data-popper-placement^="top"] > ${Arrow} {
    bottom: -4px;
  }

  &[data-popper-placement^="bottom"] > ${Arrow} {
    top: -4px;
  }

  &[data-popper-placement^="left"] > ${Arrow} {
    right: -4px;
  }

  &[data-popper-placement^="right"] > ${Arrow} {
    left: -4px;
  }
`;

import React, { useContext } from "react";
import styled from "styled-components";
import { variant as systemVariant, space } from "styled-system";
import { WarningIcon, ErrorIcon, CheckmarkCircleFillIcon } from "../Svg";
import { Text, TextProps } from "../Text";
import { Box } from "../Box";
import { MessageProps } from "./types";
import variants from "./theme";

const MessageContext = React.createContext<MessageProps>({ variant: "success" });

const Icons = {
  warning: WarningIcon,
  danger: ErrorIcon,
  success: CheckmarkCircleFillIcon,
};

const MessageContainer = styled.div<MessageProps>`
  background-color: transparent;
  padding: 16px;
  border-radius: 0px;
  border: solid 1px;

  ${space}
  ${systemVariant({
  variants,
})}
`;

const Flex = styled.div`
  display: flex;
`;

const colors = {
  // these color names should be place in the theme once the palette is finalized
  warning: "#D87A16",
  success: "#129E7D",
  danger: "failure",
};

export const MessageText: React.FC<TextProps> = ({ children, ...props }) => {
  const ctx = useContext(MessageContext);
  return (
    <Text fontSize="14px" color={colors[ctx?.variant]} {...props}>
      {children}
    </Text>
  );
};

const Message: React.FC<MessageProps> = ({ children, variant, icon, action, actionInline, ...props }) => {
  const Icon = Icons[variant];
  return (
    <MessageContext.Provider value={{ variant }}>
      <MessageContainer variant={variant} {...props}>
        <Flex>
          <Box mr="12px">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1.5C6.20156 1.5 1.5 6.20156 1.5 12C1.5 17.7984 6.20156 22.5 12 22.5C17.7984 22.5 22.5 17.7984 22.5 12C22.5 6.20156 17.7984 1.5 12 1.5ZM12 20.7188C7.18594 20.7188 3.28125 16.8141 3.28125 12C3.28125 7.18594 7.18594 3.28125 12 3.28125C16.8141 3.28125 20.7188 7.18594 20.7188 12C20.7188 16.8141 16.8141 20.7188 12 20.7188Z" fill="#D87A16" />
              <path d="M10.875 16.125C10.875 16.4234 10.9935 16.7095 11.2045 16.9205C11.4155 17.1315 11.7016 17.25 12 17.25C12.2984 17.25 12.5845 17.1315 12.7955 16.9205C13.0065 16.7095 13.125 16.4234 13.125 16.125C13.125 15.8266 13.0065 15.5405 12.7955 15.3295C12.5845 15.1185 12.2984 15 12 15C11.7016 15 11.4155 15.1185 11.2045 15.3295C10.9935 15.5405 10.875 15.8266 10.875 16.125ZM11.4375 13.5H12.5625C12.6656 13.5 12.75 13.4156 12.75 13.3125V6.9375C12.75 6.83437 12.6656 6.75 12.5625 6.75H11.4375C11.3344 6.75 11.25 6.83437 11.25 6.9375V13.3125C11.25 13.4156 11.3344 13.5 11.4375 13.5Z" fill="#D87A16" />
            </svg>
            {/* {icon ?? <Icon color={variants[variant].borderColor} width="24px" />} */}
          </Box>
          {children}
          {actionInline && action}
        </Flex>
        {!actionInline && action}
      </MessageContainer>
    </MessageContext.Provider>
  );
};

export default Message;

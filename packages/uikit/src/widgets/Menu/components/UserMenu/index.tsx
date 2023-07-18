import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { formatBigNumber } from 'utils/formatBalance'

import { Box, Flex } from "../../../../components/Box";
import { UserMenuProps, variants } from "./types";
import { UserMenuItem } from "./styles";

export const StyledUserMenu = styled(Flex)`
  border: 1px solid #395660;
  display: inline-flex;
  height: 32px;
  padding: 5px 16px;
  min-width: 258px;
  cursor: pointer;

  &:hover {
    opacity: 0.65;
  }
`;

export const StyledNetwork = styled(Flex)`
  border: 1px solid #395660;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  padding: 5px 16px;
  min-width: 191px;
  color: #49AA19;
  font-weight: 600;
  font-size: 14px;
  margin-right: 12px;
  cursor: pointer;

  img {
    margin-right: 8px;
  }

  &:hover {
    opacity: 0.65;
  }
`;

const WrongNetwork = styled.div`
  border: 1px solid rgb(0, 255, 255);
  color: rgb(0, 255, 255);
  font-weight: 600;
  width: 194px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  // margin-right: 15px;
`;

export const LabelText = styled.div`
  color: #00FFFF;

  display: flex;
  justify-content: center;
  align-items: center;

  span {
    color: #E5ECEF;
    font-size: 14px;
    line-height: 22px;
    min-width: 60px;
  }

  img {
    margin-right: 8px;
  }

  .divider {
    height: 16px;
  }
  
  .user-address {
    color: #00FFFF;
    font-weight: 600;
    width: auto;
  }
`;

const Menu = styled.div<{ isOpen: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding-bottom: 4px;
  padding-top: 4px;
  pointer-events: auto;
  width: 260px;
  visibility: visible;
  z-index: 1001;

  ${({ isOpen }) =>
    !isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}

  ${UserMenuItem}:first-child {
    border-radius: 8px 8px 0 0;
  }

  ${UserMenuItem}:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserMenu: React.FC<UserMenuProps> = ({
  account,
  text,
  avatarSrc,
  chainName,
  ellipsis = true,
  variant = variants.DEFAULT,
  bnbBalance = 0,
  children,
  ...props
}) => {
  const { error } = useWeb3React()
  const [isOpen, setIsOpen] = useState(false);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null);
  const accountEllipsis = account
    ? ellipsis
      ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
      : account
    : null;
  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: "fixed",
    placement: "bottom-end",
    modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
  });
  const isWrongNetwork: any = error && error instanceof UnsupportedChainIdError

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true);
    };

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node;
      if (target && !tooltipRef?.contains(target)) {
        setIsOpen(false);
        evt.stopPropagation();
      }
    };

    targetRef?.addEventListener("mouseenter", showDropdownMenu);
    targetRef?.addEventListener("mouseleave", hideDropdownMenu);

    return () => {
      targetRef?.removeEventListener("mouseenter", showDropdownMenu);
      targetRef?.removeEventListener("mouseleave", hideDropdownMenu);
    };
  }, [targetRef, tooltipRef, setIsOpen]);

  return (
    <StyledMenu>
      {
        !!isWrongNetwork && <WrongNetwork>
          Wrong Network
        </WrongNetwork>
      }
      {
        !isWrongNetwork &&
          <StyledNetwork>
            <img src={`${process.env.NEXT_PUBLIC_GLITCH_DOMAIN_URL}/images/gex-icon.svg`} alt="Glitch Icon" width="16px" />
            {chainName}
          </StyledNetwork>
      }

      {
        !isWrongNetwork && (
          <Flex alignItems="center" height="100%" {...props} ref={setTargetRef}>
            <StyledUserMenu
              onTouchStart={() => {
                setIsOpen((s) => !s);
              }}
            >
              <LabelText>
                <span>{bnbBalance ? formatBigNumber(bnbBalance, 6) : 0} GLCH</span>
                <div className="divider" />
                <img src={`${process.env.NEXT_PUBLIC_GLITCH_DOMAIN_URL}/images/avatar-icon.svg`} alt="avatar" />
                <span className="user-address">{text || accountEllipsis}</span>
              </LabelText>
            </StyledUserMenu>
            <Menu style={styles.popper} ref={setTooltipRef} {...attributes.popper} isOpen={isOpen}>
              <Box onClick={() => setIsOpen(false)}>{children?.({ isOpen })}</Box>
            </Menu>
          </Flex>
        )
      }
    </StyledMenu>
  );
};

export default UserMenu;

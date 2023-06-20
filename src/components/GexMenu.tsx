import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components'
import Link from 'next/link'
import {
  GexSwapIcon,
  LiquidityIcon,
} from '@pancakeswap/uikit'


interface Props {
  isDark?: boolean;
}

const StyledMenu = styled.div`
  width: 100%;
  min-height: 56px;
  align-items: center;
  background: #1C2A2F;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const MenuItem = styled.div<{
  isActive?: boolean;
}>`
  display: block;
  min-width: 105px;
  cursor: pointer;

  padding-bottom: 12px;
  border-bottom: 1px solid ${({isActive }) => isActive ? '#00FFFF' : 'none'};

  span {
    color: ${({isActive }) => isActive ? '#00FFFF' : '#A7C1CA'};
    margin-left: 12px;
  }
`;

const GexMenu: React.FC<Props> = ({ isDark }) => {
  const router = useRouter()
  const [menu, setMenu] = useState(['/', '/swap'].includes(router.pathname) ? 'swap' : 'liquidity');


  // useEffect(() => {

  // }, [router.pathname]);

  return (
    <StyledMenu>
      <Link href="/swap" passHref>
        <MenuItem isActive={menu === 'swap'}>
          <GexSwapIcon width={16} height={16} color={menu === 'swap' ? '#00FFFF' : '#A7C1CA'} />
          <span>Swap</span>
        </MenuItem>
      </Link>
      <Link href="/liquidity" passHref>
        <MenuItem isActive={menu === 'liquidity'}>
            <LiquidityIcon width={16} height={16} color={menu === 'liquidity' ? '#00FFFF' : '#A7C1CA'} />
            <span>Liquidity</span>
        </MenuItem>
      </Link>
    </StyledMenu>
  )
}

export default GexMenu
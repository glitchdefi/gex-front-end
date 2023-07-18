import React from "react";
import numeral from 'numeral'
import styled from 'styled-components'
import {
  Image,
} from '@pancakeswap/uikit'
import { useCurrentBlock } from 'state/block/hooks'
import { formatAmount } from 'utils/formatInfoNumbers'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'

const StyledFooter = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
  justify-content: space-between;
`;

const PriceWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;

  span {
    color: #A7C1CA;
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    margin-left: 8px;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 330px;

  span {
    color: #A7C1CA;
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    margin-left: 8px;
  }
`;

const BlocWrapper = styled.div`
  font-size: 12px;
  line-height: 20px;

  .block-title {
    color: #A7C1CA;
  }

  .block-value {
    color: #00FFFF;
  }
`;

const GexFooter: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const currentBlock = useCurrentBlock()
  // const amountInDollar = useBUSDCurrencyAmount(
  //   showBUSD ? currency : undefined,
  //   Number.isFinite(+value) ? +value : undefined,
  // )
  const price = useBNBBusdPrice()
  const usdtPricePerGLCH = price?.toSignificant(6)

  return (
    <StyledFooter>
      <PriceWrapper>
      {
        !!usdtPricePerGLCH && <>
        <Image src="/images/gex-small-icon.png" height={22} width={22} />
        <span>${usdtPricePerGLCH}</span>
      </>
      }
      </PriceWrapper>
      
      <RightWrapper>
        <Image src="/images/gex-small-icon.png" height={22} width={22} />
        <span>Powered by Glitch. All rights reserved.</span>
      </RightWrapper>
      <BlocWrapper>
        <span className="block-title">Block:</span>
        <span className="block-value">{numeral(currentBlock).format(0)}</span>
      </BlocWrapper>
    </StyledFooter>
  );
};

export default GexFooter;

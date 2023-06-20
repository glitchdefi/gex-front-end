/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";
import styled from "styled-components";
import { useMatchBreakpointsContext, Button } from '@pancakeswap/uikit'
import { useRouter } from "next/router";

import { Flex } from "../Box";
import { LogoIcon, LogoWithTextIcon, ArrowForwardIcon } from "../Svg";

const FooterWrapper = styled(Flex)`
  // background: #286E7D;
  background: linear-gradient(180deg, rgba(15, 84, 99, 0.8) 0%, rgba(14, 85, 101, 0.8) 90.69%);
  backdrop-filter: blur(200px);
  height: 77px;
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 670px) {
    padding-left: 20px;
  }
`;

const SocialNetworkWrapper = styled.div`
  display: flex;
  color: #fff;
  display: flex;
  margin-top: 12px;

  span {
    cursor: pointer;
  }

   a {
     margin-right: 24px;
   }

  .divider {
    display: block;
    height: 16px;
    width: 1px;
    background: #94C4C8;
    margin: 0px 20px;
  }
`;

const LogoWrapper = styled("a")`
  display: flex;
  align-items: center;
  color: #fff;
  margin-top: 7px;

  span {
    margin-top: 3px;
    margin-left: 11px;
    font-style: italic;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
  }

  .mobile-icon {
    width: 32px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
  }
  .desktop-icon {
    width: 160px;
    // display: none;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: block;
    }

    @media screen and (max-width: 670px) {
      width: 120px;
    }
  }
`;

const Tos = styled.div`
  display: flex;
  gap: 12px;

  @media screen and (max-width: 670px) {
    flex-direction: column;
  }
`;

const TwitterSvg = () => {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2.17863C21.1819 2.5375 20.3101 2.77537 19.4012 2.89087C20.3363 2.33262 21.0499 1.45537 21.3854 0.398C20.5136 0.91775 19.5511 1.28488 18.5254 1.48975C17.6976 0.608375 16.5179 0.0625 15.2309 0.0625C12.7339 0.0625 10.7236 2.08925 10.7236 4.57388C10.7236 4.93138 10.7539 5.27512 10.8281 5.60237C7.0785 5.4195 3.76063 3.62238 1.53175 0.88475C1.14262 1.55988 0.914375 2.33262 0.914375 3.1645C0.914375 4.7265 1.71875 6.11112 2.91775 6.91275C2.19313 6.899 1.48225 6.68862 0.88 6.35725C0.88 6.371 0.88 6.38888 0.88 6.40675C0.88 8.5985 2.44337 10.419 4.4935 10.8384C4.12637 10.9388 3.72625 10.9869 3.311 10.9869C3.02225 10.9869 2.73075 10.9704 2.45712 10.9099C3.0415 12.696 4.69975 14.0091 6.6715 14.0518C5.137 15.2521 3.18863 15.9754 1.07938 15.9754C0.7095 15.9754 0.35475 15.9589 0 15.9135C1.99787 17.2019 4.36562 17.9375 6.919 17.9375C15.2185 17.9375 19.756 11.0625 19.756 5.10325C19.756 4.90387 19.7491 4.71138 19.7395 4.52025C20.6346 3.885 21.3867 3.09162 22 2.17863Z" fill="white" />
    </svg>
  )
};

const MediumSvg = () => {
  return (
    <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.60878 3.46796C2.63611 3.2051 2.53312 2.94529 2.33147 2.76837L0.277311 0.359788V0H6.65546L11.5854 10.5238L15.9197 0H22V0.359788L20.2437 1.99882C20.0923 2.11116 20.0172 2.2958 20.0485 2.47854V14.5215C20.0172 14.7042 20.0923 14.8888 20.2437 15.0012L21.9589 16.6402V17H13.3315V16.6402L15.1083 14.9612C15.2829 14.7913 15.2829 14.7413 15.2829 14.4815V4.74721L10.3427 16.96H9.67507L3.92344 4.74721V12.9324C3.87548 13.2765 3.9929 13.623 4.24183 13.8718L6.55275 16.6002V16.96H0V16.6002L2.31092 13.8718C2.55804 13.6226 2.66861 13.2738 2.60878 12.9324V3.46796Z" fill="white" />
    </svg>
  )
};

const DiscordSvg = () => {
  return (
    <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.6239 1.5138C17.2217 0.872 15.7181 0.399153 14.1459 0.128333C14.1173 0.123107 14.0887 0.136168 14.0739 0.162293C13.8805 0.505387 13.6663 0.952982 13.5163 1.30479C11.8254 1.05226 10.1431 1.05226 8.48679 1.30479C8.33676 0.945162 8.11478 0.505387 7.92053 0.162293C7.90578 0.13704 7.87718 0.123978 7.84855 0.128333C6.27725 0.398287 4.7736 0.871134 3.37052 1.5138C3.35838 1.51902 3.34797 1.52774 3.34106 1.53905C0.488942 5.78948 -0.292371 9.93544 0.0909151 14.03C0.0926494 14.05 0.103922 14.0692 0.119532 14.0814C2.00127 15.4599 3.82406 16.2967 5.61301 16.8514C5.64164 16.8601 5.67197 16.8497 5.69019 16.8262C6.11337 16.2497 6.49059 15.6419 6.81402 15.0027C6.83311 14.9652 6.81489 14.9208 6.77588 14.906C6.17754 14.6796 5.6078 14.4036 5.05975 14.0901C5.0164 14.0648 5.01293 14.003 5.05281 13.9734C5.16814 13.8872 5.2835 13.7975 5.39363 13.7069C5.41355 13.6904 5.44131 13.6869 5.46474 13.6973C9.06518 15.3371 12.9631 15.3371 16.521 13.6973C16.5445 13.686 16.5722 13.6895 16.593 13.706C16.7032 13.7966 16.8185 13.8872 16.9347 13.9734C16.9746 14.003 16.972 14.0648 16.9286 14.0901C16.3806 14.4097 15.8108 14.6796 15.2116 14.9052C15.1726 14.92 15.1553 14.9652 15.1744 15.0027C15.5047 15.641 15.882 16.2488 16.2973 16.8253C16.3147 16.8497 16.3459 16.8601 16.3745 16.8514C18.1721 16.2967 19.9949 15.4599 21.8766 14.0814C21.8931 14.0692 21.9035 14.0509 21.9053 14.0309C22.364 9.29711 21.1369 5.18515 18.6525 1.53991C18.6465 1.52774 18.6361 1.51902 18.6239 1.5138ZM7.35169 11.5368C6.26771 11.5368 5.37454 10.5441 5.37454 9.32499C5.37454 8.10584 6.25039 7.11313 7.35169 7.11313C8.46163 7.11313 9.34616 8.11456 9.32881 9.32499C9.32881 10.5441 8.45296 11.5368 7.35169 11.5368ZM14.6619 11.5368C13.5779 11.5368 12.6847 10.5441 12.6847 9.32499C12.6847 8.10584 13.5606 7.11313 14.6619 7.11313C15.7718 7.11313 16.6563 8.11456 16.639 9.32499C16.639 10.5441 15.7718 11.5368 14.6619 11.5368Z" fill="white" />
    </svg>
  )
};

const FooterCustom: React.FC<any> = () => {
  const { isMobile } = useMatchBreakpointsContext()
  const router = useRouter()

  return (
    <FooterWrapper p={["40px 16px", null, "56px 40px 32px 40px"]} justifyContent="center">
      <Flex alignItems="center" justifyContent="space-between" width={["100%", null, "1200px;"]}>
        <LogoWrapper>
          {/* <LogoIcon className="mobile-icon" /> */}
          <LogoWithTextIcon className="desktop-icon" isDark textColor="#fff" />
          {
            !isMobile && <span>Powered by Glitch Network</span>
          }
        </LogoWrapper>

        <SocialNetworkWrapper>
          {
            !isMobile &&
            <Tos>
              <span onClick={() => { window.open('https://www.glitch.finance', '_blank') }}>Glitch.finance</span>
              <span onClick={() => router.push('/terms-conditions')}>
                Terms of Service
              </span>
            </Tos>
          }
          <div className="divider" />
          <a href="https://twitter.com/glitch_network" target="_blank" rel="noreferrer"><TwitterSvg /></a>
          <a href="https://medium.com/@glitch_network" target="_blank" rel="noreferrer"><MediumSvg /></a>
          <a href="https://discord.com/invite/BWn5vvrmuW" target="_blank" rel="noreferrer"><DiscordSvg /></a>
        </SocialNetworkWrapper>
      </Flex>
    </FooterWrapper>
  );
};

export default FooterCustom;

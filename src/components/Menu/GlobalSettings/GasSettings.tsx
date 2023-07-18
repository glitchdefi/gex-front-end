import { useState } from 'react';
import styled from "styled-components";
import { Flex, Button, Text, Input } from '@pancakeswap/uikit'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import { useGasPriceManager, useGasPriceMeta } from 'state/user/hooks'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/types'
import { parseUnits } from '@ethersproject/units'

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)<{
  isActive?: boolean;
}>`
  border-radius:0px;
  color:${({ theme }) => theme.colors.textBlack };
  background: transparent;
  border: 1px solid ${({ isActive }) => isActive ? '#00E6E6' : '#23353B' };
  box-shadow: none;
  display: flex;
  justify-content: space-between;
  padding: 13px;
  height: 50px;
  margin-bottom: 12px;
  font-weight: 400;
  font-size: 14px;
  color: #E5ECEF;

  span {
    display: flex;
    align-items: center;

    svg {
      margin-right: 20px;
    }
  }

  .sub-price {
    color: #4F7785;
    margin-right: 16px;
  }
`;

const CustomInputWrapper = styled.div<{
  isActive?: boolean;
}>`
  cursor: pointer;
  background: transparent;
  border: 1px solid ${({ isActive }) => isActive ? '#00E6E6' : '#23353B' };
  color: #E5ECEF;
  padding: 13px;
  height: 50px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    display: flex;
    align-items: center;

    svg {
      margin-right: 20px;
    }
  }

  input {
    width: 200px;
    padding-right: 50px;
  }

  div {
    position: relative;
  }
`;

const FastIcon = () => {
  return <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.25 16.25C17.25 13.6344 15.7172 11.375 13.5 10.3227V6.43672C13.5 6.08281 13.3758 5.74063 13.1461 5.47109L9.57422 1.23594C9.42422 1.05781 9.21094 0.96875 9 0.96875C8.78906 0.96875 8.57578 1.05781 8.42578 1.23594L4.85391 5.47109C4.62578 5.74118 4.50043 6.08318 4.5 6.43672V10.3227C2.28281 11.375 0.75 13.6344 0.75 16.25H4.41797C4.36406 16.4187 4.33594 16.6016 4.33594 16.8078C4.33594 17.3258 4.51406 17.832 4.8375 18.2328C5.1015 18.5606 5.45115 18.8088 5.84766 18.95C6.38906 20.2156 7.61953 21.0312 9 21.0312C9.68203 21.0312 10.343 20.8297 10.9078 20.45C11.4609 20.0797 11.8898 19.5617 12.15 18.95C12.5463 18.8097 12.896 18.5623 13.1602 18.2352C13.484 17.8307 13.6609 17.3283 13.6617 16.8102C13.6617 16.6133 13.6359 16.4258 13.5891 16.2523L17.25 16.25ZM4.59375 14.6562H2.60625C2.73516 14.2742 2.91328 13.9063 3.13359 13.5641C3.51563 12.9734 4.0125 12.4742 4.59375 12.0945V14.6562ZM6.09375 10.3227V6.47187L9 3.02656L11.9062 6.47187V14.6562H6.09375V10.3227ZM11.7211 17.3797C11.5992 17.45 11.4586 17.4781 11.3203 17.4594L10.8633 17.4031L10.7977 17.8578C10.6711 18.7461 9.89766 19.4164 9 19.4164C8.10234 19.4164 7.32891 18.7461 7.20234 17.8578L7.13672 17.4008L6.67969 17.4594C6.54074 17.4759 6.40017 17.4472 6.27891 17.3773C6.075 17.2602 5.94844 17.0422 5.94844 16.8055C5.94844 16.557 6.08672 16.3508 6.29062 16.2477H11.7117C11.918 16.3531 12.0539 16.5594 12.0539 16.8055C12.0516 17.0445 11.925 17.2648 11.7211 17.3797ZM13.4062 14.6562V12.0945C13.991 12.4761 14.4886 12.9769 14.8664 13.5641C15.0867 13.9063 15.2648 14.2742 15.3937 14.6562H13.4062Z" fill="#F100F5"/>
  </svg>
}

const CarIcon = () => {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.67813 11.1094L4.3125 12.1172V17.6719H19.6875V12.1172L19.3219 11.1094H4.67813ZM6.1875 14.5547C5.66953 14.5547 5.25 14.1352 5.25 13.6172C5.25 13.0992 5.66953 12.6797 6.1875 12.6797C6.70547 12.6797 7.125 13.0992 7.125 13.6172C7.125 14.1352 6.70547 14.5547 6.1875 14.5547ZM15.2812 16.3125C15.2812 16.4156 15.1969 16.5 15.0938 16.5H8.90625C8.80312 16.5 8.71875 16.4156 8.71875 16.3125V14.3438C8.71875 14.2406 8.80312 14.1562 8.90625 14.1562H9.84375C9.94688 14.1562 10.0312 14.2406 10.0312 14.3438V15.1875H13.9688V14.3438C13.9688 14.2406 14.0531 14.1562 14.1562 14.1562H15.0938C15.1969 14.1562 15.2812 14.2406 15.2812 14.3438V16.3125ZM17.8125 14.5547C17.2945 14.5547 16.875 14.1352 16.875 13.6172C16.875 13.0992 17.2945 12.6797 17.8125 12.6797C18.3305 12.6797 18.75 13.0992 18.75 13.6172C18.75 14.1352 18.3305 14.5547 17.8125 14.5547Z" fill="#480049"/>
  <path d="M16.875 13.6172C16.875 13.8658 16.9738 14.1043 17.1496 14.2801C17.3254 14.4559 17.5639 14.5547 17.8125 14.5547C18.0611 14.5547 18.2996 14.4559 18.4754 14.2801C18.6512 14.1043 18.75 13.8658 18.75 13.6172C18.75 13.3685 18.6512 13.1301 18.4754 12.9543C18.2996 12.7785 18.0611 12.6797 17.8125 12.6797C17.5639 12.6797 17.3254 12.7785 17.1496 12.9543C16.9738 13.1301 16.875 13.3685 16.875 13.6172Z" fill="#F100F5"/>
  <path d="M22.4765 9.68867L21.921 8.71836C21.8961 8.67559 21.8552 8.64443 21.8073 8.63169C21.7595 8.61896 21.7085 8.62568 21.6656 8.65039L20.4773 9.34414L18.6421 4.27695C18.5452 3.9746 18.3548 3.71085 18.0982 3.52381C17.8417 3.33676 17.5323 3.23609 17.2148 3.23633H7.05932C6.24604 3.23633 5.52416 3.76133 5.27338 4.53711L3.52494 9.34649L2.33432 8.65274C2.29139 8.62803 2.24043 8.6213 2.19257 8.63404C2.1447 8.64677 2.10382 8.67793 2.07885 8.7207L1.52338 9.68867C1.47182 9.77774 1.50229 9.89024 1.59135 9.9418L3.00697 10.7668L2.66713 11.7043C2.63901 11.7793 2.62494 11.859 2.62494 11.9387V20.0996C2.62494 20.4676 2.90151 20.7652 3.24135 20.7652H4.82572C5.11401 20.7652 5.36479 20.5473 5.42572 20.2426L5.60619 19.359H18.3937L18.5742 20.2426C18.6374 20.5473 18.8859 20.7652 19.1742 20.7652H20.7585C21.0984 20.7652 21.3749 20.4676 21.3749 20.0996V11.9387C21.3749 11.859 21.3609 11.7793 21.3328 11.7043L20.9929 10.7668L22.4062 9.9418C22.4487 9.91723 22.4799 9.87695 22.4931 9.82961C22.5062 9.78227 22.5003 9.73166 22.4765 9.68867ZM6.8601 5.11133L6.87182 5.08086L6.88119 5.05039C6.90697 4.97305 6.97729 4.92148 7.05932 4.92148H17.0812L18.8484 9.79649H5.15619L6.8601 5.11133ZM19.6874 17.6715H4.31244V12.1168L4.67807 11.109H19.3218L19.6874 12.1168V17.6715Z" fill="#F100F5"/>
  <path d="M5.25 13.6172C5.25 13.8658 5.34877 14.1043 5.52459 14.2801C5.7004 14.4559 5.93886 14.5547 6.1875 14.5547C6.43614 14.5547 6.6746 14.4559 6.85041 14.2801C7.02623 14.1043 7.125 13.8658 7.125 13.6172C7.125 13.3685 7.02623 13.1301 6.85041 12.9543C6.6746 12.7785 6.43614 12.6797 6.1875 12.6797C5.93886 12.6797 5.7004 12.7785 5.52459 12.9543C5.34877 13.1301 5.25 13.3685 5.25 13.6172ZM15.0938 14.1562H14.1562C14.0531 14.1562 13.9688 14.2406 13.9688 14.3438V15.1875H10.0312V14.3438C10.0312 14.2406 9.94688 14.1562 9.84375 14.1562H8.90625C8.80312 14.1562 8.71875 14.2406 8.71875 14.3438V16.3125C8.71875 16.4156 8.80312 16.5 8.90625 16.5H15.0938C15.1969 16.5 15.2812 16.4156 15.2812 16.3125V14.3438C15.2812 14.2406 15.1969 14.1562 15.0938 14.1562Z" fill="#F100F5"/>
  </svg>
}

const ToolIcon = () => {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.5659 11.4537C16.4251 11.5944 16.2341 11.6735 16.0351 11.6735C15.836 11.6735 15.645 11.5944 15.5042 11.4537L12.5862 8.53577C12.4455 8.39493 12.3665 8.20399 12.3665 8.00491C12.3665 7.80584 12.4455 7.6149 12.5862 7.47405L15.7011 4.36155C15.0814 4.31536 14.4591 4.40348 13.8766 4.61989C13.2941 4.83629 12.7653 5.17588 12.3261 5.61546C10.9644 6.97718 10.7019 9.02093 11.5386 10.6451L10.3011 11.8826C10.2987 11.8826 10.2987 11.8803 10.2987 11.8803L4.90576 17.2733L6.76201 19.1295L13.1839 12.7053L13.1862 12.7076L13.3925 12.5014C15.0167 13.3381 17.0604 13.0756 18.4222 11.7139C19.3409 10.7975 19.7651 9.5553 19.6784 8.34124L16.5659 11.4537Z" fill="#480049"/>
  <path d="M20.5451 5.61287C20.5334 5.59178 20.517 5.57068 20.4982 5.55428C20.381 5.43709 20.1912 5.43709 20.074 5.55428L16.0357 9.59256L14.4443 8.00115L18.485 3.96053C18.5037 3.94178 18.5178 3.92303 18.5318 3.90193C18.6162 3.75896 18.5693 3.57615 18.4264 3.49178C16.1248 2.1324 13.1107 2.44412 11.1303 4.42225C9.55995 5.99256 9.03964 8.21912 9.57167 10.2207L2.70448 17.0879C2.63417 17.1582 2.63886 17.273 2.71152 17.3457L6.68886 21.323C6.76152 21.3957 6.8787 21.4004 6.94667 21.3301L13.8115 14.4652C15.8154 14.9996 18.042 14.4816 19.6146 12.909C21.5928 10.9285 21.9045 7.91443 20.5451 5.61287ZM18.4217 11.7137C17.06 13.0754 15.0162 13.3379 13.392 12.5012L13.1857 12.7074L13.1834 12.7051L6.76152 19.1293L4.90527 17.273L10.2982 11.8801C10.2982 11.8801 10.2982 11.8824 10.3006 11.8824L11.5381 10.6449C10.7014 9.02068 10.9639 6.97693 12.3256 5.61521C12.7648 5.17564 13.2937 4.83605 13.8761 4.61964C14.4586 4.40324 15.0809 4.31512 15.7006 4.36131L12.5857 7.47381C12.445 7.61466 12.366 7.80559 12.366 8.00467C12.366 8.20374 12.445 8.39468 12.5857 8.53553L15.5037 11.4535C15.6446 11.5942 15.8355 11.6732 16.0346 11.6732C16.2336 11.6732 16.4246 11.5942 16.5654 11.4535L19.6779 8.341C19.7646 9.55506 19.3404 10.7972 18.4217 11.7137Z" fill="#F100F5"/>
  </svg>
  
}

const GasSettings = () => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useGasPriceManager()
  const gasPriceMeta = useGasPriceMeta();
  const [customGasPrice, setCustomGasPrice]: any = useState(gasPriceMeta.label === 'custom' ? +gasPriceMeta.gasPrice : 150);

  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <Text bold fontSize="16px" color="#E5ECEF">Transaction Speed</Text>
      </Flex>
      <ButtonWrapper>
        <StyledButton
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          isActive={gasPrice === GAS_PRICE_GWEI.fast}
        >
          <span style={{ marginLeft: '4px' }}>
            <FastIcon /> Fast
          </span>
          <span>
            {/* <span className="sub-price">(~ $4.21 USD)</span> */}
            {GAS_PRICE.fast} GWEI
          </span>
        </StyledButton>
        <StyledButton
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          isActive={gasPrice === GAS_PRICE_GWEI.default}
        >
          <span>
            <CarIcon /> Average
          </span>
          <span>
            {/* <span className="sub-price">(~ $3.21 USD)</span> */}
            {GAS_PRICE.average} GWEI
          </span>
        </StyledButton>
        <CustomInputWrapper
          isActive={gasPriceMeta.label === 'custom'}
          onClick={() => {
            if (customGasPrice || +customGasPrice === 0) {
              setGasPrice(parseUnits(`${customGasPrice}`, 'gwei').toString())
            }
          }}
        >
          <span>
            <ToolIcon /> Custom
          </span>
            <div>
              <Input
                scale="sm"
                inputMode="numeric"
                pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                placeholder="0"
                value={customGasPrice}
                onChange={(event) => {
                  if (!event.currentTarget.validity.valid) {
                    return
                  }

                  setCustomGasPrice(event.target.value)
                  if (event.target.value) {
                    setGasPrice(parseUnits(event.target.value, 'gwei').toString())
                  }
                }}
              />

              <Text fontSize="14px" color="#4F7785" style={{
                position: 'absolute',
                right: '10px',
                top: '5px'
              }}>GWEI</Text>
            </div>
        </CustomInputWrapper>
      </ButtonWrapper>

      {+customGasPrice === 0 && (
        <Text fontSize="14px" color="#F3841E" mt="10px">
          {t('Your transaction may fail')}
        </Text>
      )}
    </Flex>
  )
}

export default GasSettings

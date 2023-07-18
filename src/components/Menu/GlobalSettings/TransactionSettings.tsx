import styled from 'styled-components'
import { useState } from 'react'
import { escapeRegExp } from 'utils'
import { Text, Button, Input, Flex, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useUserSlippageTolerance, useUserTransactionTTL } from 'state/user/hooks'
import QuestionHelper from '../../QuestionHelper'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
const THREE_DAYS_IN_SECONDS = 60 * 60 * 24 * 3

const ButtonWrapper = styled.div`
  display: flex;

  .button-1 {

  }

  .button-2, .button-3, .button-4 {
    margin-left: -4px;
  }

  .input-custom {
    display: flex;
    position: relative;

    input {
      border: 1px solid #4F7785;
      margin-top: 4px;
      margin-left: -4px;
      width: 120px;
    }

    div {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 14px;
      color: #4F7785;
    }

    .active {
      border: 1px solid #00E6E6;
    }
  }
`;

const StyledButton = styled(Button)<{
  isActive?: boolean;
}>`
  border-radius:0px;
  color:${({ theme }) => theme.colors.textBlack };
  background: ${({ isActive }) => isActive ? '#00E6E6' : 'transparent' };
  color: ${({ isActive }) => isActive ? '#151F23' : '#4F7785' };
  border: 1px solid ${({ isActive }) => isActive ? '#00E6E6' : '#4F7785' };
  border-right: none;
  box-shadow: none;
`;

const SlippageTabs = () => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()
  const [ttl, setTtl] = useUserTransactionTTL()

  const defaultSlippageInput = ![10, 30, 50, 100].includes(userSlippageTolerance) ? `${(userSlippageTolerance / 100).toFixed(2)}` : ''

  const [slippageInput, setSlippageInput] = useState(defaultSlippageInput)
  const [deadlineInput, setDeadlineInput] = useState('')

  const { t } = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 60 && valueAsInt < THREE_DAYS_IN_SECONDS) {
        setTtl(valueAsInt)
      } else {
        deadlineError = DeadlineError.InvalidInput
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex flexDirection="column">
      <Flex mb="24px" flexDirection="column">
        <Text color="#E5ECEF" fontSize="16px" mb="16px" bold>Transaction deadline</Text>
        <Box width="100%" mt="4px" style={{
          position: 'relative',
        }}>
          <Input
            scale="sm"
            inputMode="numeric"
            pattern="^[0-9]+$"
            isWarning={!!deadlineError}
            onBlur={() => {
              parseCustomDeadline((ttl / 60).toString())
            }}
            placeholder={(ttl / 60).toString()}
            value={deadlineInput}
            onChange={(event) => {
              if (event.currentTarget.validity.valid) {
                parseCustomDeadline(event.target.value)
              }
            }}
          />

          <Text fontSize="14px" color="#4F7785" style={{
            position: 'absolute',
            right: '10px',
            top: '5px'
          }}>minutes</Text>
        </Box>
      </Flex>

      <Flex flexDirection="column" mb="24px">
        <Flex mb="12px">
          <Text color="#E5ECEF" fontSize="16px" bold>Slippage Tolerance</Text>
            <QuestionHelper
              text={t(
                'Your transaction will revert if the price changes above this percentage.',
              )}
              placement="top-start"
              ml="4px"
              mt="4px"
            />
          </Flex>
          <Flex flexWrap="wrap">
          <ButtonWrapper>
            <StyledButton
              mt="4px"
              mr="4px"
              scale="sm"
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(10)
              }}
              className="button-1"
              isActive={userSlippageTolerance === 10}
            >
              0.1%
            </StyledButton>
            <StyledButton
              mt="4px"
              mr="4px"
              scale="sm"
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(30)
              }}
              className="button-2"
              isActive={userSlippageTolerance === 30}
            >
              0.3%
            </StyledButton>
            <StyledButton
              mt="4px"
              mr="4px"
              scale="sm"
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(50)
              }}
              isActive={userSlippageTolerance === 50}
              className="button-3"
            >
              0.5%
            </StyledButton>
            <StyledButton
              mr="4px"
              mt="4px"
              scale="sm"
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(100)
              }}
              isActive={userSlippageTolerance === 100}
              className="button-4"
            >
              1.0%
            </StyledButton>
            
            <div className="input-custom">
              <Input
                  scale="sm"
                  inputMode="decimal"
                  pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                  placeholder="Custom"
                  value={slippageInput}
                  className={slippageInput ? 'active' : ''}
                  onBlur={() => {
                    parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
                  }}
                  onChange={(event) => {
                    if (event.currentTarget.validity.valid) {
                      parseCustomSlippage(event.target.value.replace(/,/g, '.'))
                    }
                  }}
                />
              <Text color="primary" bold ml="2px">
                %
              </Text>
            </div>
          </ButtonWrapper>
        </Flex>
        {!!slippageError && (
          <Text fontSize="14px" color={slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'} mt="10px">
            {slippageError === SlippageError.InvalidInput
              ? t('Enter a valid slippage percentage')
              : slippageError === SlippageError.RiskyLow
              ? t('Your transaction may fail')
              : t('Your transaction may fail')}
          </Text>
        )}
        {/* { slippageInput && !+slippageInput && (
          <Text fontSize="14px" color="#F3841E" mt="10px">
            {t('Your transaction may fail')}
          </Text>
        )} */}
      </Flex>
    </Flex>
  )
}

export default SlippageTabs

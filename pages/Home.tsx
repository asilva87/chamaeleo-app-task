import React, { useState, useEffect } from 'react'
import { Button, Spinner, Text, YStack } from 'tamagui'

interface HomeProps {
  isCheckingIn: boolean
  isConnected: boolean
  onCheckIn: () => void
}

const Home = ({
  isCheckingIn,
  isConnected,
  onCheckIn,
}: HomeProps): JSX.Element => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000) // Update every second to keep in sync with the device time
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  // Get a mock shift start time
  // If minutes are equal or larger than n5 (eg: 35, 36, 37), then shift
  // STARTS AT the next round minutes (40). And the employee is therefore
  // n minutes early.
  // If minutes are less than n5 (eg: 32, 33, 34), then shift STARTED AT
  // the previous round minutes (30) and the employee is therefore n minutes late.
  const getShiftTime = (date: Date) => {
    const minutes = date.getMinutes()
    const hours = date.getHours()
    const shiftMinutes =
      Math.floor(minutes / 10) * 10 + (minutes % 10 < 5 ? 0 : 10)
    const shiftHour = shiftMinutes >= 60 ? (hours + 1) % 24 : hours
    const correctedShiftMinutes =
      shiftMinutes >= 60 ? shiftMinutes - 60 : shiftMinutes
    return `${shiftHour.toString().padStart(2, '0')}:${correctedShiftMinutes
      .toString()
      .padStart(2, '0')}`
  }

  // Show different warning message depending on whether:
  // - Employee on time
  // - Employee n minutes early
  // - Employee n minutes late
  const getTimeMessage = (date: Date) => {
    const minutes = date.getMinutes()
    const shiftMinutes =
      Math.floor(minutes / 10) * 10 + (minutes % 10 < 5 ? 0 : 10)
    const diffMinutes = minutes - shiftMinutes
    const absoluteDiff = Math.abs(diffMinutes)
    const minutesText = absoluteDiff === 1 ? 'minute' : 'minutes'

    if (diffMinutes < 0) {
      return {
        timeMessage: `${absoluteDiff} ${minutesText} early`,
        shiftText: 'starts',
        color: '$green9Light',
      }
    } else if (diffMinutes > 0) {
      return {
        timeMessage: `${absoluteDiff} ${minutesText} late`,
        shiftText: 'started',
        color: '$red9Light',
      }
    } else {
      return {
        timeMessage: "You're exactly on time!",
        shiftText: 'starts',
        color: '$blue9Light',
      }
    }
  }

  const { timeMessage, shiftText, color } = getTimeMessage(currentTime)

  return (
    <YStack alignItems="center" marginTop="60%" flex={1}>
      <Text fontSize="$8" marginBottom="$2" color="$black075">
        Your shift {shiftText} at {getShiftTime(currentTime)}
      </Text>
      <Text fontSize="$10" marginBottom="$2" color="$black075">
        {formatTime(currentTime)}
      </Text>
      {timeMessage && (
        <Text fontSize="$7" marginBottom="$4" color={color} fontStyle="italic">
          {timeMessage}
        </Text>
      )}
      <Button
        backgroundColor={
          !isCheckingIn
            ? isConnected
              ? '$blue9Light'
              : '$orange9Light'
            : '$gray6Light'
        }
        onPress={onCheckIn}
        disabled={isCheckingIn}
        width="$15"
        pressStyle={{
          backgroundColor: isConnected ? '$blue8Light' : '$orange8Light',
        }}
        // marginTop="$-10" // Not ideal
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.25}
        shadowRadius={3.84}
        elevation={5}
      >
        {isCheckingIn && (
          <Spinner
            size="small"
            color={isConnected ? '$blue8Light' : '$orange8Light'}
          />
        )}

        <Text fontSize="$5" color={!isCheckingIn ? 'white' : '$black075'}>
          {!isCheckingIn ? 'Check in' : 'Checking in'}
        </Text>
      </Button>
    </YStack>
  )
}

export default Home

import { Button, Spinner, Text, YStack } from 'tamagui'

interface HomeProps {
  isCheckingIn: boolean
  isConnected: boolean
  onCheckIn: () => void
}

export default function Home({
  isCheckingIn,
  isConnected,
  onCheckIn,
}: HomeProps): JSX.Element {
  return (
    <YStack alignItems="center" justifyContent="center" flex={1}>
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
        marginTop="$-10" // Not ideal
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

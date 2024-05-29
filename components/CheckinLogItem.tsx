import { Separator, Text, YStack } from 'tamagui'
import { CheckinLog } from '../App'

export default function CheckinLogItem({
  checkinLog,
}: {
  checkinLog: CheckinLog
}): JSX.Element {
  const { date, time, pending, sentAfterReconnection } = checkinLog

  return (
    <YStack>
      <YStack
        paddingLeft="$4"
        paddingRight="$4"
        paddingTop="$2"
        paddingBottom="$2"
        backgroundColor={!pending ? '$green3Light' : '$orange3Light'}
      >
        <Text>{date}</Text>
        <Text>{time}</Text>
        <Text fontStyle="italic">
          {!pending
            ? `Sent ${
                sentAfterReconnection ? 'after network reestablished' : ''
              }`
            : 'Waiting for network'}
        </Text>
      </YStack>
      <Separator />
    </YStack>
  )
}

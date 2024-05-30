import { Separator, Text, XStack, YStack } from 'tamagui'
import { CheckinLog } from '../App'
import { AlertTriangle, CheckCircle2 } from '@tamagui/lucide-icons'

export default function CheckinLogItem({
  checkinLog,
}: {
  checkinLog: CheckinLog
}): JSX.Element {
  const { date, time, pending, sentAfterReconnection, late } = checkinLog

  return (
    <YStack>
      <YStack
        paddingLeft="$4"
        paddingRight="$4"
        paddingTop="$2"
        paddingBottom="$2"
        backgroundColor={!pending ? '$green3Light' : '$orange3Light'}
      >
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <Text color="$black075">{date}</Text>
            <Text color="$black075">
              {time} -{' '}
              <Text color={!late ? '$green9Light' : '$red9Light'}>
                {!late ? 'On time' : 'Late'}
              </Text>
            </Text>
            <Text color="$black075" fontStyle="italic">
              {!pending
                ? `Sent ${
                    sentAfterReconnection ? 'after network reestablished' : ''
                  }`
                : 'Waiting for network'}
            </Text>
          </YStack>

          {!pending ? (
            <CheckCircle2 size="$2" color="$green8Dark" />
          ) : (
            <AlertTriangle size="$2" color="$orange8Dark" />
          )}
        </XStack>
      </YStack>
      <Separator />
    </YStack>
  )
}

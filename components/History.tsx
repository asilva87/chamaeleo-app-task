import { YStack } from 'tamagui'
import { CheckinLog } from '../App'

import CheckinLogItem from './CheckinLogItem'

interface HistoryProps {
  checkinHistory: Array<CheckinLog>
}

export default function History({ checkinHistory }: HistoryProps): JSX.Element {
  return (
    <YStack>
      {checkinHistory.map((log: CheckinLog, index: number) => (
        <CheckinLogItem key={index} checkinLog={log} />
      ))}
    </YStack>
  )
}

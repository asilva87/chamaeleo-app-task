import React from 'react'
import { FlatList } from 'react-native'
import { YStack } from 'tamagui'
import { CheckinLog } from '../App'
import CheckinLogItem from '../components/CheckinLogItem'

interface HistoryProps {
  checkinHistory: Array<CheckinLog>
}

const History: React.FC<HistoryProps> = ({ checkinHistory }) => {
  const renderItem = ({ item }: { item: CheckinLog }) => (
    <CheckinLogItem checkinLog={item} />
  )

  return (
    <FlatList
      data={checkinHistory}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  )
}

export default History

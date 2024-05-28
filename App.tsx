import React from 'react'
import { SafeAreaView, StyleSheet, useColorScheme } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import { Button, TamaguiProvider } from 'tamagui'

import config from './tamagui.config'

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  return (
    <TamaguiProvider config={config}>
      <SafeAreaView style={styles.sectionContainer}>
        <Button theme="blue">test</Button>
      </SafeAreaView>
    </TamaguiProvider>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
})

export default App

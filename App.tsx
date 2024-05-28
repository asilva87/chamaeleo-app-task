import React, { useEffect, useState } from 'react'
import { Alert, SafeAreaView, StyleSheet, useColorScheme } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import { Button, TamaguiProvider, Text, View, YStack } from 'tamagui'

import config from './tamagui.config'
import Navbar, { Tab } from './components/Navbar'

function App(): React.JSX.Element {
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME)

  useEffect(() => {
    setCurrentTab(Tab.HOME)
  }, [])

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    const checkInData = {
      datetime: new Date().toISOString(),
      // Optionally add GPS location here
    }

    try {
      if (isConnected) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        // Success animation
        console.log('Check-in successful!')
      } else {
        // Save data locally and show "waiting for network" notice
        // await AsyncStorage.setItem('checkInData', JSON.stringify(checkInData));
        console.log('No internet. Data saved locally.')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsCheckingIn(false)
    }
  }

  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  const handleToggleConnectivity = (): void => {
    setIsConnected(!isConnected)
  }

  const handleTabChange = (tab: Tab): void => {
    setCurrentTab(tab)
  }

  return (
    <TamaguiProvider config={config}>
      <View style={styles.sectionContainer}>
        <Navbar
          isConnected={isConnected}
          onConnectivityChange={handleToggleConnectivity}
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />

        {currentTab === Tab.HOME && (
          <YStack width="100vw" alignItems="center">
            <Button
              // color={!isCheckingIn ? '$blue4Dark' : '$black0'}
              backgroundColor={!isCheckingIn ? '$blue9Light' : '$gray5Light'}
              onPress={handleCheckIn}
              disabled={isCheckingIn}
            >
              {!isCheckingIn ? (
                <Text fontSize={'$5'}>Check in</Text>
              ) : (
                <Text>Checking in...</Text>
              )}
            </Button>
          </YStack>
        )}

        {currentTab === Tab.HISTORY && <Text>history</Text>}
      </View>
    </TamaguiProvider>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {},
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

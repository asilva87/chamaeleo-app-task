import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Modal, View } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LottieView from 'lottie-react-native'

import config from './tamagui.config'
import Navbar, { Tab } from './components/Navbar'
import Home from './components/Home'
import History from './components/History'

export interface CheckinLog {
  date: string
  time: string
  employeeName: string
  pending: boolean
  sentAfterReconnection: boolean
}

function App(): React.JSX.Element {
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME)
  const [checkinHistory, setCheckinHistory] = useState<CheckinLog[]>([])
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [showOfflineAnimation, setShowOfflineAnimation] = useState(false)

  // Load checkins history from local storage
  useEffect(() => {
    const loadCheckinHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('checkinHistory')
        if (storedHistory) {
          setCheckinHistory(JSON.parse(storedHistory))
        }
      } catch (error) {
        console.error('Error loading check-in history:', error)
      }
    }

    loadCheckinHistory()
  }, [])

  // Send pending checkins to the API upon reconnection
  useEffect(() => {
    const updatePendingLogs = async () => {
      if (isConnected) {
        const updatedHistory = checkinHistory.map((log) => {
          if (log.pending) {
            log.pending = false
            log.sentAfterReconnection = true
          }

          return log
        })

        // Update history in app and localstorage to reflect that
        setCheckinHistory(updatedHistory)
        await AsyncStorage.setItem(
          'checkinHistory',
          JSON.stringify(updatedHistory)
        )
      }
    }

    updatePendingLogs()
  }, [isConnected])

  const handleCheckIn = async () => {
    setIsCheckingIn(true)

    const currentDate = new Date()
    const formattedDate = `${currentDate
      .getDate()
      .toString()
      .padStart(2, '0')}.${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${currentDate.getFullYear()}`
    const formattedTime = `${currentDate
      .getHours()
      .toString()
      .padStart(2, '0')}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`

    const newCheckInData: CheckinLog = {
      date: formattedDate,
      time: formattedTime,
      employeeName: 'Alice',
      pending: !isConnected,
      sentAfterReconnection: false,
    }

    try {
      if (isConnected) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setShowSuccessAnimation(true)
        setTimeout(() => setShowSuccessAnimation(false), 1500)
      } else {
        setShowOfflineAnimation(true)
        setTimeout(() => setShowOfflineAnimation(false), 3000)
      }

      const updatedHistory = [newCheckInData, ...checkinHistory]
      setCheckinHistory(updatedHistory)
      await AsyncStorage.setItem(
        'checkinHistory',
        JSON.stringify(updatedHistory)
      )
    } catch (error) {
      console.error('Error during check-in:', error)
    } finally {
      setIsCheckingIn(false)
    }
  }

  const handleToggleConnectivity = () => {
    setIsConnected((prev) => !prev)
  }

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab)
  }

  return (
    <TamaguiProvider config={config}>
      <SafeAreaView style={styles.container}>
        <Navbar
          isConnected={isConnected}
          onConnectivityChange={handleToggleConnectivity}
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />

        {currentTab === Tab.HOME && (
          <Home
            isCheckingIn={isCheckingIn}
            isConnected={isConnected}
            onCheckIn={handleCheckIn}
          />
        )}

        {currentTab === Tab.HISTORY && (
          <History checkinHistory={checkinHistory} />
        )}

        <Modal visible={showSuccessAnimation} transparent animationType="fade">
          <View style={styles.animationContainer}>
            <LottieView
              source={require('./assets/success.json')}
              autoPlay
              loop={false}
              style={styles.animation}
              speed={2}
            />
          </View>
        </Modal>

        <Modal visible={showOfflineAnimation} transparent animationType="fade">
          <View style={styles.animationContainer}>
            <LottieView
              source={require('./assets/warning.json')}
              autoPlay
              loop={false}
              style={styles.animation}
            />
          </View>
        </Modal>
      </SafeAreaView>
    </TamaguiProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  animation: {
    height: 300,
    width: 300,
  },
})

export default App

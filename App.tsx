import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Modal, View } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LottieView from 'lottie-react-native'

import config from './tamagui.config'
import Navbar, { Tab } from './components/Navbar'
import Home from './pages/Home'
import History from './pages/History'

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
  const [showPendingSentAnimation, setPendingSentAnimation] = useState(false)

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
        let hadPending = false
        const updatedHistory = checkinHistory.map((log) => {
          if (log.pending) {
            log.pending = false
            log.sentAfterReconnection = true
            hadPending = true
          }
          return log
        })

        if (hadPending) {
          setPendingSentAnimation(true)
          setTimeout(() => setPendingSentAnimation(false), 1500)
        }

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

        // Animations
        setShowSuccessAnimation(true)
        setTimeout(() => setShowSuccessAnimation(false), 1500)
      } else {
        // A short delay so that the user understands that something was done
        await new Promise((resolve) => setTimeout(resolve, 500))
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

        {/* With more modals with animations a "modal builder" function
        should be created to avoid repetition. */}
        <Modal visible={showSuccessAnimation} transparent animationType="fade">
          <View style={styles.animationContainer}>
            <LottieView
              source={require('./assets/animations/success.json')}
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
              source={require('./assets/animations/warning.json')}
              autoPlay
              loop={false}
              style={styles.animation}
            />
          </View>
        </Modal>

        <Modal
          visible={showPendingSentAnimation}
          transparent
          animationType="fade"
        >
          <View style={styles.animationContainer}>
            <LottieView
              source={require('./assets/animations/party.json')}
              autoPlay
              loop={false}
              style={{ height: 500, width: 500 }}
              speed={2}
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
  },
  animation: {
    height: 300,
    width: 300,
  },
})

export default App

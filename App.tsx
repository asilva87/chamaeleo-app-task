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
  late: boolean
}

function App(): React.JSX.Element {
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME)
  const [checkinHistory, setCheckinHistory] = useState<CheckinLog[]>([])
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [showOfflineAnimation, setShowOfflineAnimation] = useState(false)

  // Load checkins history from local storage and send pending checkins to the API upon reconnection or app start
  useEffect(() => {
    const initializeCheckinHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('checkinHistory')
        let history = []
        if (storedHistory) {
          history = JSON.parse(storedHistory)
          setCheckinHistory(history)
        }

        if (isConnected) {
          let hadPending = false
          const updatedHistory = history.map((log: CheckinLog) => {
            if (log.pending) {
              log.pending = false
              log.sentAfterReconnection = true
              hadPending = true
            }
            return log
          })

          if (hadPending) {
            setShowSuccessAnimation(true)
            setTimeout(() => setShowSuccessAnimation(false), 1500)
          }

          // Update history in app and local storage to reflect that
          setCheckinHistory(updatedHistory)
          await AsyncStorage.setItem(
            'checkinHistory',
            JSON.stringify(updatedHistory)
          )
        }
      } catch (error) {
        console.error('Error initializing check-in history:', error)
      }
    }

    initializeCheckinHistory()
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

    // Determine if the check-in is late
    const scheduledTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      18,
      10
    )
    const isLate = currentDate > scheduledTime

    const newCheckInData: CheckinLog = {
      date: formattedDate,
      time: formattedTime,
      employeeName: 'Alice',
      pending: !isConnected,
      sentAfterReconnection: false,
      late: isLate, // Add the late property
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
              style={styles.fullScreenAnimation}
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
              style={styles.fullScreenAnimation}
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
  fullScreenAnimation: {
    height: 300,
    width: 300,
  },
})

export default App

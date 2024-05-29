import { Wifi, WifiOff } from '@tamagui/lucide-icons'
import React from 'react'
import {
  Button,
  Stack,
  Tabs,
  Text,
  XStack,
  createSwitch,
  styled,
} from 'tamagui'

export enum Tab {
  // Lowercase, because the "Tabs" component's "onValueChange" function
  // returns the value in lowercase, instead of keeping the original case
  // of the enum. Before it was "HOME = 'HOME'".
  HOME = 'home',
  HISTORY = 'history',
}

interface NavbarProps {
  isConnected: boolean
  currentTab: Tab
  onConnectivityChange: () => void
  onTabChange: (tab: Tab) => void
}

interface NavbarButtonProps
  extends Omit<NavbarProps, 'onConnectivityChange' | 'isConnected'> {
  tab: Tab
}

const Frame = styled(Stack, {
  width: 40,
  height: 24,
  padding: 2,
  borderRadius: 20,
  variants: {
    checked: {
      true: {
        backgroundColor: '#ddd',
      },
      false: {
        backgroundColor: 'silver',
      },
    },
  } as const,
  defaultVariants: {
    checked: false,
  },
})

const Thumb = styled(Stack, {
  width: 20,
  height: 20,
  borderRadius: 20,

  variants: {
    checked: {
      true: {
        backgroundColor: '$blue9Light',
      },
      false: {
        backgroundColor: '$orange9Light',
      },
    },
  } as const,
})

export const Switch = createSwitch({
  Frame,
  Thumb,
})

function NavbarButton({
  tab,
  currentTab,
  onTabChange,
}: NavbarButtonProps): JSX.Element {
  return (
    <Button
      borderRadius="$0"
      onPress={() => onTabChange(tab)}
      backgroundColor={currentTab === tab ? '$blue9Light' : '#ddd'}
      color={currentTab === tab ? 'white' : '$black075'}
      fontWeight={currentTab === tab ? 'bold' : 'normal'}
    >
      {tab.charAt(0).toUpperCase() + tab.slice(1)}
    </Button>
  )
}

export default function Navbar({
  isConnected,
  currentTab,
  onConnectivityChange,
  onTabChange,
}: NavbarProps) {
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.25,
        elevation: 10,
        backgroundColor: 'white',
      }}
      height="$4"
    >
      {/* Navigation buttons */}
      <XStack>
        <NavbarButton
          tab={Tab.HOME}
          currentTab={currentTab}
          onTabChange={onTabChange}
        />
        <NavbarButton
          tab={Tab.HISTORY}
          currentTab={currentTab}
          onTabChange={onTabChange}
        />
      </XStack>

      {/* Network toggler */}
      <XStack
        width="100vw"
        padding="$3"
        alignItems="center"
        justifyContent={isConnected ? 'flex-end' : 'space-between'}
        gap="$2"
      >
        {!isConnected && (
          <Text color="$orange9Light" fontStyle="italic">
            Waiting for network
          </Text>
        )}

        <XStack gap="$2">
          {isConnected ? (
            <Wifi size="$1" color="$black075" />
          ) : (
            <WifiOff size="$1" color="$black075" />
          )}

          <Switch
            size={'$2'}
            defaultChecked={isConnected}
            onCheckedChange={() => {
              setTimeout(() => {
                onConnectivityChange()
              }, 0)
            }}
          >
            <Switch.Thumb animation="quick" />
          </Switch>
        </XStack>
      </XStack>
    </XStack>
  )
}

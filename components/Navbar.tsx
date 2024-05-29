import { Wifi, WifiOff } from '@tamagui/lucide-icons'
import React from 'react'
import { Stack, Tabs, Text, XStack, createSwitch, styled } from 'tamagui'

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

const Frame = styled(Stack, {
  width: 40,
  height: 20,
  borderRadius: 20,
  variants: {
    checked: {
      true: {
        backgroundColor: 'lightgrey',
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
  backgroundColor: '$blue10Light',
  borderRadius: 20,

  variants: {
    checked: {
      true: {
        opacity: 0.8,
      },
      false: {
        opacity: 0.5,
      },
    },
  } as const,
})

export const Switch = createSwitch({
  Frame,
  Thumb,
})

export default function Navbar({
  isConnected,
  currentTab,
  onConnectivityChange,
  onTabChange,
}: NavbarProps) {
  return (
    <>
      <Tabs
        defaultValue={Tab.HOME}
        value={currentTab}
        orientation="horizontal"
        flexDirection="column"
        borderColor="$borderColor"
        onValueChange={(value) => onTabChange(value as Tab)}
      >
        <Tabs.List>
          <Tabs.Tab flex={1} value="home">
            <Text fontSize="$5" color="$black075">
              Check-in
            </Text>
          </Tabs.Tab>

          <Tabs.Tab flex={1} value="history">
            <Text fontSize="$5" color="$black075">
              History
            </Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <XStack
        width="100vw"
        padding="$3"
        alignItems="center"
        justifyContent={isConnected ? 'flex-end' : 'space-between'}
        gap="$2"
      >
        {!isConnected && <Text color="$orange9Light">Waiting for network</Text>}

        <XStack gap="$2">
          {isConnected ? (
            <Wifi size="$1" color="$black075" />
          ) : (
            <WifiOff size="$1" color="$black075" />
          )}

          <Switch
            size={'$2'}
            defaultChecked={isConnected}
            onCheckedChange={() => onConnectivityChange()}
          >
            <Switch.Thumb animation="quick" />
          </Switch>
        </XStack>
      </XStack>
    </>
  )
}

// const TabsContent = (props: TabsContentProps) => {
//   return (
//     <Tabs.Content
//       backgroundColor="$background"
//       key="tab3"
//       padding="$2"
//       alignItems="center"
//       justifyContent="center"
//       flex={1}
//       borderColor="$background"
//       borderRadius="$2"
//       borderTopLeftRadius={0}
//       borderTopRightRadius={0}
//       borderWidth="$2"
//       {...props}
//     >
//       {props.children}
//     </Tabs.Content>
//   )
// }

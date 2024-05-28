import React from 'react'
import {
  Label,
  Separator,
  SizableText,
  Stack,
  Tabs,
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

const Frame = styled(Stack, {
  width: 40,
  height: 20,
  borderRadius: 20,
  variants: {
    checked: {
      true: {
        backgroundColor: 'lightblue',
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
  backgroundColor: 'black',
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
        // width={400}
        // height={150}
        borderRadius="$4"
        borderWidth="$0.25"
        overflow="hidden"
        borderColor="$borderColor"
        onValueChange={(value) => onTabChange(value as Tab)}
      >
        <Tabs.List
          disablePassBorderRadius="bottom"
          aria-label="Manage your account"
        >
          <Tabs.Tab flex={1} value="home">
            <SizableText fontFamily="$body">Check-in</SizableText>
          </Tabs.Tab>

          <Tabs.Tab flex={1} value="history">
            <SizableText fontFamily="$body">History</SizableText>
          </Tabs.Tab>
        </Tabs.List>

        {/* <Separator /> */}

        {/* <TabsContent value="tab1">
        <H5>Profile</H5>
      </TabsContent>

      <TabsContent value="tab2">
        <H5>Connections</H5>
      </TabsContent> */}
      </Tabs>

      <XStack
        width="100vw"
        paddingRight="$3"
        alignItems="center"
        justifyContent="flex-end"
        gap="$2"
      >
        <Label
          paddingRight="$0"
          // minWidth={90}
          justifyContent="flex-end"
          // size={props.size}
          // htmlFor={id}
        >
          Connected?
        </Label>

        <Switch
          size={'$2'}
          defaultChecked={isConnected}
          onCheckedChange={() => onConnectivityChange()}
        >
          <Switch.Thumb animation="quick" />
        </Switch>
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

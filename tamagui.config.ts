import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui' // or '@tamagui/core'

// This was just copied from Tamagui's website

const appConfig = createTamagui(config)
export type AppConfig = typeof appConfig

declare module 'tamagui' {
  // or '@tamagui/core'

  // overrides TamaguiCustomConfig so your custom types

  // work everywhere you import `tamagui`

  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig

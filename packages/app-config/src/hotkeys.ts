import { HotkeysListOptions } from '@saas-ui/react'

import { platformSelect } from '@saas-ui/pro'

const modifiers = {
  '⌥': 'alt',
  option: 'alt',
  '⇧': 'shift',
  '⌃': 'control',
  ctrl: 'control',
  '⌘': 'meta',
  cmd: 'meta',
  command: 'meta',
  mod: 'meta', // ios
  esc: 'escape',
}

export const appHotkeys: HotkeysListOptions = {
  general: {
    title: 'General',
    hotkeys: {
      showHotkeys: {
        label: 'Show this window',
        command: '?',
      },
      filter: {
        label: 'Add filter',
        command: 'F',
      },
      logout: {
        label: 'Log out',
        command: platformSelect({ mac: `${modifiers['⌥']} ${modifiers['⇧']} Q` }, 'Ctrl+Shift+Q'),
      }
    },
  },
  contacts: {
    title: 'Contacts',
    hotkeys: {
      add: {
        label: 'Add a person',
        command: 'A',
      },
    },
  },
}

export const settingsHotkeys: HotkeysListOptions = {
  settings: {
    hotkeys: {
      close: {
        label: 'Close settings',
        command: 'Esc',
      },
    },
  },
}

export const fullscreenHotkeys: HotkeysListOptions = {
  settings: {
    hotkeys: {
      close: {
        label: 'Close settings',
        command: 'Esc',
      },
    },
  },
}

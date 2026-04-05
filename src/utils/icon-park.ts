import type { Component } from 'vue'
import {
  AddressBook,
  ApplicationMenu,
  Bookmark,
  ChartLine,
  CheckOne,
  CloseOne,
  Copy,
  Cpu,
  FileText,
  Folder,
  Form,
  Histogram,
  Loading,
  Login,
  Monitor,
  Permissions,
  PieOne,
  Send,
  Setting,
  TrendTwo,
} from '@icon-park/vue-next'

const iconParkIcons = {
  AddressBook,
  ApplicationMenu,
  Bookmark,
  ChartLine,
  CheckOne,
  CloseOne,
  Copy,
  Cpu,
  FileText,
  Folder,
  Form,
  Histogram,
  Loading,
  Login,
  Monitor,
  Permissions,
  PieOne,
  Send,
  Setting,
  TrendTwo,
} satisfies Record<string, Component>

export const iconParkIconNames = Object.keys(iconParkIcons).sort()

export const hasIconParkIcon = (name: string): boolean => {
  return name in iconParkIcons
}

export const getIconParkIcon = (name: string): Component | null => {
  return iconParkIcons[name as keyof typeof iconParkIcons] || null
}

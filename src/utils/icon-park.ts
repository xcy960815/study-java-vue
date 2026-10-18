import type { Component } from 'vue'
import {
  AddressBook,
  ApplicationMenu,
  Bookmark,
  Brain,
  ChartLine,
  CheckOne,
  CloseOne,
  Commodity,
  Copy,
  Cpu,
  FileText,
  Folder,
  Form,
  Histogram,
  Home,
  InboxUploadR,
  ListView,
  Loading,
  Login,
  Monitor,
  Order,
  OrderedList,
  Permissions,
  PieOne,
  Send,
  Setting,
  TrendTwo,
  UploadTwo,
  UploadThree,
  User,
  Wechat,
} from '@icon-park/vue-next'

const iconParkIcons = {
  AddressBook,
  ApplicationMenu,
  Bookmark,
  Brain,
  ChartLine,
  CheckOne,
  CloseOne,
  Commodity,
  Copy,
  Cpu,
  FileText,
  Folder,
  Form,
  Histogram,
  Home,
  InboxUploadR,
  ListView,
  Loading,
  Login,
  Monitor,
  Order,
  OrderedList,
  Permissions,
  PieOne,
  Send,
  Setting,
  TrendTwo,
  UploadTwo,
  UploadThree,
  User,
  Wechat,
} satisfies Record<string, Component>

export const iconParkIconNames = Object.keys(iconParkIcons).sort()

export const hasIconParkIcon = (name: string): boolean => {
  return name in iconParkIcons
}

export const getIconParkIcon = (name: string): Component | null => {
  return iconParkIcons[name as keyof typeof iconParkIcons] || null
}

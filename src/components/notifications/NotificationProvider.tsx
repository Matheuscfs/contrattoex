'use client'

import * as React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase-browser'
import { pusherClient } from '@/lib/pusher'
import { toast } from 'sonner'

export type NotificationType = 
  | 'appointment_created'
  | 'appointment_updated'
  | 'appointment_cancelled'
  | 'chat_message'
  | 'status_update'
  | 'promotion'

export type NotificationChannel = 'app' | 'email' | 'sms' | 'whatsapp'

interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: Date
  channels: NotificationChannel[]
  data?: Record<string, any>
}

interface NotificationPreference {
  id: string
  notificationType: NotificationType
  channels: NotificationChannel[]
  active: boolean
  quietHoursStart?: string
  quietHoursEnd?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreference[]
  markAsRead: (id: string) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  updatePreferences: (preferences: NotificationPreference[]) => Promise<void>
}

interface DatabaseNotification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  created_at: string
  channels: NotificationChannel[]
  data?: Record<string, any>
}

interface DatabaseNotificationPreference {
  id: string
  user_id: string
  notification_type: NotificationType
  channels: NotificationChannel[]
  active: boolean
  quiet_hours_start?: string
  quiet_hours_end?: string
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(
  undefined
)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [preferences, setPreferences] = React.useState<NotificationPreference[]>([])

  const transformDatabaseNotification = (dbNotification: DatabaseNotification): Notification => ({
    id: dbNotification.id,
    title: dbNotification.title,
    message: dbNotification.message,
    type: dbNotification.type,
    read: dbNotification.read,
    createdAt: new Date(dbNotification.created_at),
    channels: dbNotification.channels,
    data: dbNotification.data,
  })

  const transformDatabasePreference = (dbPreference: DatabaseNotificationPreference): NotificationPreference => ({
    id: dbPreference.id,
    notificationType: dbPreference.notification_type,
    channels: dbPreference.channels,
    active: dbPreference.active,
    quietHoursStart: dbPreference.quiet_hours_start,
    quietHoursEnd: dbPreference.quiet_hours_end,
  })

  React.useEffect(() => {
    if (!user || !pusherClient) return

    // Buscar notificações iniciais
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setNotifications(
          (data as DatabaseNotification[]).map(transformDatabaseNotification)
        )
      } catch (error) {
        console.error('Erro ao buscar notificações:', error)
        toast.error('Erro ao carregar notificações')
      }
    }

    // Buscar preferências de notificação
    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)

        if (error) throw error
        setPreferences(
          (data as DatabaseNotificationPreference[]).map(transformDatabasePreference)
        )
      } catch (error) {
        console.error('Erro ao buscar preferências:', error)
        toast.error('Erro ao carregar preferências de notificação')
      }
    }

    fetchNotifications()
    fetchPreferences()

    const channel = pusherClient.subscribe(`private-notifications.${user.id}`)

    channel.bind('notification', (notification: DatabaseNotification) => {
      setNotifications((current) => [
        transformDatabaseNotification(notification),
        ...current,
      ])

      if (!notification.read) {
        toast(notification.title, {
          description: notification.message,
          action: {
            label: 'Ver',
            onClick: () => {
              // TODO: Implementar navegação baseada no tipo de notificação
            },
          },
        })
      }
    })

    channel.bind('notification_deleted', (data: { id: string }) => {
      setNotifications((current) =>
        current.filter((n) => n.id !== data.id)
      )
    })

    channel.bind('notification_updated', (notification: DatabaseNotification) => {
      setNotifications((current) =>
        current.map((n) =>
          n.id === notification.id
            ? transformDatabaseNotification(notification)
            : n
        )
      )
    })

    return () => {
      pusherClient.unsubscribe(`private-notifications.${user.id}`)
    }
  }, [user])

  const markAsRead = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setNotifications((current) =>
        current.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
      toast.error('Erro ao marcar notificação como lida')
    }
  }

  const deleteNotification = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setNotifications((current) => current.filter((n) => n.id !== id))
    } catch (error) {
      console.error('Erro ao excluir notificação:', error)
      toast.error('Erro ao excluir notificação')
    }
  }

  const updatePreferences = async (newPreferences: NotificationPreference[]) => {
    if (!user) return

    try {
      // Atualizar cada preferência individualmente
      for (const pref of newPreferences) {
        const { error } = await supabase
          .from('notification_preferences')
          .update({
            channels: pref.channels,
            active: pref.active,
            quiet_hours_start: pref.quietHoursStart,
            quiet_hours_end: pref.quietHoursEnd,
          })
          .eq('id', pref.id)
          .eq('user_id', user.id)

        if (error) throw error
      }

      setPreferences(newPreferences)
      toast.success('Preferências atualizadas com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error)
      toast.error('Erro ao atualizar preferências')
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const value = {
    notifications,
    unreadCount,
    preferences,
    markAsRead,
    deleteNotification,
    updatePreferences,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = React.useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
} 
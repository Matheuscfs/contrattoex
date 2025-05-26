'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNotifications } from './NotificationProvider'
import type { NotificationType, NotificationChannel } from './NotificationProvider'

const notificationTypeLabels: Record<NotificationType, string> = {
  appointment_created: 'Novo agendamento',
  appointment_updated: 'Atualização de agendamento',
  appointment_cancelled: 'Cancelamento de agendamento',
  chat_message: 'Nova mensagem',
  status_update: 'Atualização de status',
  promotion: 'Promoções e ofertas',
}

const channelLabels: Record<NotificationChannel, string> = {
  app: 'Aplicativo',
  email: 'E-mail',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
}

export function NotificationPreferences() {
  const { preferences, updatePreferences } = useNotifications()
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedPreferences, setEditedPreferences] = React.useState(preferences)
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    setEditedPreferences(preferences)
  }, [preferences])

  const handleChannelToggle = (prefId: string, channel: NotificationChannel) => {
    setEditedPreferences((current) =>
      current.map((pref) =>
        pref.id === prefId
          ? {
              ...pref,
              channels: pref.channels.includes(channel)
                ? pref.channels.filter((c) => c !== channel)
                : [...pref.channels, channel],
            }
          : pref
      )
    )
  }

  const handleActiveToggle = (prefId: string) => {
    setEditedPreferences((current) =>
      current.map((pref) =>
        pref.id === prefId
          ? {
              ...pref,
              active: !pref.active,
            }
          : pref
      )
    )
  }

  const handleQuietHoursChange = (
    prefId: string,
    field: 'quietHoursStart' | 'quietHoursEnd',
    value: string
  ) => {
    setEditedPreferences((current) =>
      current.map((pref) =>
        pref.id === prefId
          ? {
              ...pref,
              [field]: value,
            }
          : pref
      )
    )
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updatePreferences(editedPreferences)
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar preferências:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedPreferences(preferences)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Preferências de Notificação</CardTitle>
            <CardDescription>
              Configure como deseja receber suas notificações
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            disabled={isSaving}
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {editedPreferences.map((pref) => (
          <div key={pref.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-medium">
                {notificationTypeLabels[pref.notificationType]}
              </Label>
              <Switch
                checked={pref.active}
                onCheckedChange={() => handleActiveToggle(pref.id)}
                disabled={!isEditing}
              />
            </div>

            {pref.active && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(channelLabels).map(([channel, label]) => (
                    <div
                      key={channel}
                      className="flex items-center space-x-2"
                    >
                      <Switch
                        id={`${pref.id}-${channel}`}
                        checked={pref.channels.includes(channel as NotificationChannel)}
                        onCheckedChange={() =>
                          handleChannelToggle(pref.id, channel as NotificationChannel)
                        }
                        disabled={!isEditing || channel === 'app'}
                      />
                      <Label htmlFor={`${pref.id}-${channel}`}>{label}</Label>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${pref.id}-start`}>Horário silencioso - Início</Label>
                    <Input
                      id={`${pref.id}-start`}
                      type="time"
                      value={pref.quietHoursStart || ''}
                      onChange={(e) =>
                        handleQuietHoursChange(pref.id, 'quietHoursStart', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${pref.id}-end`}>Horário silencioso - Fim</Label>
                    <Input
                      id={`${pref.id}-end`}
                      type="time"
                      value={pref.quietHoursEnd || ''}
                      onChange={(e) =>
                        handleQuietHoursChange(pref.id, 'quietHoursEnd', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {isEditing && (
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
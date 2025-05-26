'use client'

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bell,
  Calendar,
  CheckCircle,
  MessageSquare,
  Clock,
  X,
  Check,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type NotificationType = "appointment" | "confirmation" | "message";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  data?: {
    appointmentId?: string;
    providerId?: string;
    messageId?: string;
    serviceId?: string;
  };
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onActionClick: (notification: Notification) => void;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  appointment: <Calendar className="w-5 h-5" />,
  confirmation: <CheckCircle className="w-5 h-5" />,
  message: <MessageSquare className="w-5 h-5" />,
};

const notificationColors: Record<NotificationType, string> = {
  appointment: "bg-blue-100 text-blue-600",
  confirmation: "bg-green-100 text-green-600",
  message: "bg-purple-100 text-purple-600",
};

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onDeleteNotification,
  onActionClick,
}: NotificationCenterProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center">
        <Bell className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Nenhuma notificação</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[32rem]">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Notificações</h4>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`mb-4 rounded-lg border p-4 ${
              notification.read ? 'bg-background' : 'bg-muted'
            }`}
          >
            <div className="mb-2 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Marcar como lida</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onDeleteNotification(notification.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir notificação</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={() => onActionClick(notification)}
              >
                Ver detalhes
              </Button>
              <time className="text-xs text-muted-foreground">
                {formatDistanceToNow(notification.date, {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </time>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 
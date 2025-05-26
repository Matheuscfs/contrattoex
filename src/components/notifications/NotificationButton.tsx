import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationCenter } from "./NotificationCenter";
import { useNotifications } from "./NotificationProvider";

export function NotificationButton() {
  const { notifications, unreadCount, markAsRead, deleteNotification } =
    useNotifications();

  const handleActionClick = (notification: any) => {
    // Redirecionar com base no tipo de notificação
    switch (notification.type) {
      case "appointment":
        window.location.href = `/cliente/agendamentos?id=${notification.data?.appointmentId}`;
        break;
      case "message":
        window.location.href = `/chat?id=${notification.data?.messageId}`;
        break;
      case "confirmation":
        window.location.href = `/cliente/agendamentos/${notification.data?.appointmentId}`;
        break;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Abrir notificações"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onDeleteNotification={deleteNotification}
          onActionClick={handleActionClick}
        />
      </PopoverContent>
    </Popover>
  );
} 
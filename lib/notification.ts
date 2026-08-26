export const MAX_NOTIFICATIONS = 2;
export const ETA_THRESHOLD_MINUTES = 3;
export const RESPONSE_WINDOW_SECONDS = 60;

export function canSendNotification(count: number) {
  return count < MAX_NOTIFICATIONS;
}

export function notificationExpiresAt() {
  return new Date(Date.now() + RESPONSE_WINDOW_SECONDS * 1000);
}

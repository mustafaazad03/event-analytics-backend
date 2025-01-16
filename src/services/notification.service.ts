let io: any;

export function sendEventNotification(eventId: string, type: string, message: string) {
  if (io) {
    io.to(eventId).emit(type, { message });
  }
}

export function sendUserNotification(userId: string, type: string, message: string) {
  if (io) {
    io.to(userId).emit(type, { message });
  }
}
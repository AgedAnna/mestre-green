import { Client, type IMessage } from "@stomp/stompjs";
import type { ApiTicket } from "./definitions";

// Browser STOMP base URL. The server-only `API_BASE` is not exposed to the
// client, so realtime uses its own public var (default = production API).
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://api.mestregreen.com";

/** e.g. https://api.mestregreen.com → wss://api.mestregreen.com/ws */
export const WS_URL =
  API_BASE.replace(/^https:/, "wss:").replace(/^http:/, "ws:").replace(/\/$/, "") +
  "/ws";

export const REALTIME_DESTINATIONS = {
  // Public feed of ticket/match updates.
  tickets: "/topic/tickets",
  // Per-user notification pings: { hasUnread: true }.
  notifications: "/user/queue/notifications",
} as const;

export type RealtimeHandlers = {
  onTicket?: (ticket: ApiTicket) => void;
  onNotification?: (payload: { hasUnread?: boolean }) => void;
  onConnect?: () => void;
  onError?: (message: string) => void;
};

/**
 * Creates — but does NOT activate — a STOMP client wired to the backend's
 * `/topic/tickets` feed and the per-user notifications queue. This mirrors the
 * mobile `ticketSocket` (raw WebSocket, JWT in the CONNECT header, 5s reconnect).
 *
 * Browser-only: relies on the global WebSocket via @stomp/stompjs. Intended to
 * be driven from a client component:
 *
 *   const client = createRealtimeClient(token, { onTicket, onNotification });
 *   client.activate();
 *   // …later
 *   client.deactivate();
 */
export function createRealtimeClient(
  token: string,
  handlers: RealtimeHandlers = {}
): Client {
  const client = new Client({
    brokerURL: WS_URL,
    connectHeaders: { Authorization: `Bearer ${token}` },
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe(REALTIME_DESTINATIONS.tickets, (message: IMessage) => {
        if (!handlers.onTicket) return;
        try {
          handlers.onTicket(JSON.parse(message.body) as ApiTicket);
        } catch {
          /* ignore malformed frames */
        }
      });

      client.subscribe(
        REALTIME_DESTINATIONS.notifications,
        (message: IMessage) => {
          if (!handlers.onNotification) return;
          try {
            handlers.onNotification(
              message.body ? JSON.parse(message.body) : { hasUnread: true }
            );
          } catch {
            handlers.onNotification({ hasUnread: true });
          }
        }
      );

      handlers.onConnect?.();
    },
    onStompError: (frame) =>
      handlers.onError?.(frame.headers["message"] ?? "Erro STOMP."),
  });

  return client;
}

"use server";

import { getAccessToken } from "@/lib/session";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api";
import type { ApiNotification, PaginatedResponse } from "@/lib/definitions";

/** Paginated list of the current user's notifications (GET /notifications/mine). */
export async function fetchMyNotifications(opts?: {
  page?: number;
  size?: number;
}): Promise<PaginatedResponse<ApiNotification> | null> {
  const token = await getAccessToken();
  if (!token) return null;
  return getMyNotifications(token, opts);
}

/** Unread badge count (GET /notifications/unread-count). */
export async function fetchUnreadNotificationCount(): Promise<number> {
  const token = await getAccessToken();
  if (!token) return 0;
  return getUnreadNotificationCount(token);
}

/** Marks a single notification read (PUT /notifications/{id}/read). */
export async function markNotification(id: number): Promise<{ ok: boolean }> {
  const token = await getAccessToken();
  if (!token) return { ok: false };
  return { ok: await markNotificationRead(token, id) };
}

/** Marks every notification read (PUT /notifications/read-all). */
export async function markAllNotifications(): Promise<{ ok: boolean }> {
  const token = await getAccessToken();
  if (!token) return { ok: false };
  return { ok: await markAllNotificationsRead(token) };
}

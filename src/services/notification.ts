import { SupabaseClient } from "@supabase/supabase-js";

type Notification = {
  id?: string;
  user_id: string;
  message: string;
  is_read?: boolean;
  created_at?: Date;
};

export default class NotificationService {
  constructor(private supabase: SupabaseClient) {}

  async createNotification(
    notification: Omit<Notification, "id" | "created_at">
  ): Promise<void> {
    const { error } = await this.supabase
      .from("notifications")
      .insert(notification);

    this.handleError(error);
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    this.handleError(error);
    return data || [];
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    this.handleError(error);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    this.handleError(error);
  }

  private handleError(error: unknown): void {
    if (error) throw error;
  }
}

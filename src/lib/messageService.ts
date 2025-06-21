import { supabase, isDemoMode } from "./supabase";

export interface MessageData {
  receiver_id: string;
  message: string;
  message_type?: "text" | "file" | "assignment";
  assignment_id?: string;
  service_id?: string;
}

export class MessageService {
  // Send a new message
  static async sendMessage(senderId: string, messageData: MessageData) {
    if (isDemoMode) {
      console.log("Demo mode: Message would be sent", {
        senderId,
        messageData,
      });
      return { data: { id: `demo-${Date.now()}` }, error: null };
    }

    try {
      const { data, error } = await supabase!
        .from("messages")
        .insert([
          {
            sender_id: senderId,
            receiver_id: messageData.receiver_id,
            message: messageData.message,
            message_type: messageData.message_type || "text",
            assignment_id: messageData.assignment_id,
            service_id: messageData.service_id,
          },
        ])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error sending message:", error);
      return { data: null, error };
    }
  }

  // Get conversation between two users
  static async getConversation(userId1: string, userId2: string) {
    if (isDemoMode) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase!
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`,
        )
        .order("created_at", { ascending: true });

      return { data, error };
    } catch (error) {
      console.error("Error fetching conversation:", error);
      return { data: null, error };
    }
  }

  // Get all conversations for a user
  static async getUserConversations(userId: string) {
    if (isDemoMode) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase!
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      return { data, error };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return { data: null, error };
    }
  }

  // Mark messages as read
  static async markAsRead(userId: string, senderId: string) {
    if (isDemoMode) {
      return { error: null };
    }

    try {
      const { error } = await supabase!
        .from("messages")
        .update({ read: true })
        .eq("sender_id", senderId)
        .eq("receiver_id", userId)
        .eq("read", false);

      return { error };
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return { error };
    }
  }

  // Get unread message count
  static async getUnreadCount(userId: string) {
    if (isDemoMode) {
      return { data: 0, error: null };
    }

    try {
      const { count, error } = await supabase!
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", userId)
        .eq("read", false);

      return { data: count || 0, error };
    } catch (error) {
      console.error("Error getting unread count:", error);
      return { data: 0, error };
    }
  }

  // Subscribe to real-time messages for a user
  static subscribeToMessages(
    userId: string,
    onMessage: (message: any) => void,
  ) {
    if (isDemoMode) {
      console.log("Demo mode: Would subscribe to real-time messages");
      return { unsubscribe: () => {} };
    }

    const subscription = supabase!
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        onMessage,
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase!.removeChannel(subscription);
      },
    };
  }

  // Start a conversation about an assignment
  static async startAssignmentConversation(
    senderId: string,
    receiverId: string,
    assignmentId: string,
    message: string,
  ) {
    return this.sendMessage(senderId, {
      receiver_id: receiverId,
      message,
      message_type: "assignment",
      assignment_id: assignmentId,
    });
  }

  // Start a conversation about a service
  static async startServiceConversation(
    senderId: string,
    receiverId: string,
    serviceId: string,
    message: string,
  ) {
    return this.sendMessage(senderId, {
      receiver_id: receiverId,
      message,
      message_type: "assignment",
      service_id: serviceId,
    });
  }
}

export default MessageService;

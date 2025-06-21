import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import DemoModeBanner from "@/components/DemoModeBanner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, Message, isDemoMode } from "@/lib/supabase";
import {
  MessageSquare,
  Send,
  Search,
  Users,
  Phone,
  MoreVertical,
  Plus,
  Check,
  CheckCheck,
  Clock,
  FileText,
  Image,
  Paperclip,
} from "lucide-react";

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    course: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
    isFromMe: boolean;
  };
  unreadCount: number;
  assignment?: {
    id: string;
    title: string;
  };
  service?: {
    id: string;
    title: string;
  };
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Demo conversations for when database is not configured
  const demoConversations: Conversation[] = [
    {
      id: "demo-1",
      otherUser: {
        id: "user-1",
        name: "Arjun Patel",
        course: "B.Tech CSE, Year 3",
      },
      lastMessage: {
        text: "Thanks for helping with the React assignment!",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isRead: true,
        isFromMe: false,
      },
      unreadCount: 0,
      assignment: {
        id: "assignment-1",
        title: "React.js Dashboard Development",
      },
    },
    {
      id: "demo-2",
      otherUser: {
        id: "user-2",
        name: "Priya Singh",
        course: "MBA, Year 1",
      },
      lastMessage: {
        text: "Are you available for the plumbing service tomorrow?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        isRead: false,
        isFromMe: false,
      },
      unreadCount: 2,
      service: {
        id: "service-1",
        title: "Quick Plumbing Solutions",
      },
    },
    {
      id: "demo-3",
      otherUser: {
        id: "user-3",
        name: "Rohit Kumar",
        course: "B.Com, Year 2",
      },
      lastMessage: {
        text: "I can help you with the calculus problems. When should we meet?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        isRead: true,
        isFromMe: true,
      },
      unreadCount: 0,
    },
  ];

  const demoMessages: Message[] = [
    {
      id: "msg-1",
      sender_id: "user-1",
      receiver_id: "current-user",
      message:
        "Hi! I saw your assignment post about React.js dashboard development.",
      message_type: "text",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "msg-2",
      sender_id: "current-user",
      receiver_id: "user-1",
      message:
        "Yes! I need help with implementing the charts and data tables. Are you experienced with React?",
      message_type: "text",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    },
    {
      id: "msg-3",
      sender_id: "user-1",
      receiver_id: "current-user",
      message:
        "Absolutely! I've been working with React for 2+ years. I can help you with Chart.js integration and responsive tables.",
      message_type: "text",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    },
    {
      id: "msg-4",
      sender_id: "current-user",
      receiver_id: "user-1",
      message:
        "Perfect! What would be your rate for this project? The deadline is next week.",
      message_type: "text",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(),
    },
    {
      id: "msg-5",
      sender_id: "user-1",
      receiver_id: "current-user",
      message:
        "I can do it for ₹2200. I'll provide clean, well-documented code with explanations. Should take 3-4 days.",
      message_type: "text",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: "msg-6",
      sender_id: "current-user",
      receiver_id: "user-1",
      message: "Sounds great! Let's proceed. Can you start tomorrow?",
      message_type: "text",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "msg-7",
      sender_id: "user-1",
      receiver_id: "current-user",
      message: "Thanks for helping with the React assignment!",
      message_type: "text",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ];

  useEffect(() => {
    if (user && !isDemoMode) {
      fetchConversations();
    } else {
      // Use demo data
      setConversations(demoConversations);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    if (isDemoMode || !user) return;

    setError(null);
    try {
      // First, get all messages for the user
      const { data: messagesData, error: messagesError } = await supabase!
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        setError(`Database error: ${messagesError.message}`);
        return;
      }

      if (!messagesData || messagesData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs from messages
      const userIds = new Set<string>();
      messagesData.forEach((msg: any) => {
        const otherUserId =
          msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        userIds.add(otherUserId);
      });

      // Fetch profiles for all these users
      const { data: profilesData, error: profilesError } = await supabase!
        .from("profiles")
        .select("id, full_name, course")
        .in("id", Array.from(userIds));

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        // Continue without profile data
      }

      // Create a map of user profiles
      const profilesMap = new Map();
      profilesData?.forEach((profile: any) => {
        profilesMap.set(profile.id, profile);
      });

      // Group messages by conversation and get latest message for each
      const conversationMap = new Map();

      messagesData.forEach((msg: any) => {
        const otherUserId =
          msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const otherUserProfile = profilesMap.get(otherUserId);

        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            otherUser: {
              id: otherUserId,
              name: otherUserProfile?.full_name || "Unknown User",
              course: otherUserProfile?.course || "Student",
            },
            lastMessage: {
              text: msg.message,
              timestamp: msg.created_at,
              isRead: msg.read,
              isFromMe: msg.sender_id === user.id,
            },
            unreadCount: 0,
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error: any) {
      console.error("Error fetching conversations:", error);
      setError(error.message);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    if (isDemoMode) {
      setMessages(demoMessages);
      return;
    }

    if (!user) return;

    try {
      const { data: messagesData, error } = await supabase!
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${user.id})`,
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(messagesData || []);

      // Mark messages as read
      await supabase!
        .from("messages")
        .update({ read: true })
        .eq("sender_id", conversationId)
        .eq("receiver_id", user.id);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    if (isDemoMode) {
      // Add message to demo data
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        sender_id: "current-user",
        receiver_id: selectedConversation,
        message: newMessage,
        message_type: "text",
        read: false,
        created_at: new Date().toISOString(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
      return;
    }

    try {
      const { error } = await supabase!.from("messages").insert([
        {
          sender_id: user.id,
          receiver_id: selectedConversation,
          message: newMessage,
          message_type: "text",
        },
      ]);

      if (error) {
        console.error("Error sending message:", error);
        return;
      }

      setNewMessage("");
      fetchMessages(selectedConversation);
      fetchConversations(); // Refresh conversation list
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
            <p className="text-muted-foreground mb-6">
              Please login to view your messages
            </p>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <DemoModeBanner />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6 h-[700px]">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-student h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Messages</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[580px]">
                  {loading ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Loading conversations...
                    </div>
                  ) : filteredConversations.length > 0 ? (
                    <div className="space-y-1">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => {
                            setSelectedConversation(conversation.id);
                            fetchMessages(conversation.id);
                          }}
                          className={`p-4 hover:bg-accent cursor-pointer transition-colors border-b border-border/40 ${
                            selectedConversation === conversation.id
                              ? "bg-accent"
                              : ""
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>
                                {conversation.otherUser.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate">
                                  {conversation.otherUser.name}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(
                                    conversation.lastMessage.timestamp,
                                  )}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                {conversation.otherUser.course}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground truncate pr-2">
                                  {conversation.lastMessage.isFromMe && (
                                    <span className="mr-1">
                                      {conversation.lastMessage.isRead ? (
                                        <CheckCheck className="w-3 h-3 inline text-blue-500" />
                                      ) : (
                                        <Check className="w-3 h-3 inline" />
                                      )}
                                    </span>
                                  )}
                                  {conversation.lastMessage.text}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <Badge className="bg-primary text-primary-foreground text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              {(conversation.assignment ||
                                conversation.service) && (
                                <div className="mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {conversation.assignment && (
                                      <>
                                        <FileText className="w-3 h-3 mr-1" />
                                        Assignment
                                      </>
                                    )}
                                    {conversation.service && (
                                      <>
                                        <Users className="w-3 h-3 mr-1" />
                                        Service
                                      </>
                                    )}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No conversations yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start messaging when you post or respond to assignments
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-student h-full">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {
                              conversations.find(
                                (c) => c.id === selectedConversation,
                              )?.otherUser.name[0]
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {
                              conversations.find(
                                (c) => c.id === selectedConversation,
                              )?.otherUser.name
                            }
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {
                              conversations.find(
                                (c) => c.id === selectedConversation,
                              )?.otherUser.course
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="p-0">
                    <ScrollArea className="h-[480px] p-4">
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isFromMe =
                            message.sender_id === user?.id ||
                            message.sender_id === "current-user";
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  isFromMe
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <div className="flex items-center justify-end mt-1 space-x-1">
                                  <span className="text-xs opacity-70">
                                    {formatTime(message.created_at)}
                                  </span>
                                  {isFromMe && (
                                    <span className="text-xs">
                                      {message.read ? (
                                        <CheckCheck className="w-3 h-3 text-blue-200" />
                                      ) : (
                                        <Check className="w-3 h-3 opacity-70" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-4 border-t border-border/40">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                              }
                            }}
                            className="pr-12"
                          />
                          <Button
                            size="sm"
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the sidebar to start messaging
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

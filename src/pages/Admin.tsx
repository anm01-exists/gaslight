import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import DemoModeBanner from "@/components/DemoModeBanner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isDemoMode } from "@/lib/supabase";
import {
  Shield,
  Users,
  FileText,
  Briefcase,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Star,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Ban,
  UserCheck,
  Mail,
  Phone,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalAssignments: number;
  totalServices: number;
  totalResources: number;
  totalMessages: number;
  pendingVerifications: number;
  recentSignups: number;
  totalRevenue: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  course: string;
  year: number;
  college: string;
  rating: number;
  total_earnings: number;
  created_at: string;
  is_admin?: boolean;
  is_banned?: boolean;
}

const Admin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalAssignments: 0,
    totalServices: 0,
    totalResources: 0,
    totalMessages: 0,
    pendingVerifications: 0,
    recentSignups: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Demo data for when database is not configured
  const demoStats: AdminStats = {
    totalUsers: 156,
    totalAssignments: 42,
    totalServices: 18,
    totalResources: 89,
    totalMessages: 234,
    pendingVerifications: 7,
    recentSignups: 12,
    totalRevenue: 45600,
  };

  const demoUsers: User[] = [
    {
      id: "user-1",
      email: "student1@college.edu",
      full_name: "Arjun Patel",
      course: "B.Tech CSE",
      year: 3,
      college: "Demo University",
      rating: 4.8,
      total_earnings: 15600,
      created_at: "2024-01-15",
      is_admin: false,
      is_banned: false,
    },
    {
      id: "user-2",
      email: "student2@college.edu",
      full_name: "Priya Singh",
      course: "MBA",
      year: 1,
      college: "Demo University",
      rating: 4.6,
      total_earnings: 8900,
      created_at: "2024-01-10",
      is_admin: false,
      is_banned: false,
    },
    {
      id: "user-3",
      email: "provider@services.com",
      full_name: "Rajesh Kumar",
      course: "Service Provider",
      year: 0,
      college: "External",
      rating: 4.9,
      total_earnings: 34500,
      created_at: "2023-12-20",
      is_admin: false,
      is_banned: false,
    },
  ];

  useEffect(() => {
    if (user) {
      checkAdminPermissions();
    } else {
      setCheckingAdmin(false);
    }
  }, [user]);

  const checkAdminPermissions = async () => {
    if (!user) return;

    if (isDemoMode) {
      // In demo mode, allow access for demonstration
      setIsAdmin(true);
      setStats(demoStats);
      setUsers(demoUsers);
      setLoading(false);
      setCheckingAdmin(false);
      return;
    }

    try {
      console.log("Admin page: Checking admin status for user:", user.id);

      const { data: profile, error } = await supabase!
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      console.log("Admin page: Check result:", { profile, error });

      if (error) {
        console.error("Admin page: Supabase error details:");
        console.error("- Message:", error.message);
        console.error("- Code:", error.code);
        console.error("- Details:", error.details);
        console.error("- Hint:", error.hint);
        console.error("- Full error:", JSON.stringify(error, null, 2));

        // If column doesn't exist or table doesn't exist, assume not admin
        if (
          error.code === "PGRST116" ||
          error.code === "42P01" ||
          error.message?.includes("column") ||
          error.message?.includes("does not exist") ||
          error.message?.includes("relation") ||
          error.message?.includes("profiles")
        ) {
          console.warn(
            "Admin page: Profiles table or is_admin column issue, treating as non-admin",
          );
          setIsAdmin(false);
        } else {
          setIsAdmin(false);
        }
        setCheckingAdmin(false);
        return;
      }

      console.log("Admin page: Profile data:", profile);
      if (profile?.is_admin) {
        setIsAdmin(true);
        fetchAdminData();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Admin page: JavaScript error in checkAdminPermissions:");
      console.error("- Error name:", error?.name);
      console.error("- Error message:", error?.message);
      console.error("- Error stack:", error?.stack);
      console.error("- Full error object:", error);
      setIsAdmin(false);
      setLoading(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const fetchAdminData = async () => {
    if (isDemoMode || !user) return;

    setError(null);
    try {
      // Fetch all stats in parallel
      const [
        usersData,
        assignmentsData,
        servicesData,
        resourcesData,
        messagesData,
      ] = await Promise.all([
        supabase!
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase!
          .from("assignments")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase!
          .from("service_providers")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase!
          .from("study_resources")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase!
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      // Check for errors
      if (usersData.error) throw usersData.error;
      if (assignmentsData.error) throw assignmentsData.error;
      if (servicesData.error) throw servicesData.error;
      if (resourcesData.error) throw resourcesData.error;
      if (messagesData.error) throw messagesData.error;

      // Set data
      setUsers(usersData.data || []);
      setAssignments(assignmentsData.data || []);
      setServices(servicesData.data || []);
      setResources(resourcesData.data || []);

      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      setStats({
        totalUsers: usersData.data?.length || 0,
        totalAssignments: assignmentsData.data?.length || 0,
        totalServices: servicesData.data?.length || 0,
        totalResources: resourcesData.data?.length || 0,
        totalMessages: messagesData.data?.length || 0,
        pendingVerifications:
          servicesData.data?.filter((s: any) => !s.verified).length || 0,
        recentSignups:
          usersData.data?.filter((u: any) => new Date(u.created_at) > weekAgo)
            .length || 0,
        totalRevenue:
          usersData.data?.reduce(
            (sum: number, u: any) => sum + (u.total_earnings || 0),
            0,
          ) || 0,
      });
    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (
    userId: string,
    action: "ban" | "unban" | "verify" | "delete",
  ) => {
    if (isDemoMode) {
      alert(`Demo mode: Would ${action} user ${userId}`);
      return;
    }

    try {
      switch (action) {
        case "ban":
        case "unban":
          // In a real implementation, you'd update a banned status
          alert(`User ${action}ned successfully`);
          break;
        case "verify":
          alert("User verified successfully");
          break;
        case "delete":
          if (
            confirm(
              "Are you sure you want to delete this user? This action cannot be undone.",
            )
          ) {
            const { error } = await supabase!
              .from("profiles")
              .delete()
              .eq("id", userId);
            if (error) throw error;
            alert("User deleted successfully");
            fetchAdminData(); // Refresh data
          }
          break;
      }
    } catch (error: any) {
      console.error(`Error ${action}ning user:`, error);
      alert(`Failed to ${action} user: ${error.message}`);
    }
  };

  const handleContentAction = async (
    contentId: string,
    table: string,
    action: "approve" | "reject" | "delete",
  ) => {
    if (isDemoMode) {
      alert(`Demo mode: Would ${action} ${table} item ${contentId}`);
      return;
    }

    try {
      switch (action) {
        case "approve":
          await supabase!
            .from(table)
            .update({ verified: true })
            .eq("id", contentId);
          alert("Content approved successfully");
          break;
        case "reject":
          await supabase!
            .from(table)
            .update({ verified: false })
            .eq("id", contentId);
          alert("Content rejected");
          break;
        case "delete":
          if (confirm("Are you sure you want to delete this content?")) {
            await supabase!.from(table).delete().eq("id", contentId);
            alert("Content deleted successfully");
          }
          break;
      }
      fetchAdminData(); // Refresh data
    } catch (error: any) {
      console.error(`Error ${action}ing content:`, error);
      alert(`Failed to ${action} content: ${error.message}`);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.course.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Show loading while checking admin permissions
  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <h1 className="text-2xl font-bold mb-4">Checking Permissions...</h1>
            <p className="text-muted-foreground">
              Verifying admin access rights
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show login required if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-6">
              Please login to access this page
            </p>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold mb-4 text-red-600">
              Access Denied
            </h1>
            <p className="text-muted-foreground mb-6">
              You don't have admin privileges to access this page.
            </p>
            <div className="space-x-4">
              <Button asChild variant="outline">
                <a href="/">Go Home</a>
              </Button>
              <Button asChild>
                <a href="/dashboard">My Dashboard</a>
              </Button>
            </div>
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

        {/* Admin Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage users, content, and platform settings
            </p>
          </div>
          <Badge variant="outline" className="px-4 py-2">
            <Settings className="w-4 h-4 mr-2" />
            Administrator
          </Badge>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg">Loading admin data...</div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-student">
                  <CardContent className="text-center pt-6">
                    <Users className="w-8 h-8 mx-auto mb-4 text-student-blue-500" />
                    <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      +{stats.recentSignups} this week
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-student">
                  <CardContent className="text-center pt-6">
                    <FileText className="w-8 h-8 mx-auto mb-4 text-student-green-500" />
                    <h3 className="text-2xl font-bold">
                      {stats.totalAssignments}
                    </h3>
                    <p className="text-sm text-muted-foreground">Assignments</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-student">
                  <CardContent className="text-center pt-6">
                    <Briefcase className="w-8 h-8 mx-auto mb-4 text-student-orange-500" />
                    <h3 className="text-2xl font-bold">
                      {stats.totalServices}
                    </h3>
                    <p className="text-sm text-muted-foreground">Services</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {stats.pendingVerifications} pending
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-student">
                  <CardContent className="text-center pt-6">
                    <DollarSign className="w-8 h-8 mx-auto mb-4 text-student-beige-600" />
                    <h3 className="text-2xl font-bold">
                      ₹{stats.totalRevenue.toLocaleString()}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Platform Revenue
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-student">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>New user registration</span>
                        <span className="text-muted-foreground">
                          2 hours ago
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Assignment posted</span>
                        <span className="text-muted-foreground">
                          4 hours ago
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Service provider verified</span>
                        <span className="text-muted-foreground">
                          6 hours ago
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Resource uploaded</span>
                        <span className="text-muted-foreground">1 day ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-student">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Pending Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Service verifications</span>
                        <Badge variant="outline">
                          {stats.pendingVerifications}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Content reports</span>
                        <Badge variant="outline">3</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">User appeals</span>
                        <Badge variant="outline">1</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment disputes</span>
                        <Badge variant="outline">0</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Management Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="border-0 shadow-student">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="banned">Banned</SelectItem>
                          <SelectItem value="new">New (7 days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {user.full_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">
                                  {user.full_name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {user.course}
                              {user.year > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  Year {user.year}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                              <span className="text-sm">{user.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            ₹{user.total_earnings.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.is_banned ? "destructive" : "secondary"
                              }
                            >
                              {user.is_banned ? "Banned" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUserAction(
                                    user.id,
                                    user.is_banned ? "unban" : "ban",
                                  )
                                }
                              >
                                {user.is_banned ? (
                                  <UserCheck className="w-3 h-3" />
                                ) : (
                                  <Ban className="w-3 h-3" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUserAction(user.id, "verify")
                                }
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUserAction(user.id, "delete")
                                }
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assignments Management Tab */}
            <TabsContent value="assignments" className="space-y-6">
              <Card className="border-0 shadow-student">
                <CardHeader>
                  <CardTitle>Assignment Management</CardTitle>
                  <CardDescription>
                    Monitor and moderate assignment posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isDemoMode
                        ? "Demo mode: Assignment management interface"
                        : "Assignment management coming soon"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Management Tab */}
            <TabsContent value="services" className="space-y-6">
              <Card className="border-0 shadow-student">
                <CardHeader>
                  <CardTitle>Service Provider Management</CardTitle>
                  <CardDescription>
                    Verify and manage service providers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isDemoMode
                        ? "Demo mode: Service management interface"
                        : "Service management coming soon"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Management Tab */}
            <TabsContent value="resources" className="space-y-6">
              <Card className="border-0 shadow-student">
                <CardHeader>
                  <CardTitle>Study Resources Management</CardTitle>
                  <CardDescription>
                    Moderate and verify study resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isDemoMode
                        ? "Demo mode: Resource management interface"
                        : "Resource management coming soon"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-student">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Platform Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">User Growth (30 days)</span>
                        <Badge className="bg-green-100 text-green-700">
                          +15%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Assignment Volume</span>
                        <Badge className="bg-blue-100 text-blue-700">
                          +22%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Service Bookings</span>
                        <Badge className="bg-orange-100 text-orange-700">
                          +8%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Revenue Growth</span>
                        <Badge className="bg-purple-100 text-purple-700">
                          +18%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-student">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Users (24h)</span>
                        <span className="font-medium">89</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avg. Session Duration</span>
                        <span className="font-medium">12m 34s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Assignment Success Rate</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">User Satisfaction</span>
                        <span className="font-medium">4.6/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Admin;

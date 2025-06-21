import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DemoModeBanner from "@/components/DemoModeBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, Profile, isDemoMode } from "@/lib/supabase";
import {
  User,
  Wallet,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
  TrendingUp,
  Clock,
  Star,
  FileText,
  Wrench,
  BookOpen,
  Edit,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assignments, setAssignments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    course: "",
    year: 1,
    college: "",
    phone: "",
  });

  useEffect(() => {
    if (user && !isDemoMode) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase!
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        setProfileForm({
          full_name: profileData.full_name,
          course: profileData.course,
          year: profileData.year,
          college: profileData.college,
          phone: profileData.phone || "",
        });
      }

      // Fetch user's assignments
      const { data: assignmentsData } = await supabase!
        .from("assignments")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setAssignments(assignmentsData || []);

      // Fetch recent messages
      const { data: messagesData } = await supabase!
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
        .order("created_at", { ascending: false })
        .limit(5);

      setMessages(messagesData || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user || isDemoMode) return;

    try {
      const { error } = await supabase!
        .from("profiles")
        .update(profileForm)
        .eq("id", user.id);

      if (error) throw error;

      setProfile({ ...profile!, ...profileForm });
      setEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
            <p className="text-muted-foreground mb-6">
              Please login to view your dashboard
            </p>
            <div className="space-x-4">
              <Link to="/login">
                <Button>Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
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

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.full_name?.split(" ")[0] || "Student"}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your StudyHub account
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>

        {isDemoMode && (
          <Alert className="mb-6">
            <AlertDescription>
              This is demo mode. Connect to Supabase to see real dashboard data.
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg">Loading dashboard...</div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-student">
                  <CardContent className="text-center pt-6">
                    <TrendingUp className="w-8 h-8 mx-auto mb-4 text-student-green-500" />
                    <h3 className="text-2xl font-bold">
                      ₹{profile?.total_earnings || 0}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Total Earnings
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-student">
                  <CardContent className="text-center pt-6">
                    <FileText className="w-8 h-8 mx-auto mb-4 text-student-blue-500" />
                    <h3 className="text-2xl font-bold">{assignments.length}</h3>
                    <p className="text-sm text-muted-foreground">
                      Posted Assignments
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-student">
                  <CardContent className="text-center pt-6">
                    <MessageSquare className="w-8 h-8 mx-auto mb-4 text-student-orange-500" />
                    <h3 className="text-2xl font-bold">{messages.length}</h3>
                    <p className="text-sm text-muted-foreground">Messages</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-student">
                  <CardContent className="text-center pt-6">
                    <Star className="w-8 h-8 mx-auto mb-4 text-student-beige-600" />
                    <h3 className="text-2xl font-bold">
                      {profile?.rating?.toFixed(1) || "New"}
                    </h3>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-student">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/assignments">
                      <Button
                        variant="outline"
                        className="w-full h-20 flex-col"
                      >
                        <FileText className="w-6 h-6 mb-2" />
                        Post Assignment
                      </Button>
                    </Link>
                    <Link to="/services">
                      <Button
                        variant="outline"
                        className="w-full h-20 flex-col"
                      >
                        <Wrench className="w-6 h-6 mb-2" />
                        Find Services
                      </Button>
                    </Link>
                    <Link to="/resources">
                      <Button
                        variant="outline"
                        className="w-full h-20 flex-col"
                      >
                        <BookOpen className="w-6 h-6 mb-2" />
                        Browse Resources
                      </Button>
                    </Link>
                    <Link to="/messages">
                      <Button
                        variant="outline"
                        className="w-full h-20 flex-col"
                      >
                        <MessageSquare className="w-6 h-6 mb-2" />
                        View Messages
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="border-0 shadow-student">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProfile(!editingProfile)}
                  >
                    {editingProfile ? (
                      <Save className="w-4 h-4 mr-2" />
                    ) : (
                      <Edit className="w-4 h-4 mr-2" />
                    )}
                    {editingProfile ? "Save" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="text-2xl">
                        {profile?.full_name?.[0] || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {profile?.full_name || "Student"}
                      </h3>
                      <p className="text-muted-foreground">
                        {profile?.course || "Course not specified"}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        Year {profile?.year || 1}
                      </Badge>
                    </div>
                  </div>

                  {editingProfile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={profileForm.full_name}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              full_name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="course">Course</Label>
                        <Input
                          id="course"
                          value={profileForm.course}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              course: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          type="number"
                          min="1"
                          max="5"
                          value={profileForm.year}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              year: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="college">College</Label>
                        <Input
                          id="college"
                          value={profileForm.college}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              college: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Button
                          onClick={handleProfileUpdate}
                          className="btn-primary"
                          disabled={isDemoMode}
                        >
                          {isDemoMode ? "Demo Mode" : "Update Profile"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">
                              {profile?.email || user.email}
                            </p>
                          </div>
                        </div>
                        {profile?.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Phone</p>
                              <p className="text-sm text-muted-foreground">
                                {profile.phone}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">College</p>
                            <p className="text-sm text-muted-foreground">
                              {profile?.college || "Not specified"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Member Since</p>
                            <p className="text-sm text-muted-foreground">
                              {profile?.created_at
                                ? new Date(
                                    profile.created_at,
                                  ).toLocaleDateString()
                                : "Recently"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assignments">
              <Card className="border-0 shadow-student">
                <CardHeader>
                  <CardTitle>Your Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  {assignments.length > 0 ? (
                    <div className="space-y-4">
                      {assignments.map((assignment: any) => (
                        <div
                          key={assignment.id}
                          className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                {assignment.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {assignment.description.substring(0, 100)}...
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>₹{assignment.budget}</span>
                                <span>
                                  Due:{" "}
                                  {new Date(
                                    assignment.deadline,
                                  ).toLocaleDateString()}
                                </span>
                                <span>
                                  {assignment.proposals_count || 0} proposals
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline">
                              {assignment.urgency}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No assignments posted yet
                      </p>
                      <Link to="/assignments">
                        <Button className="mt-4">
                          Post Your First Assignment
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="border-0 shadow-student">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Activity tracking coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

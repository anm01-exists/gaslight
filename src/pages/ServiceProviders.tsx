import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import DemoModeBanner from "@/components/DemoModeBanner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, ServiceProvider, isDemoMode } from "@/lib/supabase";
import MessageService from "@/lib/messageService";
import {
  Wrench,
  Zap,
  Droplets,
  Car,
  Shirt,
  Utensils,
  MapPin,
  Clock,
  Star,
  Plus,
  Search,
  Phone,
  CheckCircle,
  Filter,
} from "lucide-react";

const ServiceProviders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const categories = [
    { id: "all", name: "All Services", icon: Wrench },
    { id: "repair", name: "Repair & Maintenance", icon: Wrench },
    { id: "cleaning", name: "Cleaning Services", icon: Shirt },
    { id: "food", name: "Food & Catering", icon: Utensils },
    { id: "transport", name: "Transportation", icon: Car },
  ];

  const priceRanges = [
    { id: "all", name: "All Price Ranges" },
    { id: "budget", name: "Budget (₹)" },
    { id: "moderate", name: "Moderate (₹₹)" },
    { id: "premium", name: "Premium (₹₹₹)" },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    if (isDemoMode) {
      setServices([]);
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const { data, error } = await supabase!
        .from("service_providers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setError(`Database error: ${error.message}`);
        throw error;
      }
      setServices(data || []);
    } catch (error: any) {
      console.error("Error fetching services:", error);
      setError(error.message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;

    const matchesPriceRange =
      selectedPriceRange === "all" ||
      service.price_range === selectedPriceRange;

    return matchesSearch && matchesCategory && matchesPriceRange;
  });

  const getPriceRangeDisplay = (priceRange: string) => {
    switch (priceRange) {
      case "budget":
        return "₹";
      case "moderate":
        return "₹₹";
      case "premium":
        return "₹₹₹";
      default:
        return "₹";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "repair":
        return "bg-student-blue-50 text-student-blue-600";
      case "cleaning":
        return "bg-student-green-50 text-student-green-600";
      case "food":
        return "bg-student-orange-50 text-student-orange-600";
      case "transport":
        return "bg-student-beige-50 text-student-beige-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const handleBookService = (serviceId: string) => {
    if (!user) {
      alert("Please login to book services");
      return;
    }
    alert(`Booking functionality coming soon! Service ID: ${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />

      {/* Header */}
      <section className="bg-background/60 border-b border-border/40">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Home & Hostel <span className="text-gradient">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find trusted service providers for all your daily needs. Rated and
              reviewed by fellow students.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <DemoModeBanner />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <strong>Error:</strong> {error}
              <br />
              <span className="text-sm mt-2 block">
                Make sure you've run the complete database setup script.
              </span>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            <Card className="border-0 shadow-student">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Find Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2" />
                              {category.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range
                  </label>
                  <Select
                    value={selectedPriceRange}
                    onValueChange={setSelectedPriceRange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.id} value={range.id}>
                          {range.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-border/40">
                  <h4 className="font-medium mb-3">Service Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Services
                      </span>
                      <span className="font-medium">{services.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verified</span>
                      <span className="font-medium text-student-green-600">
                        {services.filter((s) => s.verified).length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {filteredServices.length} services available
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Sorted by rating and verification status
                </p>
              </div>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Sort by
              </Button>
            </div>

            {/* Service Cards */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Loading services...</div>
                </div>
              ) : (
                filteredServices.map((service) => (
                  <Card
                    key={service.id}
                    className="border-0 shadow-student hover:shadow-student-lg transition-all duration-300 bg-card/80 backdrop-blur"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={`text-xs ${getCategoryColor(service.category)}`}
                            >
                              {
                                categories.find(
                                  (c) => c.id === service.category,
                                )?.name
                              }
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getPriceRangeDisplay(service.price_range)}
                            </Badge>
                            {service.verified && (
                              <Badge className="text-xs bg-student-green-100 text-student-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl mb-2">
                            {service.title}
                          </CardTitle>
                          <CardDescription className="text-base leading-relaxed">
                            {service.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Service Details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-student-blue-600" />
                          <span>{service.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-student-orange-500 fill-current" />
                          <span>{service.rating} rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-student-green-600" />
                          <span>{service.total_bookings} bookings</span>
                        </div>
                      </div>

                      {/* Provider Info & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/40">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {service.provider_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">
                              {service.provider_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {service.provider_experience ||
                                "Service Provider"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (!user) {
                                alert(
                                  "Please login to contact service providers",
                                );
                                return;
                              }

                              const message = `Hi! I'm interested in your service: "${service.title}". Could we discuss the details and pricing?`;

                              try {
                                await MessageService.startServiceConversation(
                                  user.id,
                                  service.user_id,
                                  service.id,
                                  message,
                                );

                                alert(
                                  "Message sent! Check your messages to continue the conversation.",
                                );
                              } catch (error) {
                                console.error("Error sending message:", error);
                                alert(
                                  "Failed to send message. Please try again.",
                                );
                              }
                            }}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                          <Button
                            size="sm"
                            className="btn-primary"
                            onClick={() => handleBookService(service.id)}
                          >
                            Book Service
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Empty State */}
            {!loading && filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No services found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isDemoMode
                    ? "Configure Supabase to see real services"
                    : "Try adjusting your filters or check back later"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedPriceRange("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviders;

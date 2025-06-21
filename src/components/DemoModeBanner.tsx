import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { isDemoMode } from "@/lib/supabase";
import { Info, ExternalLink } from "lucide-react";

export const DemoModeBanner = () => {
  if (!isDemoMode) return null;

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-800 mb-6">
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Demo Mode:</strong> This app is running in demo mode. To
          enable full functionality, configure Supabase.
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-4 border-amber-300 text-amber-800 hover:bg-amber-100"
          onClick={() => window.open("https://supabase.com", "_blank")}
        >
          Setup Supabase
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default DemoModeBanner;

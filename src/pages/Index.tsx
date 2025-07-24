import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center">
      <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Doctor-Patient Connect
        </h1>

        <p className="text-xl text-muted-foreground animate-in fade-in delay-300 duration-700">
          Find doctors near you or add your clinic location for patients to discover
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in delay-500 duration-700">
          <Link to="/doctor">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
              I am a Doctor
            </Button>
          </Link>
          <Link to="/patient">
            <Button size="lg" className="w-full sm:w-auto px-8">
              I am a Patient
            </Button>
          </Link>
        </div>

        <div className="mt-16 text-sm text-gray-500 animate-in fade-in delay-700 duration-700">
          <p>Powered by Google Maps API</p>
        </div>
      </div>
    </div>
  );
}

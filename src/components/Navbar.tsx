import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold">
          Doc-Patient Connect
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/doctor">
            <Button variant="outline">For Doctors</Button>
          </Link>
          <Link to="/patient">
            <Button>For Patients</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
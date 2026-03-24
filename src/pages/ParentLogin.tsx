import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import schoolLogo from "@/assets/school-logo.jpeg";
import { GraduationCap, LogIn } from "lucide-react";

const ParentLogin = () => {
  const [registerNumber, setRegisterNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmed = registerNumber.trim();
    if (!trimmed) {
      setError("Please enter a Register Number.");
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("students")
      .select("*")
      .eq("register_number", trimmed)
      .maybeSingle();

    if (fetchError) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    if (!data) {
      setError("No student found with this Register Number.");
      setLoading(false);
      return;
    }

    // Store in sessionStorage for the profile page
    sessionStorage.setItem("student_data", JSON.stringify(data));
    navigate("/parent/profile");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-center">
            <img
              src={schoolLogo}
              alt="Dunne's Institute Logo"
              className="w-24 h-24 mx-auto rounded-full border-4 border-white/30 shadow-lg object-cover mb-4"
            />
            <h1 className="text-2xl font-bold text-white font-['Playfair_Display']">
              Dunne's Institute
            </h1>
            <p className="text-blue-200 text-sm mt-1">Parent Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="text-center mb-2">
              <GraduationCap className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-gray-800">Parent Login</h2>
              <p className="text-sm text-gray-500">Enter your child's Register Number</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register" className="text-gray-700 font-medium">
                Register Number
              </Label>
              <Input
                id="register"
                type="text"
                placeholder="e.g. 8875"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-xl"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  View Profile
                </span>
              )}
            </Button>

            <p className="text-xs text-center text-gray-400 mt-4">
              Contact the school office if you don't know your Register Number.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParentLogin;

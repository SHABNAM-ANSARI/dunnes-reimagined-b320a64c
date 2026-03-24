import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import schoolLogo from "@/assets/school-logo.jpeg";
import { ArrowLeft, Phone, MessageCircle, User, GraduationCap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: string;
  register_number: string;
  student_name: string;
  class_name: string;
  father_name: string;
  mother_name: string;
  primary_mobile: string;
  secondary_mobile: string;
  active_whatsapp: string;
}

const ParentProfile = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [activeWhatsapp, setActiveWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("student_data");
    if (!stored) {
      navigate("/parent");
      return;
    }
    const data = JSON.parse(stored) as Student;
    setStudent(data);
    setActiveWhatsapp(data.active_whatsapp || "");
  }, [navigate]);

  const handleSetWhatsapp = async (number: string) => {
    if (!student) return;
    setSaving(true);
    setActiveWhatsapp(number);

    const { error } = await supabase.rpc("set_active_whatsapp", {
      p_register_number: student.register_number,
      p_active_whatsapp: number,
    });

    if (error) {
      toast.error("Failed to update WhatsApp number.");
    } else {
      toast.success("WhatsApp number updated!");
      // Update session storage too
      const updated = { ...student, active_whatsapp: number };
      sessionStorage.setItem("student_data", JSON.stringify(updated));
      setStudent(updated);
    }
    setSaving(false);
  };

  if (!student) return null;

  const mobiles = [student.primary_mobile, student.secondary_mobile].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => {
            sessionStorage.removeItem("student_data");
            navigate("/parent");
          }}
          className="mb-4 text-blue-700 hover:text-blue-900 hover:bg-blue-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>

        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-center">
            <img
              src={schoolLogo}
              alt="Dunne's Institute Logo"
              className="w-20 h-20 mx-auto rounded-full border-4 border-white/30 shadow-lg object-cover mb-3"
            />
            <h1 className="text-xl font-bold text-white font-['Playfair_Display']">
              Dunne's Institute
            </h1>
            <p className="text-blue-200 text-xs mt-1">Student Profile</p>
          </div>

          {/* Student Info */}
          <div className="p-6 space-y-5">
            {/* Name Card */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{student.student_name}</h2>
                  <p className="text-sm text-blue-600 font-medium">Reg. No: {student.register_number}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoItem icon={<GraduationCap className="w-4 h-4" />} label="Class" value={`Std ${student.class_name}`} />
                {student.father_name && (
                  <InfoItem icon={<User className="w-4 h-4" />} label="Father" value={student.father_name} />
                )}
                {student.mother_name && (
                  <InfoItem icon={<User className="w-4 h-4" />} label="Mother" value={student.mother_name} />
                )}
              </div>
            </div>

            {/* Mobile Numbers */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Contact Numbers
              </h3>
              {mobiles.length === 0 ? (
                <p className="text-gray-400 text-sm">No mobile numbers on file.</p>
              ) : (
                <div className="space-y-3">
                  {mobiles.map((mob) => (
                    <div
                      key={mob}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        activeWhatsapp === mob
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-gray-50 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <span className="text-lg font-mono font-medium text-gray-800">
                          +91 {mob}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        disabled={saving}
                        onClick={() => handleSetWhatsapp(mob)}
                        className={`rounded-lg text-xs px-3 ${
                          activeWhatsapp === mob
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-white border border-green-400 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {activeWhatsapp === mob ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            Set WhatsApp
                          </span>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {activeWhatsapp && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-green-700 text-sm font-medium flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Active WhatsApp: +91 {activeWhatsapp}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-white rounded-lg p-3 border border-blue-50">
    <div className="flex items-center gap-1.5 text-blue-600 mb-1">
      {icon}
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
    <p className="text-sm font-semibold text-gray-800">{value}</p>
  </div>
);

export default ParentProfile;

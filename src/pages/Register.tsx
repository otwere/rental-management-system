import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building } from "lucide-react";
import { UserRole } from "@/types/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("tenant");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState(false);
  const [maskedPhoneNumber, setMaskedPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Function to send OTP to the phone number
  const sendOtp = async () => {
    if (!phoneNumber) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      // Simulate sending OTP (replace this with actual API call)
      console.log(`Sending OTP to ${phoneNumber}`);
      setSentOtp(true);
      setMaskedPhoneNumber(maskPhoneNumber(phoneNumber));
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    }
  };

  // Function to mask the phone number
  const maskPhoneNumber = (number: string): string => {
    const visibleDigits = 4;
    const maskedPart = "*".repeat(number.length - visibleDigits);
    return maskedPart + number.slice(-visibleDigits);
  };

  // Function to verify OTP
  const verifyOtp = () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      // Simulate OTP verification (replace this with actual API call)
      console.log(`Verifying OTP: ${otp}`);
      setError(null);
    } catch (err: any) {
      setError(err.message || "OTP verification failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!sentOtp) {
      setError("Please verify your phone number before proceeding.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(email, password, name, role, phoneNumber);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <Building className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">Rental Management Portal</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create your account</p>
        </div>

        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your names"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email address"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="flex gap-2">
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                required
                disabled={sentOtp}
              />
              {!sentOtp && (
                <Button type="button" onClick={sendOtp}>
                  Send OTP
                </Button>
              )}
            </div>
            {sentOtp && (
              <p className="text-sm text-muted-foreground">
                OTP sent to {maskedPhoneNumber}
              </p>
            )}
          </div>

          {sentOtp && (
            <div className="space-y-1">
              <Label htmlFor="otp">Enter OTP</Label>
              <div className="flex gap-2">
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
                <Button type="button" onClick={verifyOtp}>
                  Verify OTP
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="agent">Agent/Caretaker</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Note: In a production environment, role selection would be restricted and verified.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
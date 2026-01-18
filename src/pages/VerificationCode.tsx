import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, ArrowLeft, Copy, Check } from "lucide-react";
import logo from "@/assets/favicon.png";

const VerificationCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyOtp, loginWithMagicLink, registerWithMagicLink, register } = useAuthStore();

  const email = (location.state as { email?: string })?.email || "";
  const isRegistration = (location.state as { isRegistration?: boolean })?.isRegistration || false;
  const pendingName = sessionStorage.getItem('pending_user_name') || "";
  const pendingPhone = sessionStorage.getItem('pending_user_phone') || "";
  const pendingPassword = sessionStorage.getItem('pending_user_password') || "";

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [copied, setCopied] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/auth");
    }
  }, [email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const result = await verifyOtp(email, code);

    if (result.success) {
      toast({
        title: "Success",
        description: isRegistration ? "Account verified successfully!" : "Login successful!",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Verification Failed",
        description: result.error || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
      setCode("");
    }
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    let result;

    if (isRegistration) {
      // Check if it's password-based registration or passwordless
      if (pendingPassword) {
        result = await register(pendingName, email, pendingPassword, pendingPhone || undefined);
      } else {
        result = await registerWithMagicLink(pendingName, email, pendingPhone || undefined);
      }
    } else {
      result = await loginWithMagicLink(email);
    }

    if (result.success) {
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
      setTimer(60);
      setCanResend(false);
      setCode("");
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to resend code",
        variant: "destructive",
      });
    }
    setIsResending(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyFromEmail = async () => {
    // This is a helper message - the actual code should be in the email
    // We'll show a toast with instructions
    toast({
      title: "Copy from Email",
      description: "Please check your email and copy the 6-digit code. You can click the code in the email to copy it, or select it manually.",
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-background p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <img src={logo} alt="Bexprot" className="w-12 h-12 rounded-xl" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bexprot</h1>
              <p className="text-sm text-muted-foreground">
                Professional Trading Platform
              </p>
            </div>
          </div>

          <div className="space-y-8 mb-12">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Verify Your <span className="text-primary">Account</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Enter the 6-digit code sent to your email to complete {isRegistration ? "registration" : "login"}
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Secure Verification
              </h3>
              <p className="text-sm text-muted-foreground">
                Your verification code expires in 10 minutes. Keep it secure and don't share it with anyone.
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>© 2024 Bexprot. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Verification Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img
              src={logo}
              alt="Bexprot"
              className="w-16 h-16 rounded-xl mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-foreground mb-2">Bexprot</h1>
            <p className="text-muted-foreground">
              Professional Trading Platform
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Enter Verification Code
              </h2>
              <p className="text-muted-foreground">
                We've sent a 6-digit code to{" "}
                <span className="text-foreground font-medium">{email}</span>
              </p>
              <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Copy className="h-3 w-3" />
                  <span>
                    Check your email and click the code to copy it, or select it manually.
                  </span>
                </p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Verification Code
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="000000"
                  className="bg-background border-border rounded-xl h-14 text-center text-2xl font-bold tracking-widest"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(value);
                  }}
                  required
                  disabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90 rounded-xl h-11 font-semibold"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="space-y-3">
                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend code in <span className="text-foreground font-medium">{formatTime(timer)}</span>
                    </p>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-xl h-11"
                      onClick={handleResend}
                      disabled={isResending}
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        "Resend Code"
                      )}
                    </Button>
                  )}
                </div>

                <p className="text-[10px] text-muted-foreground text-center">
                  Checked your spam folder? Emails can sometimes take a minute to arrive.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => navigate("/auth")}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {isRegistration ? "Registration" : "Login"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center pt-4">
              🔒 All data is stored securely on our backend
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;


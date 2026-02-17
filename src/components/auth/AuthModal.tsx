import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth/AuthProvider";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const phoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, "Use E.164 format, e.g. +254712345678."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const codeSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Enter the 6-digit verification code."),
});

type EmailValues = z.infer<typeof emailSchema>;
type PhoneValues = z.infer<typeof phoneSchema>;
type CodeValues = z.infer<typeof codeSchema>;

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithPhone, signUpWithEmail, signUpWithPhone, signInWithGoogle, verifySignupCode, resendSignupCode } =
    useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [step, setStep] = useState<"auth" | "verify">("auth");
  const [pendingVerification, setPendingVerification] = useState<{ channel: "email"; value: string } | { channel: "phone"; value: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "", password: "" },
  });

  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "", password: "" },
  });

  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (!open) {
      setMode("signin");
      setStep("auth");
      setPendingVerification(null);
      setLoading(false);
      emailForm.reset();
      phoneForm.reset();
      codeForm.reset();
    }
  }, [codeForm, emailForm, open, phoneForm]);

  const handleSuccess = () => {
    onOpenChange(false);
    navigate("/app/dashboard");
  };

  const onEmailSubmit = emailForm.handleSubmit(async (values) => {
    setLoading(true);
    try {
      if (mode === "signup") {
        const session = await signUpWithEmail(values.email, values.password);
        if (!session) {
          setPendingVerification({ channel: "email", value: values.email });
          setStep("verify");
          toast.success("Verification code sent to your email.");
          return;
        }
      } else {
        await signInWithEmail(values.email, values.password);
      }
      handleSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  });

  const onPhoneSubmit = phoneForm.handleSubmit(async (values) => {
    setLoading(true);
    try {
      if (mode === "signup") {
        const session = await signUpWithPhone(values.phone, values.password);
        if (!session) {
          setPendingVerification({ channel: "phone", value: values.phone });
          setStep("verify");
          toast.success("Verification code sent to your phone.");
          return;
        }
      } else {
        await signInWithPhone(values.phone, values.password);
      }
      handleSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  });

  const onVerifySubmit = codeForm.handleSubmit(async (values) => {
    if (!pendingVerification) {
      toast.error("Missing verification context. Start signup again.");
      setStep("auth");
      return;
    }

    setLoading(true);
    try {
      await verifySignupCode(
        pendingVerification.channel === "email"
          ? { channel: "email", email: pendingVerification.value, code: values.code }
          : { channel: "phone", phone: pendingVerification.value, code: values.code },
      );
      toast.success("Signup confirmed.");
      handleSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Code verification failed.");
    } finally {
      setLoading(false);
    }
  });

  const handleResendCode = async () => {
    if (!pendingVerification) {
      return;
    }

    setLoading(true);
    try {
      await resendSignupCode(
        pendingVerification.channel === "email"
          ? { channel: "email", email: pendingVerification.value }
          : { channel: "phone", phone: pendingVerification.value },
      );
      toast.success("Verification code resent.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {step === "verify" ? "Confirm Your Signup" : mode === "signin" ? "Sign in to GigPay" : "Create your GigPay account"}
          </DialogTitle>
          <DialogDescription>
            {step === "verify"
              ? `Enter the 6-digit code sent to ${pendingVerification?.value ?? "your inbox"}.`
              : "Use email, phone, or Google to get started."}
          </DialogDescription>
        </DialogHeader>
        {step === "verify" ? (
          <form className="space-y-4" onSubmit={onVerifySubmit}>
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input id="verificationCode" inputMode="numeric" maxLength={6} placeholder="123456" {...codeForm.register("code")} />
              {codeForm.formState.errors.code?.message ? (
                <p className="text-xs text-destructive">{codeForm.formState.errors.code.message}</p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Verifying..." : "Verify and Continue"}
              </Button>
              <Button type="button" variant="outline" className="flex-1" disabled={loading} onClick={handleResendCode}>
                Resend Code
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={loading}
              onClick={() => {
                setStep("auth");
                setPendingVerification(null);
                codeForm.reset();
              }}
            >
              Back to Sign Up
            </Button>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant={mode === "signin" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setMode("signin")}
              >
                Sign In
              </Button>
              <Button
                type="button"
                variant={mode === "signup" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => signInWithGoogle()}
            >
              Continue with Google
            </Button>

            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="phone">Phone</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>

              <TabsContent value="phone">
                <form className="space-y-4 pt-2" onSubmit={onPhoneSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+254712345678" {...phoneForm.register("phone")} />
                    {phoneForm.formState.errors.phone?.message ? (
                      <p className="text-xs text-destructive">{phoneForm.formState.errors.phone.message}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phonePassword">Password</Label>
                    <Input id="phonePassword" type="password" {...phoneForm.register("password")} />
                    {phoneForm.formState.errors.password?.message ? (
                      <p className="text-xs text-destructive">{phoneForm.formState.errors.password.message}</p>
                    ) : null}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Please wait..." : mode === "signin" ? "Sign In with Phone" : "Sign Up with Phone"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="email">
                <form className="space-y-4 pt-2" onSubmit={onEmailSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...emailForm.register("email")} />
                    {emailForm.formState.errors.email?.message ? (
                      <p className="text-xs text-destructive">{emailForm.formState.errors.email.message}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailPassword">Password</Label>
                    <Input id="emailPassword" type="password" {...emailForm.register("password")} />
                    {emailForm.formState.errors.password?.message ? (
                      <p className="text-xs text-destructive">{emailForm.formState.errors.password.message}</p>
                    ) : null}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Please wait..." : mode === "signin" ? "Sign In with Email" : "Sign Up with Email"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

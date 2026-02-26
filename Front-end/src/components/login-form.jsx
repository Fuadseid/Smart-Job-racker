import { GalleryVerticalEnd, Home } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/store/apiSlice";
import { authenticateUser } from "@/store/authReducer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  
  // RTK Query mutation hook
  const [login, { isLoading }] = useLoginMutation();

  // Set mounted to true after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear errors when user starts typing
    if (error) setError("");
    if (fieldErrors[id]) {
      setFieldErrors(prev => ({
        ...prev,
        [id]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Validate form
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Call the login mutation
      const response = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // Handle the API response structure (similar to signup)
      if (response && response.user && response.tokens) {
        // Transform the API response to match your User interface
        const userData = {
          id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          token: response.tokens.access.token,
          refreshToken: response.tokens.refresh.token,
          refreshTokenExpiration: new Date(response.tokens.refresh.expires * 1000).toISOString(),
          type: response.user.provider || "local",
          permissions: [],
          shops: null,
          warehouses: null
        };
        
        // Dispatch to Redux store
        dispatch(authenticateUser(userData));
        
        // Navigate to dashboard
        router.push("/dashboard");
      } else {
        setError("Invalid response from server");
      }
      
    } catch (err) {
      console.error("Login failed:", err);
      
      // Handle different error formats
      if (err.data) {
        // Handle validation errors
        if (err.data.errors) {
          const errors = {};
          const errorMessages = [];
          
          Object.entries(err.data.errors).forEach(([field, messages]) => {
            errors[field] = Array.isArray(messages) ? messages[0] : messages;
            errorMessages.push(Array.isArray(messages) ? messages[0] : messages);
          });
          
          setFieldErrors(errors);
          setError(errorMessages.join(", "));
        } 
        // Handle general error message
        else if (err.data.message) {
          setError(err.data.message);
        }
        // Handle string error
        else if (typeof err.data === 'string') {
          setError(err.data);
        }
      } 
      // Handle network errors
      else if (err.error) {
        setError(err.error);
      }
      // Default error
      else {
        setError("Invalid email or password");
      }
    }
  };

  // Don't render anything until after mount to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-cyan-950/20 p-8 rounded-3xl gap-6 max-w-md mx-auto w-full",
        className,
      )}
      {...props}
    >
      <form className={`w-full ${geistMono.className}`} onSubmit={handleSubmit} noValidate>
        <FieldGroup className="w-full space-y-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-9 items-center justify-center rounded-md">
                <Home className="text-white" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </Link>
            <h1 className="text-xl font-bold text-white">
              Welcome to <span className="text-[var(--buttonbg)]">SiraNet</span>
            </h1>
            <FieldDescription className="text-white/70">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
                Sign up
              </Link>
            </FieldDescription>
          </div>

          {/* Email Field */}
          <Field>
            <FieldLabel htmlFor="email" className="text-white/80">
              Email <span className="text-red-400">*</span>
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 
                focus:border-white/40 ${fieldErrors.email ? 'border-red-500' : ''}`}
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </Field>

          {/* Password Field */}
          <Field>
            <FieldLabel htmlFor="password" className="text-white/80">
              Password <span className="text-red-400">*</span>
            </FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 
                focus:border-white/40 ${fieldErrors.password ? 'border-red-500' : ''}`}
            />
            {fieldErrors.password && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </Field>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-white/60 hover:text-cyan-300 underline underline-offset-2">
              Forgot password?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-950/50 p-3 rounded border border-red-800/50">
              {error}
            </div>
          )}

          {/* Login Button */}
          <Field>
            <Button 
              className="bg-[var(--buttonbg)] hover:bg-[var(--buttonbg)]/80 cursor-pointer w-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </Field>

          <FieldSeparator className="text-white/40">Or</FieldSeparator>

          {/* Social Login */}
          <Field className="grid gap-4 w-full">
            <Button 
              variant="outline" 
              type="button" 
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      
      <FieldDescription className="px-6 text-center text-white/60 text-sm">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
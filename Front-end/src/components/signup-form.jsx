import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { authenticateUser } from "@/store/authReducer";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSignUpMutation } from "@/store/apiSlice";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function SignupForm({ className, ...props }) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  
  // RTK Query mutation hook
  const [signUp, { isLoading }] = useSignUpMutation();

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      // Call the signup mutation
      const response = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      }).unwrap();

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
      
    } catch (err) {
      console.error("Signup failed:", err);
      
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
        setError("An error occurred during signup. Please try again.");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className={`${geistMono.className} bg-cyan-950/20 text-white border-cyan-800/30`}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription className="text-white/70">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup className="space-y-4">
              {/* Name Field */}
              <Field>
                <FieldLabel htmlFor="name" className="text-white/80">
                  Full Name <span className="text-red-400">*</span>
                </FieldLabel>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  disabled={isLoading}
                  className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 
                    focus:border-white/40 ${fieldErrors.name ? 'border-red-500' : ''}`}
                />
                {fieldErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>
                )}
              </Field>
              
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
              
              {/* Password Fields */}
              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password" className="text-white/80">
                      Password <span className="text-red-400">*</span>
                    </FieldLabel>
                    <Input 
                      id="password" 
                      type="password" 
                      value={formData.password}
                      onChange={handleChange}
                      required 
                      disabled={isLoading}
                      className={`bg-white/10 border-white/20 text-white 
                        focus:border-white/40 ${fieldErrors.password ? 'border-red-500' : ''}`}
                    />
                    {fieldErrors.password && (
                      <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
                    )}
                  </Field>
                  
                  <Field>
                    <FieldLabel htmlFor="confirmPassword" className="text-white/80">
                      Confirm Password <span className="text-red-400">*</span>
                    </FieldLabel>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required 
                      disabled={isLoading}
                      className={`bg-white/10 border-white/20 text-white 
                        focus:border-white/40 ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                  </Field>
                </div>
                <FieldDescription className="text-white/60 text-sm mt-1">
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              {/* General Error Message */}
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-950/50 p-3 rounded border border-red-800/50">
                  {error}
                </div>
              )}

              {/* Submit Button */}
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
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                
                <FieldDescription className="text-center text-white/70 mt-4">
                  Already have an account?{" "}
                  <Link className="hover:text-white underline underline-offset-2" href="/login">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      
      <FieldDescription className="px-6 text-center text-white/60 text-sm">
        By clicking continue, you agree to our{" "}
        <a href="#" className="hover:text-white underline underline-offset-2">Terms of Service</a>{" "}
        and <a href="#" className="hover:text-white underline underline-offset-2">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
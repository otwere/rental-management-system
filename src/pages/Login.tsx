
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building, Github, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Check for remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      form.setValue("rememberMe", true);
    }
  }, []);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    
    try {
      await login(data.email, data.password);
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-100 dark:bg-teal-900/20 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="w-full max-w-md animate-scale-in">
        <div className="relative overflow-hidden p-8 backdrop-blur-sm bg-white/70 dark:bg-gray-900/50 rounded-2xl shadow-elevation-3 border border-gray-200 dark:border-gray-800">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="text-center mb-8">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Building className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mt-4 text-2xl font-display font-bold text-gradient">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 animate-fade-in">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-4 mb-6">
            {/* <Button 
              variant="outline" 
              className="w-full hover-scale bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
              onClick={() => handleSocialLogin("github")}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button> */}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white/70 dark:bg-gray-900/50 text-muted-foreground">
               +254 700 520 008 | +254 733 443 224
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="you@estate.com"
                          className="pl-9 h-11 bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-9 pr-9 h-11 bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm focus:border-primary focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                  )}
                />
                
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/90 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 font-medium bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-shadow"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center">
                    <span className="mr-2">Signing in</span>
                    <span className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                  </span>
                ) : (
                  <span className="flex items-center">
                    Sign in
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm mt-6">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="text-primary hover:text-primary/90 hover:underline font-medium transition-colors">
              Create an account
            </Link>
          </div>

          <div className="text-center text-xs text-muted-foreground border-t border-gray-200 dark:border-gray-800 pt-4 mt-6">
            <p className="font-medium mb-1 text-foreground/70">Demo Accounts</p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="p-2 rounded bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="font-medium text-xs">Admin</p>
                <p className="text-[11px] text-muted-foreground">admin@estate.com</p>
              </div>
              <div className="p-2 rounded bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="font-medium text-xs">Agent</p>
                <p className="text-[11px] text-muted-foreground">agent@estate.com</p>
              </div>
              <div className="p-2 rounded bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="font-medium text-xs">Tenant</p>
                <p className="text-[11px] text-muted-foreground">tenant@estate.com</p>
              </div>
            </div>
            <p className="text-[11px] mt-2">(Use any password)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

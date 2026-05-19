import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Mail, Lock, ArrowRight, Activity, Zap } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Hardcoded credentials for Hi5 Foundation
    const credentials = {
      "coach@hi5.org": { password: "coach", role: "coach", path: "/dashboard/coach" },
      "admin@hi5.org": { password: "admin", role: "admin", path: "/dashboard/coach" }
    };

    setTimeout(() => {
      setIsLoading(false);
      const user = credentials[email];

      if (user && user.password === password) {
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', email);
        navigate(user.path);
      } else {
        alert("Invalid credentials. Try: coach@hi5.org / coach");
      }
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto py-8"
    >
      
      <Card className="glass border-border/50 shadow-2xl">
        <CardHeader className="space-y-1 pb-6 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Coach Portal</CardTitle>
          <CardDescription>
            Secure GPS-verified access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="coach@hi5.org" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="••••••••" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-md shadow-lg shadow-primary/20 relative overflow-hidden group"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Activity className="h-5 w-5" />
                </motion.div>
              ) : (
                <>
                  <span className="relative z-10 flex items-center gap-2">
                    Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-primary hover:underline">
              Contact Administrator
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Login;

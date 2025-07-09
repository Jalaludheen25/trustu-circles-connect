
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Smartphone, Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignInProps {
  onSignIn: (userData: { id: string; phone?: string; email?: string }) => void;
}

const SignIn = ({ onSignIn }: SignInProps) => {
  const [activeTab, setActiveTab] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('input'); // 'input' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    const value = activeTab === 'phone' ? phone : email;
    
    if (!value) {
      toast({
        title: "Required Field",
        description: `Please enter your ${activeTab === 'phone' ? 'phone number' : 'email address'}`,
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'phone' && !/^\d{10}$/.test(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'email' && !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setStep('otp');
      setIsLoading(false);
      toast({
        title: "OTP Sent",
        description: `OTP has been sent to your ${activeTab === 'phone' ? 'phone' : 'email'}`,
      });
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    // Simulate OTP verification (in real app, this would be validated against backend)
    if (otp === '123456') {
      const userData = {
        id: Date.now().toString(),
        ...(activeTab === 'phone' ? { phone } : { email })
      };
      
      toast({
        title: "Welcome to TrustU!",
        description: "Sign in successful",
      });
      
      onSignIn(userData);
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP (use 123456 for demo)",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('input');
      setOtp('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          {step === 'otp' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="absolute left-4 top-4 p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <CardTitle className="text-2xl font-bold text-gray-800">
            {step === 'input' ? 'Sign In to TrustU' : 'Verify OTP'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'input' ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="phone" className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Phone</span>
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your 10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Enter the 6-digit OTP sent to your {activeTab === 'phone' ? 'phone' : 'email'}
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  {activeTab === 'phone' ? phone : email}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
                <p className="text-xs text-gray-500 text-center">
                  Demo: Use 123456 as OTP
                </p>
              </div>
            </div>
          )}
          
          <Button
            onClick={step === 'input' ? handleSendOTP : handleVerifyOTP}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3"
          >
            {isLoading ? 'Sending...' : step === 'input' ? 'Send OTP' : 'Verify & Sign In'}
          </Button>
          
          {step === 'otp' && (
            <Button
              variant="ghost"
              onClick={handleSendOTP}
              className="w-full text-blue-600"
            >
              Resend OTP
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;

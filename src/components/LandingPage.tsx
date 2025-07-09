
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield, Heart } from 'lucide-react';

interface LandingPageProps {
  onContinue: () => void;
}

const LandingPage = ({ onContinue }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-6">
          {/* Logo/Brand */}
          <div className="space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              TrustU
            </h1>
            <p className="text-lg text-gray-700 font-medium">
              Seek Service from Your Own
            </p>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              Find services, short stays, or sell and buy—all within your trusted circles. 
              No strangers. No spam. Just real people, real help.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                You're among our first users, and we welcome your feedback to help us grow and improve together
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="flex items-center space-x-3 text-left">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Trusted community members only</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-600">Real connections, real help</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">Services within your circles</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPage;

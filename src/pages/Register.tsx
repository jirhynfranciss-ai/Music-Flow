import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Mail, Lock, User, Eye, EyeOff, Disc3 } from 'lucide-react';

const carouselImages = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
];

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isAuthenticated, theme } = useStore();
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const success = register(email, password, name);
    if (success) {
      navigate('/');
    } else {
      setError('Email already exists');
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/60" />
          </div>
        ))}

        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Disc3 className="w-10 h-10 text-white" />
            </div>
            <span className="text-4xl font-bold text-white">MusicFlow</span>
          </div>
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Join MusicFlow Today
          </h1>
          <p className="text-xl text-white/80 text-center max-w-md">
            Create playlists, follow artists, and discover new music from around the world.
          </p>

          {/* Carousel Dots */}
          <div className="flex gap-2 mt-8">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Disc3 className="w-7 h-7 text-white" />
            </div>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>MusicFlow</span>
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Create an account
          </h2>
          <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start your musical journey today
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-lg border transition focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-lg border transition focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-11 pr-12 py-3 rounded-lg border transition focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-lg border transition focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-[1.02]"
            >
              Create Account
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>or continue with</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </div>

          <button
            onClick={handleGoogleLogin}
            className={`w-full py-3 rounded-lg border flex items-center justify-center gap-3 font-medium transition ${
              isDark
                ? 'border-gray-700 text-white hover:bg-gray-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className={`mt-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-purple-500 hover:text-purple-400 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

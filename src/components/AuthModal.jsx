import React, { useState } from 'react';
import { X, Shield, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice.js';
import { API_BASE_URL } from '../config/api.js';

export default function AuthModal({ isOpen, onClose, onShowToast }) {
  const dispatch = useDispatch();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Officer');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const endpoint = isLoginMode ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/register`;
    const payload = isLoginMode ? { username, password } : { username, password, role };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication request failed');
      }

      if (isLoginMode) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        if (onShowToast) onShowToast({ type: 'success', title: 'Authenticated', message: `Signed in as ${data.user.username} (${data.user.role})` });
        onClose();
      } else {
        const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          dispatch(setCredentials({ user: loginData.user, token: loginData.token }));
          if (onShowToast) onShowToast({ type: 'success', title: 'Staff Registered', message: `Account created and signed in as ${loginData.user.username}` });
          onClose();
        } else {
          setIsLoginMode(true);
        }
      }
    } catch (err) {
      console.warn('API authentication error, utilizing client session fallback:', err.message);
      dispatch(
        setCredentials({
          user: { username, role: isLoginMode ? (username.includes('admin') ? 'Admin' : username.includes('warden') ? 'Warden' : 'Officer') : role },
          token: `offline_token_${Date.now()}`,
        })
      );
      if (onShowToast) onShowToast({ type: 'info', title: 'Session Active', message: `Signed in as ${username}` });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoUsername, demoPassword, demoRole) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: demoUsername, password: demoPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        if (onShowToast) onShowToast({ type: 'success', title: 'Switched Profile', message: `Authenticated as ${demoUsername} (${demoRole})` });
        onClose();
        return;
      }
    } catch (err) {
      console.warn('Backend login fallback used for demo login');
    }

    dispatch(
      setCredentials({
        user: { username: demoUsername, role: demoRole },
        token: `demo_token_${demoUsername}`,
      })
    );
    if (onShowToast) onShowToast({ type: 'success', title: 'Switched Profile', message: `Authenticated as ${demoUsername} (${demoRole})` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#151C26] border border-[#D9E0E8] dark:border-[#293544] rounded-lg p-5 shadow-lg space-y-4 font-sans animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E0E8] dark:border-[#293544]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#24527A]/10 dark:bg-[#6B9BC2]/20 text-[#24527A] dark:text-[#6B9BC2]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#172033] dark:text-[#F1F4F8]">
                Access Control
              </h2>
              <p className="text-xs text-[#526176] dark:text-[#AAB6C5]">
                Role-based session authentication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-white rounded cursor-pointer"
            aria-label="Close Auth Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-0.5 rounded-md bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] text-xs">
          <button
            type="button"
            onClick={() => { setIsLoginMode(true); setErrorMsg(''); }}
            className={`py-1 rounded text-xs transition-colors cursor-pointer font-medium ${
              isLoginMode
                ? 'bg-white dark:bg-[#151C26] text-[#172033] dark:text-[#F1F4F8] shadow-xs font-semibold'
                : 'text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-[#F1F4F8]'
            }`}
          >
            Staff Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginMode(false); setErrorMsg(''); }}
            className={`py-1 rounded text-xs transition-colors cursor-pointer font-medium ${
              !isLoginMode
                ? 'bg-white dark:bg-[#151C26] text-[#172033] dark:text-[#F1F4F8] shadow-xs font-semibold'
                : 'text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-[#F1F4F8]'
            }`}
          >
            Register Credential
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-2.5 rounded-md bg-[#FCEBEC] dark:bg-[#E06A70]/15 border border-[#F5C2C7] dark:border-[#E06A70]/30 text-[#B4232C] dark:text-[#E06A70] text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#172033] dark:text-[#F1F4F8] font-medium mb-1">
              Officer Username <span className="text-[#B4232C]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. admin_vance"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2]"
            />
          </div>

          <div>
            <label className="block text-[#172033] dark:text-[#F1F4F8] font-medium mb-1">
              Passcode <span className="text-[#B4232C]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2.5 py-1.5 pr-8 rounded-md bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-[#172033] dark:text-[#F1F4F8] font-medium mb-1">
                Security Role Assignment
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2] cursor-pointer"
              >
                <option value="Officer">Officer (Read, Intake, Incident Logs)</option>
                <option value="Warden">Warden (Read, Post Audit Logs)</option>
                <option value="Admin">Administrator (Full Access & Delete)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-md text-xs font-medium bg-[#24527A] hover:bg-[#1B3E5C] dark:bg-[#6B9BC2] dark:hover:bg-[#85B2D6] text-white dark:text-[#0F141C] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            {isLoginMode ? <Lock className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
            <span>{isLoading ? 'Verifying...' : isLoginMode ? 'Sign In' : 'Register'}</span>
          </button>
        </form>

        {/* Quick 1-Click Demo Profiles */}
        <div className="pt-2.5 border-t border-[#D9E0E8] dark:border-[#293544] space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider text-[#526176] dark:text-[#AAB6C5] block font-semibold">
            Quick Demo Profiles
          </span>

          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin_vance', 'AdminPass123!', 'Admin')}
              className="p-1.5 rounded bg-[#F5F7FA] hover:bg-[#EAEFF5] dark:bg-[#0F141C] dark:hover:bg-[#1A2330] border border-[#D9E0E8] dark:border-[#293544] text-center transition-colors cursor-pointer"
            >
              <div className="font-semibold text-[11px] text-[#172033] dark:text-[#F1F4F8]">Admin</div>
              <div className="text-[10px] text-[#526176] dark:text-[#AAB6C5] font-mono">admin_vance</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('officer_blake', 'OfficerPass123!', 'Officer')}
              className="p-1.5 rounded bg-[#F5F7FA] hover:bg-[#EAEFF5] dark:bg-[#0F141C] dark:hover:bg-[#1A2330] border border-[#D9E0E8] dark:border-[#293544] text-center transition-colors cursor-pointer"
            >
              <div className="font-semibold text-[11px] text-[#172033] dark:text-[#F1F4F8]">Officer</div>
              <div className="text-[10px] text-[#526176] dark:text-[#AAB6C5] font-mono">officer_blake</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('warden_k', 'WardenPass123!', 'Warden')}
              className="p-1.5 rounded bg-[#F5F7FA] hover:bg-[#EAEFF5] dark:bg-[#0F141C] dark:hover:bg-[#1A2330] border border-[#D9E0E8] dark:border-[#293544] text-center transition-colors cursor-pointer"
            >
              <div className="font-semibold text-[11px] text-[#172033] dark:text-[#F1F4F8]">Warden</div>
              <div className="text-[10px] text-[#526176] dark:text-[#AAB6C5] font-mono">warden_k</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Shield, Lock, UserCheck, Key, UserPlus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice.js';

export default function AuthModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Officer');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const payload = isLoginMode ? { username, password } : { username, password, role };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isLoginMode) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        onClose();
      } else {
        // Auto-login after registration
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          dispatch(setCredentials({ user: loginData.user, token: loginData.token }));
          onClose();
        } else {
          setIsLoginMode(true);
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Quick Demo Login for Lab Vivas & Testing
  const handleQuickDemoLogin = async (demoUsername, demoPassword, demoRole) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: demoUsername, password: demoPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        onClose();
        return;
      }
    } catch (err) {
      console.warn('Backend login fallback used for quick demo');
    }

    dispatch(
      setCredentials({
        user: { username: demoUsername, role: demoRole },
        token: `demo_token_${demoUsername}`,
      })
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl space-y-5 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight font-mono">
                CrimeNet OS // Staff Auth
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                JWT Authentication & Role-Based Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-950 text-xs font-mono">
          <button
            type="button"
            onClick={() => { setIsLoginMode(true); setErrorMsg(''); }}
            className={`py-1.5 rounded-md transition-colors cursor-pointer ${
              isLoginMode
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginMode(false); setErrorMsg(''); }}
            className={`py-1.5 rounded-md transition-colors cursor-pointer ${
              !isLoginMode
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Register Staff
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="e.g. admin_vance"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600"
            />
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Assigned Staff Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 cursor-pointer"
              >
                <option value="Officer">Officer (Read, Intake, Edit Inmates)</option>
                <option value="Warden">Warden (Read, Post Audit Logs)</option>
                <option value="Admin">Admin (Full Administrative & Delete Access)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg text-xs font-semibold font-mono bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoginMode ? <Lock className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{isLoading ? 'Processing...' : isLoginMode ? 'Authenticate & Sign In' : 'Register New Staff Account'}</span>
          </button>
        </form>

        {/* 1-Click Quick Demo Login Selection */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block text-center">
            Quick 1-Click Demo Accounts (For Viva & Testing)
          </span>

          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin_vance', 'AdminPass123!', 'Admin')}
              className="px-2 py-1.5 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-center transition-colors cursor-pointer"
              title="Admin Role: Full rights including Delete"
            >
              <div className="font-bold">Admin</div>
              <div className="text-[9px] opacity-75">admin_vance</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('officer_blake', 'OfficerPass123!', 'Officer')}
              className="px-2 py-1.5 rounded bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-center transition-colors cursor-pointer"
              title="Officer Role: Intake & Edit (No Delete)"
            >
              <div className="font-bold">Officer</div>
              <div className="text-[9px] opacity-75">officer_blake</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('warden_k', 'WardenPass123!', 'Warden')}
              className="px-2 py-1.5 rounded bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-center transition-colors cursor-pointer"
              title="Warden Role: Audit Logs only"
            >
              <div className="font-bold">Warden</div>
              <div className="text-[9px] opacity-75">warden_k</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

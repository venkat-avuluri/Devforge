import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Ticket,
  Mail,
  KeyRound,
  User,
  Building2,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

const ParticipantOtpPage = () => {
  const { requestOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/participant/dashboard';

  // Step 1: 'enter_identifier', Step 2: 'verify_otp'
  const [step, setStep] = useState('enter_identifier');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState('');

  const [devOtpHint, setDevOtpHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide your student email address or phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await requestOtp(identifier.trim());
      if (res.success) {
        if (res.devOtp) {
          setDevOtpHint(res.devOtp);
          setOtp(res.devOtp); // Convenience auto-fill in development!
        }
        setStep('verify_otp');
      } else {
        setError(res.message || 'Failed to send OTP code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with authentication service');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await verifyOtp({
        identifier: identifier.trim(),
        otp: otp.trim(),
        name: name.trim(),
        college: college.trim(),
        phone: phone.trim(),
      });

      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'OTP verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Ticket className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Student & Attendee Login</h1>
          <p className="text-xs text-slate-500">
            Passwordless instant sign-in using a one-time verification code (OTP)
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Development Helper Banner */}
        {devOtpHint && (
          <div className="p-3.5 bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs rounded-2xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Development Mode OTP Code:</span>
              <p className="mt-0.5">
                Use code <span className="font-mono font-black text-indigo-700 text-sm tracking-wider">{devOtpHint}</span> (already auto-filled for quick testing).
              </p>
            </div>
          </div>
        )}

        {step === 'enter_identifier' ? (
          /* Step 1: Enter Email or Phone */
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. alex.student@university.edu"
                  className="w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                We'll generate a secure 6-digit OTP code to verify your identity.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Code...</span>
                </>
              ) : (
                <>
                  <span>Send OTP Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Enter OTP & Profile */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 truncate max-w-[200px]">
                Sent to: <strong className="text-slate-800">{identifier}</strong>
              </span>
              <button
                type="button"
                onClick={() => setStep('enter_identifier')}
                className="text-cyan-700 font-bold hover:underline shrink-0"
              >
                Change
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Enter 6-Digit OTP Code *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-xl text-center font-mono font-bold tracking-widest text-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Optional profile fields for first-time onboarding */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Profile Details (for your event passes)
              </span>

              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name (e.g. Alex Rivera)"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="College / University Name"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Open Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Are you an event organizer?{' '}
            <Link to="/organizer/login" className="font-bold text-indigo-600 hover:underline">
              Organizer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParticipantOtpPage;

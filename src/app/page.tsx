'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [server, setServer] = useState('Thailand');
  const [systemVersion, setSystemVersion] = useState('Android 10');
  const [cloudType, setCloudType] = useState('VIP');
  const [duration, setDuration] = useState('30 Hari');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'loading' | ''>('');

  const servers = [
    { value: 'Thailand', flag: '🇹🇭' },
    { value: 'Hongkong', flag: '🇭🇰' },
    { value: 'Hong Kong 2', flag: '🇭🇰' },
    { value: 'Singapore', flag: '🇸🇬' },
    { value: 'Taiwan', flag: '🇹🇼' },
    { value: 'United States', flag: '🇺🇸' }
  ];

  // Fungsi untuk auto-format redeem code
  const handleRedeemCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (value.length > 4 && value.length <= 8) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    } else if (value.length > 8) {
      value = value.slice(0, 4) + '-' + value.slice(4, 8) + '-' + value.slice(8, 12);
    }
    
    setRedeemCode(value);
  };

  // Validasi format redeem code
  const validateRedeemCode = (code: string): boolean => {
    const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return regex.test(code);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setMessage('Email dan password akun Redfinger harus diisi!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!redeemCode) {
      setMessage('Masukkan redeem code terlebih dahulu!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!validateRedeemCode(redeemCode)) {
      setMessage('Format kode tidak valid! Harus 12 digit (contoh: APY3-GP9Z-KVC4)');
      setMessageType('error');
      setTimeout(() => setMessage(''), 4000);
      return;
    }

    setLoading(true);
    setMessage('Sedang memproses redeem code...');
    setMessageType('loading');

    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          redeemCode,
          server,
          systemVersion,
          cloudType,
          duration
        })
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Redeem code berhasil disubmit dan sedang diproses!');
        setMessageType('success');
        setRedeemCode('');
        // Tetap loading = true, tidak di-set false
      } else {
        setMessage(data.error || 'Terjadi kesalahan');
        setMessageType('error');
        setLoading(false);
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 4000);
      }
    } catch (error) {
      setMessage('Gagal terhubung ke server');
      setMessageType('error');
      setLoading(false);
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  // Fungsi stop untuk membatalkan proses
  const handleStop = () => {
    setMessage('Proses dihentikan');
    setMessageType('error');
    setLoading(false);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 2000);
  };

  // Fungsi reset untuk sesi baru
  const handleReset = () => {
    setLoading(false);
    setMessage('');
    setMessageType('');
    setRedeemCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="max-w-md mx-auto pt-6 pb-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center backdrop-blur-md bg-white/20 rounded-3xl shadow-2xl border border-white/30 p-4">
            <img 
              src="/redfinger-logo.png" 
              alt="Redfinger Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-white text-3xl font-bold mb-1 drop-shadow-lg">Redfinger Automator</h1>
          <p className="text-white/90 text-sm font-medium">Executor</p>
        </div>

        {/* Message Alert with Animation */}
        {message && (
          <div className={`rounded-2xl p-4 mb-4 shadow-lg text-center font-semibold transform transition-all duration-300 ${
            messageType === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
            messageType === 'error' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
            messageType === 'loading' ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
            'bg-white'
          }`}>
            <div className="flex items-center justify-center gap-3">
              {messageType === 'loading' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800"></div>
              )}
              {messageType === 'success' && <span className="text-2xl">✅</span>}
              {messageType === 'error' && <span className="text-2xl">❌</span>}
              <span>{message}</span>
            </div>
          </div>
        )}

        {/* Processing Overlay */}
        {loading && (
          <div className="bg-white rounded-2xl p-6 mb-4 shadow-2xl border-4 border-blue-400 animate-pulse">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Memproses Redeem...</h3>
              <div className="flex justify-center gap-1 mb-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
              <p className="text-gray-600 text-sm">Mohon tunggu sebentar...</p>
              {redeemCode && <p className="text-gray-500 text-xs mt-2 font-mono">{redeemCode}</p>}
            </div>
          </div>
        )}

        {/* Warning Message */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 mb-4 shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-yellow-800 mb-1">Peringatan Penting!</h3>
              <p className="text-sm text-yellow-700">
                Gunakan <strong>akun khusus Redfinger</strong> saja. <strong>Jangan gunakan akun bisnis atau akun pribadi</strong> untuk keamanan data Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Login Information */}
        <div className={`bg-white rounded-2xl p-5 mb-4 shadow-lg transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <span className="mr-2">🔑</span> Login Information
          </h2>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100 text-gray-800 placeholder:text-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100 text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Redeem Code */}
        <div className={`bg-white rounded-2xl p-5 mb-4 shadow-lg transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <span className="mr-2">🎫</span> Redeem Code
          </h2>
          <input
            type="text"
            placeholder="APY3-GP9Z-KVC4"
            value={redeemCode}
            onChange={handleRedeemCodeChange}
            disabled={loading}
            maxLength={14}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100 font-mono text-lg tracking-wider text-center text-gray-800 placeholder:text-gray-400"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Format: XXXX-XXXX-XXXX (12 digit alphanumerik)
          </p>
          {redeemCode && (
            <div className="mt-2 text-center">
              {validateRedeemCode(redeemCode) ? (
                <span className="text-green-600 text-sm font-semibold">✓ Format valid</span>
              ) : (
                <span className="text-red-600 text-sm font-semibold">✗ Format belum lengkap</span>
              )}
            </div>
          )}
        </div>

        {/* Server Selection */}
        <div className={`bg-white rounded-2xl p-5 mb-4 shadow-lg transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <span className="mr-2">🌏</span> Pilih Server
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {servers.map((s) => (
              <label
                key={s.value}
                className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  server === s.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow'
                } ${loading ? 'cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="server"
                  value={s.value}
                  checked={server === s.value}
                  onChange={(e) => setServer(e.target.value)}
                  disabled={loading}
                  className="mr-2 accent-blue-500"
                />
                <span className="mr-2 text-lg">{s.flag}</span>
                <span className="text-sm font-medium text-gray-700">{s.value}</span>
              </label>
            ))}
          </div>
        </div>

        {/* System Version */}
        <div className={`bg-white rounded-2xl p-5 mb-4 shadow-lg transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <span className="mr-2">📱</span> Pilih System Version
          </h2>
          <div className="space-y-2">
            {['Android 10', 'Android 8.1', 'Android 12.0'].map((v) => (
              <label
                key={v}
                className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  systemVersion === v
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow'
                } ${loading ? 'cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="version"
                  value={v}
                  checked={systemVersion === v}
                  onChange={(e) => setSystemVersion(e.target.value)}
                  disabled={loading}
                  className="mr-3 accent-blue-500"
                />
                <span className="flex items-center font-medium text-gray-700">
                  <span className="mr-2">🤖</span> {v}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Cloud Type */}
        <div className={`bg-white rounded-2xl p-5 mb-4 shadow-lg transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <span className="mr-2">☁️</span> Jenis Cloud
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {['VIP', 'SVIP', 'KVIP', 'XVIP'].map((c) => (
              <label
                key={c}
                className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all font-bold ${
                  cloudType === c
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow text-gray-700'
                } ${loading ? 'cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="cloud"
                  value={c}
                  checked={cloudType === c}
                  onChange={(e) => setCloudType(e.target.value)}
                  disabled={loading}
                  className="mr-2 accent-blue-500"
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className={`bg-white rounded-2xl p-5 mb-6 shadow-lg transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <span className="mr-2">⏱️</span> Durasi Code Cloud
          </h2>
          <div className="flex gap-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '500ms'}}></div>
            </div>
            <div className="space-y-2 flex-1">
              {['30 Hari', '7 Hari'].map((d) => (
                <label
                  key={d}
                  className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    duration === d
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow'
                  } ${loading ? 'cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={d}
                    checked={duration === d}
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={loading}
                    className="mr-3 accent-blue-500"
                  />
                  <span className="font-medium text-gray-700">{d}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 shadow-green-500/50'
            } text-white flex items-center justify-center`}
          >
            <span className="mr-2 text-xl">🎁</span>
            {loading ? 'Sedang Memproses...' : 'Mulai Redeem'}
          </button>
          
          {loading && messageType === 'success' ? (
            <button
              onClick={handleReset}
              className="w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95 shadow-blue-500/50 text-white flex items-center justify-center"
            >
              <span className="mr-2 text-xl">🔄</span>
              Mulai Sesi Baru
            </button>
          ) : (
            <button
              onClick={handleStop}
              disabled={!loading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-200 ${
                !loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95 shadow-red-500/50 text-white'
              } flex items-center justify-center`}
            >
              <span className="mr-2 text-xl">⛔</span>
              Berhenti
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

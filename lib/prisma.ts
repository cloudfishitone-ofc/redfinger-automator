'use client';

import { useState } from 'react';

export default function Home() {
  const [redeemCode, setRedeemCode] = useState('');
  const [server, setServer] = useState('Thailand');
  const [systemVersion, setSystemVersion] = useState('Android 10');
  const [cloudType, setCloudType] = useState('VIP');
  const [duration, setDuration] = useState('30 Hari');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const servers = [
    { value: 'Thailand', flag: '🇹🇭' },
    { value: 'Hongkong', flag: '🇭🇰' },
    { value: 'Hong Kong 2', flag: '🇭🇰' },
    { value: 'Singapore', flag: '🇸🇬' },
    { value: 'Taiwan', flag: '🇹🇼' },
    { value: 'United States', flag: '🇺🇸' }
  ];

  const handleSubmit = async () => {
    if (!redeemCode) {
      setMessage('❌ Masukkan redeem code terlebih dahulu!');
      return;
    }

    setLoading(true);
    setMessage('⏳ Memproses redeem code...');

    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redeemCode,
          server,
          systemVersion,
          cloudType,
          duration
        })
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Redeem code berhasil disubmit!');
        setRedeemCode(''); // Clear form
      } else {
        setMessage('❌ ' + (data.error || 'Terjadi kesalahan'));
      }
    } catch (error) {
      setMessage('❌ Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    setMessage('⏸️ Proses dihentikan');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto pt-6 pb-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-28 h-28 bg-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl">
            <div className="text-white text-5xl">
              <div className="grid grid-cols-2 gap-1 p-3">
                <div className="w-3 h-3 bg-white rounded transform rotate-45"></div>
                <div className="w-3 h-3 bg-white rounded transform rotate-45"></div>
                <div className="w-3 h-3 bg-white rounded transform rotate-45"></div>
                <div className="w-3 h-3 bg-white rounded transform rotate-45"></div>
              </div>
            </div>
          </div>
          <h1 className="text-white text-3xl font-bold mb-1">Redfinger Automator</h1>
          <p className="text-white/90 text-sm">Executor</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg text-center font-semibold">
            {message}
          </div>
        )}

        {/* Redeem Code */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-lg">
          <h2 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <span className="mr-2">🎫</span> Redeem Code
          </h2>
          <input
            type="text"
            placeholder="Enter redeem code"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Server Selection */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-lg">
          <h2 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <span className="mr-2">🌏</span> Pilih Server
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {servers.map((s) => (
              <label
                key={s.value}
                className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  server === s.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="server"
                  value={s.value}
                  checked={server === s.value}
                  onChange={(e) => setServer(e.target.value)}
                  className="mr-2 accent-blue-500"
                />
                <span className="mr-2">{s.flag}</span>
                <span className="text-sm">{s.value}</span>
              </label>
            ))}
          </div>
        </div>

        {/* System Version */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-lg">
          <h2 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <span className="mr-2">📱</span> Pilih System Version
          </h2>
          <div className="space-y-2">
            {['Android 10', 'Android 8.1', 'Android 12.0'].map((v) => (
              <label
                key={v}
                className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  systemVersion === v
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="version"
                  value={v}
                  checked={systemVersion === v}
                  onChange={(e) => setSystemVersion(e.target.value)}
                  className="mr-3 accent-blue-500"
                />
                <span className="flex items-center">
                  <span className="mr-2">🤖</span> {v}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Cloud Type */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-lg">
          <h2 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <span className="mr-2">☁️</span> Jenis Cloud
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {['VIP', 'SVIP', 'KVIP', 'XVIP'].map((c) => (
              <label
                key={c}
                className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all font-semibold ${
                  cloudType === c
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="cloud"
                  value={c}
                  checked={cloudType === c}
                  onChange={(e) => setCloudType(e.target.value)}
                  className="mr-2 accent-blue-500"
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-lg">
          <h2 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <span className="mr-2">⏱️</span> Durasi Code Cloud
          </h2>
          <div className="flex gap-2">
            <div className="flex items-center mr-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="space-y-2 flex-1">
              {['30 Hari', '7 Hari'].map((d) => (
                <label
                  key={d}
                  className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    duration === d
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={d}
                    checked={duration === d}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mr-3 accent-blue-500"
                  />
                  {d}
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
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95'
            } text-white flex items-center justify-center`}
          >
            <span className="mr-2">🎁</span>
            {loading ? 'Memproses...' : 'Mulai Redeem'}
          </button>
          
          <button
            onClick={handleStop}
            disabled={!loading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
              !loading
                ? 'bg-gray-300 text-gray-500'
                : 'bg-gray-400 hover:bg-gray-500 active:scale-95 text-white'
            } flex items-center justify-center`}
          >
            <span className="mr-2">🔄</span>
            Berhenti
          </button>
        </div>

      </div>
    </div>
  );
}

'use client'

import { useState, useTransition } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMsg(null)
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setErrorMsg(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2dd4bf]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#fbbf24]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2dd4bf] to-[#fbbf24] flex items-center justify-center text-2xl shadow-lg mb-3">
            🎓
          </div>
          <h1 className="text-2xl font-bold font-serif text-white">EnglishEdu Platform</h1>
          <p className="text-sm text-[#8b949e] mt-1 text-center">
            Masukkan akun Anda untuk mulai belajar
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2 animate-fadeUp">
            <span>⚠</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8b949e] mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="user@example.com"
              className="w-full bg-[#21262d] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8b949e] mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="Masukkan password"
              className="w-full bg-[#21262d] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3 bg-[#2dd4bf] hover:bg-[#14b8a6] text-[#0d1117] font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              'Masuk Sekarang →'
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 pt-5 border-t border-[#30363d] text-center text-xs text-[#8b949e]">
          Akun diberikan oleh instruktur Anda.[cite: 2]<br />
          Hubungi admin jika mengalami kendala login.[cite: 2]
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useTransition } from 'react'
import { completeChapter1 } from '@/app/actions/learning'
import { useRouter } from 'next/navigation'

export default function Chapter1Action({ isCompleted }: { isCompleted: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleComplete = () => {
    startTransition(async () => {
      const res = await completeChapter1()
      if (res.success) {
        setMessage('BAB 1 Selesai! BAB 2 telah terbuka.')
        router.refresh()
      }
    })
  }

  return (
    <div className="mt-8 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] text-center space-y-4">
      <h3 className="text-lg font-bold text-[#e6edf3]">Konfirmasi Penyelesaian Modul</h3>
      <p className="text-xs text-[#8b949e] max-w-md mx-auto">
        Setelah selesai menonton gambaran materi di atas, klik tombol di bawah untuk membuka akses ke BAB 2.
      </p>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
          ✓ {message}
        </div>
      )}

      <button
        onClick={handleComplete}
        disabled={isPending || isCompleted}
        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
          isCompleted
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
            : 'bg-[#2dd4bf] hover:bg-[#14b8a6] text-[#0d1117] active:scale-95'
        }`}
      >
        {isPending ? 'Menyimpan...' : isCompleted ? '✓ BAB 1 Sudah Selesai' : 'Tandai Selesai & Buka BAB 2 →'}
      </button>
    </div>
  )
}
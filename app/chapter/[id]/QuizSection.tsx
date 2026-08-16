'use client'

import { useState, useTransition } from 'react'
import { submitChapterQuiz } from '@/app/actions/learning'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Exercise {
  id_exercise: number
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
}

export default function QuizSection({
  chapterId,
  exercises,
  highestScore,
  isCompleted,
}: {
  chapterId: number
  exercises: Exercise[]
  highestScore: number
  isCompleted: boolean
}) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [result, setResult] = useState<{
    score: number
    isPassed: boolean
    message: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSelectOption = (exerciseId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: option }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await submitChapterQuiz(chapterId, answers)
      if (res.success && res.score !== undefined && res.isPassed !== undefined) {
        setResult({
          score: res.score,
          isPassed: res.isPassed,
          message: res.message || '',
        })
        router.refresh()
      }
    })
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="mt-8 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] text-center text-xs text-[#8b949e]">
        Soal kuis untuk bab ini belum diinput ke database.
      </div>
    )
  }

  const isAllAnswered = exercises.every((ex) => answers[ex.id_exercise])
  const canProceed = result?.isPassed || isCompleted

  return (
    <div className="mt-8 p-6 lg:p-8 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#30363d] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[#e6edf3]">Evaluasi Pemahaman (Kuis)</h3>
          <p className="text-xs text-[#8b949e]">Minimal kelulusan: 70% benar (minimal 3 dari 4 soal)</p>
        </div>
        {highestScore > 0 && (
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-[#fbbf24]">
            Skor Tertinggi: {highestScore}%
          </div>
        )}
      </div>

      {result && (
        <div
          className={`p-4 rounded-xl border text-sm font-semibold animate-fadeUp ${
            result.isPassed
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {result.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {exercises.map((ex, index) => (
          <div key={ex.id_exercise} className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-3">
            <p className="text-sm font-semibold text-[#e6edf3]">
              {index + 1}. {ex.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(['a', 'b', 'c', 'd'] as const).map((optKey) => {
                const optText = ex[`option_${optKey}` as keyof Exercise]
                const isSelected = answers[ex.id_exercise] === optKey.toUpperCase()
                return (
                  <button
                    key={optKey}
                    type="button"
                    onClick={() => handleSelectOption(ex.id_exercise, optKey.toUpperCase())}
                    className={`p-3 text-left text-xs rounded-xl border transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-[#2dd4bf]/15 border-[#2dd4bf] text-[#2dd4bf] font-bold'
                        : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3]'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-[#21262d] flex items-center justify-center text-[10px] uppercase font-bold shrink-0">
                      {optKey}
                    </span>
                    <span className="leading-snug">{optText}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={!isAllAnswered || isPending}
          className="w-full py-3.5 bg-[#2dd4bf] hover:bg-[#14b8a6] text-[#0d1117] font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          {isPending ? 'Memvalidasi Jawaban...' : 'Kirim Jawaban Kuis →'}
        </button>
      </form>

      {/* Tombol Lanjut ke Bab Berikutnya (Muncul Saat Lolos) */}
      {canProceed && (
        <div className="pt-4 border-t border-[#30363d] animate-fadeUp">
          {chapterId < 5 ? (
            <Link
              href={`/chapter/${chapterId + 1}`}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#0d1117] font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/20"
            >
              <span>Lanjut Belajar ke BAB {chapterId + 1}</span>
              <span>→</span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="w-full py-3.5 bg-gradient-to-r from-[#2dd4bf] to-[#fbbf24] hover:opacity-90 text-[#0d1117] font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
            >
              <span>🏆 Selamat! Anda Menyelesaikan Seluruh Modul (Kembali ke Dashboard)</span>
              <span>→</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
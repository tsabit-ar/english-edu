import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

// Metadata 5 BAB Pembelajaran
const CHAPTER_INFO = [
  { id: 1, title: 'Overview & Dasar Pembelajaran', icon: '🔤', desc: 'Tonton video gambaran materi untuk membuka bab selanjutnya.' },
  { id: 2, title: 'Struktur Kalimat & Pola Dasar', icon: '🔵', desc: 'Materi inti & kuis pilihan ganda (minimal 70% benar).' },
  { id: 3, title: 'Kosakata Kontekstual & Frasa', icon: '🧩', desc: 'Materi pendalaman kata & kuis pemahaman.' },
  { id: 4, title: 'Listening & Analisis Percakapan', icon: '🎧', desc: 'Latihan menyimak audio & pengujian pemahaman.' },
  { id: 5, title: 'Praktek Lanjutan & Evaluasi', icon: '🏆', desc: 'Kuis komprehensif penutup seluruh modul.' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Ambil progres belajar user untuk 5 BAB
  const { data: progressData } = await supabase
    .from('user_chapter_progress')
    .select('*')
    .eq('id_user', user.id)
    .order('chapter_number', { ascending: true })

  // Mapping progres ke array agar mudah diakses
  const progressMap = new Map(progressData?.map((p) => [p.chapter_number, p]))

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Dashboard */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#30363d]">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎓</span>
              <h1 className="text-2xl lg:text-3xl font-bold font-serif">EnglishEdu Platform</h1>
            </div>
            <p className="text-sm text-[#8b949e] mt-1">
              Selamat datang, <span className="text-[#2dd4bf] font-semibold">{user.email}</span> 👋
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/resources"
              className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
            >
              <span>📦</span>
              <span>Gudang Soal & AI</span>
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-semibold rounded-xl transition-all"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        {/* Informasi Aturan Pembelajaran */}
        <div className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div className="text-xs lg:text-sm text-[#8b949e] leading-relaxed">
            <strong className="text-[#e6edf3]">Aturan Pembelajaran:</strong> Selesaikan BAB 1 dengan menonton video pengantar. 
            Mulai BAB 2 dan seterusnya, Anda wajib menyelesaikan kuis dengan nilai 
            <strong className="text-[#fbbf24]"> minimal 70% benar</strong> untuk membuka akses ke bab selanjutnya.
          </div>
        </div>

        {/* Grid 5 BAB Pembelajaran */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-[#8b949e] uppercase">
            Alur Pembelajaran (5 BAB)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CHAPTER_INFO.map((ch) => {
              const p = progressMap.get(ch.id)
              const isUnlocked = p ? p.is_unlocked : ch.id === 1
              const isCompleted = p ? p.is_completed : false
              const score = p?.quiz_highest_score ?? 0

              if (!isUnlocked) {
                // Tampilan Kartu Terkunci
                return (
                  <div
                    key={ch.id}
                    className="p-5 rounded-2xl bg-[#161b22]/50 border border-[#30363d]/50 opacity-60 flex flex-col justify-between select-none"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl grayscale">{ch.icon}</span>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                          🔒 Terkunci
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-[#8b949e]">
                        BAB {ch.id}: {ch.title}
                      </h3>
                      <p className="text-xs text-[#8b949e]/80 mt-2 leading-relaxed">{ch.desc}</p>
                    </div>
                    <div className="mt-5 text-xs text-[#8b949e] italic">
                      Selesaikan BAB {ch.id - 1} terlebih dahulu
                    </div>
                  </div>
                )
              }

              // Tampilan Kartu Terbuka / Selesai
              return (
                <Link
                  key={ch.id}
                  href={`/chapter/${ch.id}`}
                  className="group p-5 rounded-2xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] hover:border-[#2dd4bf]/50 transition-all flex flex-col justify-between shadow-lg hover:shadow-2xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {ch.icon}
                      </span>
                      {isCompleted ? (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          ✓ Selesai {ch.id > 1 ? `(${score}%)` : ''}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#2dd4bf]/10 text-[#2dd4bf] border border-[#2dd4bf]/30">
                          Buka
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-[#e6edf3] group-hover:text-[#2dd4bf] transition-colors">
                      BAB {ch.id}: {ch.title}
                    </h3>
                    <p className="text-xs text-[#8b949e] mt-2 leading-relaxed">{ch.desc}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#30363d]/50 flex items-center justify-between text-xs font-semibold text-[#2dd4bf]">
                    <span>{isCompleted ? 'Pelajari Ulang' : 'Mulai Belajar'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              )
            })}

            {/* Kartu Gudang Soal & AI NotebookLM */}
            <Link
              href="/resources"
              className="group p-5 rounded-2xl bg-gradient-to-br from-[#161b22] to-[#21262d] border border-[#fbbf24]/30 hover:border-[#fbbf24] transition-all flex flex-col justify-between shadow-lg hover:shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">📦</span>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/30">
                    Spesial
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#e6edf3] group-hover:text-[#fbbf24] transition-colors">
                  Gudang Soal & Tutorial AI
                </h3>
                <p className="text-xs text-[#8b949e] mt-2 leading-relaxed">
                  Unduh kumpulan bank soal PDF dan tonton video tutorial pembuatan kuis otomatis menggunakan NotebookLM.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#30363d]/50 flex items-center justify-between text-xs font-semibold text-[#fbbf24]">
                <span>Buka Gudang Soal</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
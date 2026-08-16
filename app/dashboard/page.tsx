import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

const CHAPTER_INFO = [
  { id: 1, title: 'Overview & Dasar Pembelajaran', icon: '🔤', desc: 'Tonton video pengantar untuk membuka akses bab materi.' },
  { id: 2, title: 'Struktur Kalimat & Pola Dasar', icon: '🔵', desc: 'Materi 2 balok wajib (Pelaku + Aksi) & kuis dasar.' },
  { id: 3, title: 'Pola S-V-O & Jurus Si Penyendiri', icon: '🧩', desc: 'Merangkai subjek-aksi-objek & aturan akhiran -s/-es.' },
  { id: 4, title: 'Seni Bertanya & Menyangkal (Do & Does)', icon: '❓', desc: 'Aturan kalimat tanya, pencuri S, dan kalimat negatif.' },
  { id: 5, title: 'Rahasia Jembatan Sakti (To Be)', icon: '🏆', desc: 'Kaidah to be (am/is/are) untuk sifat, profesi, dan lokasi.' },
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

  const progressMap = new Map(progressData?.map((p) => [p.chapter_number, p]))
  const isCh4Completed = progressMap.get(4)?.is_completed ?? false

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
  <a
    href="https://lynk.id/noahproject1/"
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2 bg-gradient-to-r from-[#2dd4bf]/20 to-[#fbbf24]/20 hover:from-[#2dd4bf]/30 hover:to-[#fbbf24]/30 border border-[#2dd4bf]/40 text-sm font-semibold rounded-xl text-[#e6edf3] transition-all flex items-center gap-2 active:scale-95 shadow-md"
  >
    <span>✨</span>
    <span>Cek Layanan Lainnya!</span>
    <span className="text-xs text-[#2dd4bf]">↗</span>
  </a>

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

        {/* Aturan Pembelajaran */}
        <div className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div className="text-xs lg:text-sm text-[#8b949e] leading-relaxed">
            <strong className="text-[#e6edf3]">Aturan Pembelajaran:</strong> Kerjakan kuis dengan skor 
            <strong className="text-[#fbbf24]"> minimal 70% benar</strong> untuk membuka bab selanjutnya. 
            Modul bonus <strong>Gudang Soal & Tutorial AI</strong> akan terbuka otomatis setelah Anda menuntaskan <strong className="text-[#2dd4bf]">BAB 4</strong>.
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

            {/* Kartu Gudang Soal & AI (Terkunci jika BAB 4 belum tuntas) */}
            {!isCh4Completed ? (
              <div className="p-5 rounded-2xl bg-[#161b22]/50 border border-[#30363d]/50 opacity-60 flex flex-col justify-between select-none">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl grayscale">📦</span>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                      🔒 Terkunci
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#8b949e]">
                    Gudang Soal & Tutorial AI
                  </h3>
                  <p className="text-xs text-[#8b949e]/80 mt-2 leading-relaxed">
                    Unduh bank soal komprehensif dan tonton tutorial peracikan kuis instan berbasis NotebookLM.
                  </p>
                </div>
                <div className="mt-5 text-xs text-[#8b949e] italic">
                  Selesaikan BAB 4 terlebih dahulu untuk membuka akses
                </div>
              </div>
            ) : (
              <Link
                href="/resources"
                className="group p-5 rounded-2xl bg-gradient-to-br from-[#161b22] to-[#21262d] border border-[#fbbf24]/50 hover:border-[#fbbf24] transition-all flex flex-col justify-between shadow-lg hover:shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">📦</span>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/30">
                      Terbuka
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#e6edf3] group-hover:text-[#fbbf24] transition-colors">
                    Gudang Soal & Tutorial AI
                  </h3>
                  <p className="text-xs text-[#8b949e] mt-2 leading-relaxed">
                    Unduh bank soal komprehensif dan tonton tutorial peracikan kuis instan berbasis NotebookLM.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#30363d]/50 flex items-center justify-between text-xs font-semibold text-[#fbbf24]">
                  <span>Buka Gudang Soal</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ResourcesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verifikasi Hak Akses: Wajib sudah menyelesaikan BAB 4
  const { data: ch4Progress } = await supabase
    .from('user_chapter_progress')
    .select('is_completed')
    .eq('id_user', user.id)
    .eq('chapter_number', 4)
    .single()

  if (!ch4Progress?.is_completed) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Top */}
        <div className="flex items-center justify-between pb-4 border-b border-[#30363d]">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-[#8b949e] hover:text-[#2dd4bf] transition-colors flex items-center gap-2"
          >
            ← Kembali ke Dashboard
          </Link>
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-[#fbbf24]">
            Modul Spesial Terbuka
          </span>
        </div>

        {/* Header Modul */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📦</span>
            <h1 className="text-2xl lg:text-3xl font-bold font-serif text-white">
              Gudang Soal & AI NotebookLM
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-[#8b949e]">
            Pusat bank soal latihan mandiri dan panduan membuat kuis otomatis menggunakan Google NotebookLM.
          </p>
        </div>

        {/* 1. Video Tutorial Pembuatan Soal via NotebookLM */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold tracking-wider text-[#fbbf24] uppercase">
            1. Tutorial Generator Kuis AI (NotebookLM)
          </h2>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#161b22] border border-[#30363d] shadow-xl">
            <iframe
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" // Ganti dengan ID video tutorial NotebookLM Anda
              title="Tutorial NotebookLM Kuis"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* 2. Prompt Template Siap Pakai untuk NotebookLM */}
        <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#2dd4bf]">
            Prompt Template NotebookLM (Copy-Paste)
          </h3>
          <p className="text-xs text-[#8b949e]">
            Unggah modul PDF materi ke NotebookLM, lalu salin prompt berikut ke kolom percakapan:
          </p>
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs font-mono text-[#e6edf3] leading-relaxed select-all">
            "Berdasarkan dokumen sumber yang saya unggah, buatkan 5 soal pilihan ganda bahasa Inggris (A, B, C, D) yang menguji pemahaman konsep tata bahasa tersebut. Cantumkan kunci jawaban dan penjelasan logis singkat di bagian akhir."
          </div>
        </div>

        {/* 3. Unduh Bank Soal Tambahan */}
        <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#fbbf24]">
            2. Unduh Bank Soal Komprehensif (PDF)
          </h3>
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <div className="text-sm font-bold text-[#e6edf3]">Bank Soal Latihan Mandiri 50+ Butir</div>
                <div className="text-xs text-[#8b949e]">Kompilasi soal grammar, structure, dan vocabulary lengkap</div>
              </div>
            </div>
            <a
              href="/materials/bank-soal-komprehensif.pdf"
              download
              className="px-4 py-2 bg-[#2dd4bf] hover:bg-[#14b8a6] text-[#0d1117] text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
            >
              Unduh PDF ⬇
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
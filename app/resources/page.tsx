import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CopyPromptButton from './CopyPromptButton'

// Contoh data bank soal PDF (bisa ditambah sesuai kebutuhan)
const QUESTION_BANKS = [
  {
    title: 'Bank Soal Komprehensif (Grammar & Structure)',
    desc: 'Kumpulan 50+ variasi soal pilihan ganda dari BAB 1 sampai BAB 4 beserta kunci jawaban.',
    fileUrl: '/materials/bank-soal-komprehensif.pdf',
    tag: 'PDF Lengkap',
  },
  {
    title: 'Cheat Sheet Pola Rumus & Kunci S-V-O',
    desc: 'Lembar contekan praktis ringkasan rumus kata kerja dasar, do/does, dan to be dalam 1 halaman.',
    fileUrl: '/materials/cheat-sheet-rumus.pdf',
    tag: 'Ringkasan Cepat',
  },
]

const NOTEBOOK_LM_PROMPT = `Berdasarkan dokumen modul pembelajaran bahasa Inggris yang saya unggah:
1. Buatkan 5 soal pilihan ganda (A, B, C, D) yang menguji pemahaman konsep dasar (bukan sekadar hafalan).
2. Fokuskan soal pada materi: Pola S-V-O, aturan Si Penyendiri (akhiran -s/-es), dan penggunaan Do/Does.
3. Cantumkan Kunci Jawaban dan Pembahasan Logis singkat di bawah setiap butir soal.`

export default async function ResourcesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Validasi Hak Akses: Wajib lulus BAB 4
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
            📦 Modul Bonus Terbuka
          </span>
        </div>

        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2dd4bf] to-[#fbbf24] flex items-center justify-center text-xl shadow-lg">
              📦
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-serif text-white">
              Gudang Soal & Tutorial AI
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-[#8b949e] leading-relaxed">
            Pusat repositori soal latihan mandiri dan instruksi praktis memanfaatkan Google NotebookLM untuk menghasilkan kuis tanpa batas langsung dari modul bacaan Anda.
          </p>
        </div>

        {/* 1. Video Tutorial Generator Soal AI */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#fbbf24] flex items-center gap-2">
              <span>🎥</span>
              <span>Tutorial Pembuatan Kuis Mandiri (NotebookLM)</span>
            </h2>
            <span className="text-xs text-[#8b949e]">Video Panduan</span>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#161b22] border border-[#30363d] shadow-xl">
            <iframe
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" // Ganti dengan ID video tutorial Anda nanti
              title="Tutorial NotebookLM"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        {/* 2. Panduan Langkah & Salin Prompt */}
        <section className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-5">
          <div className="border-b border-[#30363d] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2dd4bf]">
                Prompt Engineering untuk NotebookLM
              </h3>
            </div>
            <CopyPromptButton textToCopy={NOTEBOOK_LM_PROMPT} />
          </div>

          {/* Workflow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-1">
              <div className="text-[#2dd4bf] font-bold">Langkah 1</div>
              <div className="text-[#8b949e]">Buka situs <strong className="text-[#e6edf3]">notebooklm.google.com</strong> dan buat Notebook baru.</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-1">
              <div className="text-[#2dd4bf] font-bold">Langkah 2</div>
              <div className="text-[#8b949e]">Unggah file <strong className="text-[#e6edf3]">PDF Modul BAB</strong> yang telah Anda unduh dari web ini.</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-1">
              <div className="text-[#2dd4bf] font-bold">Langkah 3</div>
              <div className="text-[#8b949e]">Tempel prompt di bawah ke kolom chat untuk meracik kuis instan beserta penjelasannya.</div>
            </div>
          </div>

          {/* Prompt Box */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] relative">
            <div className="text-[11px] uppercase tracking-wider text-[#8b949e] font-bold mb-2">
              Teks Prompt:
            </div>
            <pre className="text-xs text-[#e6edf3] font-mono whitespace-pre-wrap leading-relaxed">
              {NOTEBOOK_LM_PROMPT}
            </pre>
          </div>
        </section>

        {/* 3. Repositori Unduh Bank Soal PDF */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#fbbf24] flex items-center gap-2">
              <span>📚</span>
              <span>Bank Soal Tambahan & Lembar Materi</span>
            </h2>
            <span className="text-xs text-[#8b949e]">Unduhan Langsung</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUESTION_BANKS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">📄</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#21262d] text-[#2dd4bf] border border-[#30363d]">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#e6edf3] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#8b949e] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <a
                  href={item.fileUrl}
                  download
                  className="w-full py-2.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#2dd4bf] hover:text-[#e6edf3] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Unduh File PDF</span>
                  <span>⬇</span>
                </a>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
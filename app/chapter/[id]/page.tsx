import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Chapter1Action from './Chapter1Action'
import QuizSection from './QuizSection'

const CHAPTER_METADATA: { [key: number]: { title: string; videoId: string; pdfUrl?: string } } = {
  1: { title: 'Overview & Dasar Pembelajaran', videoId: 'dQw4w9WgXcQ' },
  2: { title: 'Struktur Kalimat & Pola Dasar', videoId: 'dQw4w9WgXcQ', pdfUrl: '#' },
  3: { title: 'Kosakata Kontekstual & Frasa', videoId: 'dQw4w9WgXcQ', pdfUrl: '#' },
  4: { title: 'Listening & Analisis Percakapan', videoId: 'dQw4w9WgXcQ', pdfUrl: '#' },
  5: { title: 'Praktek Lanjutan & Evaluasi', videoId: 'dQw4w9WgXcQ', pdfUrl: '#' },
}

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const chapterNumber = parseInt(id, 10)

  if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 5) {
    redirect('/dashboard')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Cek izin akses bab di database
  const { data: progress } = await supabase
    .from('user_chapter_progress')
    .select('*')
    .eq('id_user', user.id)
    .eq('chapter_number', chapterNumber)
    .single()

  const isUnlocked = progress ? progress.is_unlocked : chapterNumber === 1
  if (!isUnlocked) {
    redirect('/dashboard')
  }

  // Ambil soal kuis jika BAB 2 - 5
  let exercises: any[] = []
  if (chapterNumber >= 2) {
    const { data } = await supabase
      .from('exercises')
      .select('id_exercise, question, option_a, option_b, option_c, option_d')
      .eq('id_category', chapterNumber)
      .eq('skill_type', 'quiz')

    exercises = data || []
  }

  const currentMeta = CHAPTER_METADATA[chapterNumber]

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Top */}
        <div className="flex items-center justify-between pb-4 border-b border-[#30363d]">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-[#8b949e] hover:text-[#2dd4bf] transition-colors flex items-center gap-2"
          >
            ← Kembali ke Dashboard
          </Link>
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#21262d] border border-[#30363d] text-[#2dd4bf]">
            BAB {chapterNumber} dari 5
          </span>
        </div>

        {/* Chapter Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-serif text-white">
            BAB {chapterNumber}: {currentMeta.title}
          </h1>
        </div>

        {/* Video Player Container */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#161b22] border border-[#30363d] shadow-xl">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${currentMeta.videoId}`}
            title={`Video Pembelajaran BAB ${chapterNumber}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Download PDF (Untuk BAB 2 - 5) */}
        {chapterNumber >= 2 && currentMeta.pdfUrl && (
          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <div className="text-sm font-bold text-[#e6edf3]">Modul PDF Materi BAB {chapterNumber}</div>
                <div className="text-xs text-[#8b949e]">Pelajari ringkasan materi sebelum mencoba kuis</div>
              </div>
            </div>
            <a
              href={currentMeta.pdfUrl}
              download
              className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#2dd4bf] text-xs font-bold rounded-xl transition-all"
            >
              Unduh PDF ⬇
            </a>
          </div>
        )}

        {/* Area Interaksi */}
        {chapterNumber === 1 ? (
          <Chapter1Action isCompleted={progress?.is_completed || false} />
        ) : (
          <QuizSection
            chapterId={chapterNumber}
            exercises={exercises}
            highestScore={progress?.quiz_highest_score || 0}
            isCompleted={progress?.is_completed || false}
          />
        )}

      </div>
    </div>
  )
}
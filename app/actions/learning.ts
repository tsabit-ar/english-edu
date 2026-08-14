'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Aksi Konfirmasi Selesai Nonton BAB 1
export async function completeChapter1() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, message: 'Unauthorized' }

  // Tandai BAB 1 selesai
  await supabase
    .from('user_chapter_progress')
    .update({ video_watched: true, is_completed: true })
    .eq('id_user', user.id)
    .eq('chapter_number', 1)

  // Buka gembok BAB 2
  await supabase
    .from('user_chapter_progress')
    .update({ is_unlocked: true })
    .eq('id_user', user.id)
    .eq('chapter_number', 2)

  revalidatePath('/dashboard')
  revalidatePath('/chapter/1')
  return { success: true, message: 'BAB 2 berhasil dibuka!' }
}

// 2. Aksi Submit & Kalkulasi Kuis BAB 2 - 5
export async function submitChapterQuiz(
  chapterNumber: number,
  userAnswers: { [exerciseId: number]: string }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, message: 'Unauthorized' }

  // Ambil kunci jawaban asli dari database
  const { data: exercises, error } = await supabase
    .from('exercises')
    .select('id_exercise, correct_answer')
    .eq('id_category', chapterNumber)
    .eq('skill_type', 'quiz')

  if (error || !exercises || exercises.length === 0) {
    return { success: false, message: 'Gagal memuat soal kuis.' }
  }

  const totalQuestions = exercises.length
  let correctCount = 0

  // Periksa jawaban user
  exercises.forEach((ex) => {
    const userAnswer = userAnswers[ex.id_exercise]?.trim().toLowerCase()
    const correctAnswer = ex.correct_answer.trim().toLowerCase()
    if (userAnswer && userAnswer === correctAnswer) {
      correctCount++
    }
  })

  // Hitung persentase skor
  const score = Math.round((correctCount / totalQuestions) * 100)
  const isPassed = score >= 70

  // Update skor tertinggi & status BAB saat ini
  if (isPassed) {
    await supabase
      .from('user_chapter_progress')
      .update({
        quiz_highest_score: score,
        is_completed: true,
      })
      .eq('id_user', user.id)
      .eq('chapter_number', chapterNumber)

    // Buka BAB selanjutnya jika belum di bab terakhir (maksimal BAB 5)
    if (chapterNumber < 5) {
      await supabase
        .from('user_chapter_progress')
        .update({ is_unlocked: true })
        .eq('id_user', user.id)
        .eq('chapter_number', chapterNumber + 1)
    }
  } else {
    // Jika tidak lulus, tetap catat skor tertinggi sementara
    await supabase
      .from('user_chapter_progress')
      .update({ quiz_highest_score: score })
      .eq('id_user', user.id)
      .eq('chapter_number', chapterNumber)
  }

  revalidatePath('/dashboard')
  revalidatePath(`/chapter/${chapterNumber}`)

  return {
    success: true,
    score,
    isPassed,
    correctCount,
    totalQuestions,
    message: isPassed
      ? `Selamat! Anda lulus dengan nilai ${score}%. Bab selanjutnya telah terbuka.`
      : `Nilai Anda ${score}%. Anda membutuhkan minimal 70% untuk membuka bab selanjutnya. Silakan coba lagi.`,
  }
}
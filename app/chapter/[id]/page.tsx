import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Chapter1Action from './Chapter1Action'
import QuizSection from './QuizSection'

interface VocabularyItem {
  word: string
  partOfSpeech: string // n. (noun), v. (verb), adj. (adjective), dll.
  meaning: string
  example: string
}

// Metadata 5 BAB (Lengkap dengan Ringkasan & Kosakata Penting)
const CHAPTER_METADATA: {
  [key: number]: {
    title: string
    videoId: string
    summary: string[]
    vocabulary: VocabularyItem[]
    pdfUrl?: string
  }
} = {
  1: {
    title: 'Overview & Dasar Pembelajaran',
    videoId: 'dQw4w9WgXcQ',
    summary: [
      'Pengenalan ruang lingkup materi dan capaian pembelajaran.',
      'Sistem evaluasi kuis adaptif dan syarat minimal nilai 70%.',
      'Panduan pemanfaatan modul bacaan dan fitur gudang soal.',
    ],
    vocabulary: [
      {
        word: 'Assessment',
        partOfSpeech: 'n.',
        meaning: 'Penilaian / evaluasi kemampuan',
        example: 'The final assessment determines your chapter progression.',
      },
      {
        word: 'Prerequisite',
        partOfSpeech: 'n.',
        meaning: 'Syarat mutlak / prasyarat',
        example: 'Passing Chapter 1 is a prerequisite for opening Chapter 2.',
      },
      {
        word: 'Proficiency',
        partOfSpeech: 'n.',
        meaning: 'Kemahiran / kecakapan',
        example: 'Regular practice will improve your language proficiency.',
      },
    ],
  },
  2: {
    title: 'Struktur Kalimat & Pola Dasar',
    videoId: 'z1P1TZ_tM0E',
    summary: [
      'Rumus Utama 2 Balok Wajib: Pola kalimat dasar cukup berisi Balok Siapa (Subjek) + Balok Aksi (Kata Kerja). Contoh: I eat / They go.',
      '4 Balok Pelaku Utama: "I" (wajib selalu huruf kapital), "You" (bisa 1 orang / rombongan), "They" (orang, hewan, atau benda > 1), dan "We" (gabungan I + orang lain).',
      'Balok Aksi Dasar: Kata kerja perbuatan sehari-hari seperti eat, drink, sleep, work, go, want, dan need.',
      'Balok Tambahan Kapan (Waktu): Diletakkan di paling belakang untuk memperjelas konteks (now, today, tomorrow, yesterday). Formula: Siapa + Aksi + Kapan (Contoh: I work today).',
      'Aturan Main Komunikasi: Fokus utama adalah berani menyusun balok kata agar lawan bicara paham maksud pembicaraan.',
    ],
    vocabulary: [
      {
        word: 'I',
        partOfSpeech: 'Subjek',
        meaning: 'Saya / Aku',
        example: 'Wajib selalu ditulis huruf kapital di mana pun posisinya.',
      },
      {
        word: 'You',
        partOfSpeech: 'Subjek',
        meaning: 'Kamu / Kalian',
        example: 'Berlaku fleksibel untuk 1 lawan bicara atau banyak orang.',
      },
      {
        word: 'They',
        partOfSpeech: 'Subjek',
        meaning: 'Mereka',
        example: 'Digunakan untuk orang, hewan, atau benda mati yang berjumlah > 1.',
      },
      {
        word: 'We',
        partOfSpeech: 'Subjek',
        meaning: 'Kita / Kami',
        example: 'Menunjukkan gabungan subjek "I" bersama orang lain.',
      },
      {
        word: 'Eat / Drink / Sleep',
        partOfSpeech: 'Aksi',
        meaning: 'Makan / Minum / Tidur',
        example: 'Balok perbuatan fisik dasar dalam aktivitas sehari-hari.',
      },
      {
        word: 'Work / Go',
        partOfSpeech: 'Aksi',
        meaning: 'Kerja / Pergi',
        example: 'I work today | They go tomorrow.',
      },
      {
        word: 'Want / Need',
        partOfSpeech: 'Aksi',
        meaning: 'Ingin (Mau) / Butuh',
        example: 'Want untuk keinginan biasa, Need untuk kebutuhan mendesak.',
      },
      {
        word: 'Now / Today',
        partOfSpeech: 'Waktu',
        meaning: 'Sekarang / Hari ini',
        example: 'Diletakkan di akhir kalimat: We sleep now.',
      },
      {
        word: 'Tomorrow / Yesterday',
        partOfSpeech: 'Waktu',
        meaning: 'Besok / Kemarin',
        example: 'Aksesoris waktu penjelas kejadian di masa depan atau lampau.',
      },
    ],
    pdfUrl: '/materials/modul-bab-2.pdf',
  },
  3: {
    title: 'Merangkai Kalimat S-V-O & Jurus Si Penyendiri',
    videoId: '6qYj3fgiYA4', // Ganti dengan ID YouTube BAB 3 Anda
    summary: [
      'Rumus Utama Pola Lurus S-V-O: Urutan kalimat aksi bahasa Inggris sama persis dengan bahasa Indonesia: Subjek + Verb + Objek (Contoh: I drink coffee, We need money, They eat rice).',
      'Kelompok Biasa / Rame-rame (I, You, We, They): Kata kerja tetap polos tanpa tambahan huruf akhiran (Contoh: They work, We eat, I want).',
      'Geng Si Penyendiri (He, She, It): Karena sendirian, kata kerja wajib ditambah akhiran -s atau -es (Contoh: He works, She goes, It eats, She needs water).',
      'Refleks Kalimat Kontras: Biasakan membedakan subjek secara refleks: "I want coffee, but he wants tea."',
    ],
    vocabulary: [
      {
        word: 'I / You / We / They',
        partOfSpeech: 'Subjek',
        meaning: 'Saya / Kamu / Kita / Mereka',
        example: 'Geng biasa: kata kerja tetap bentuk dasar (They eat rice).',
      },
      {
        word: 'He / She / It',
        partOfSpeech: 'Subjek',
        meaning: 'Dia (laki-laki) / Dia (perempuan) / Benda-Hewan',
        example: 'Geng penyendiri: kata kerja wajib ditambah -s / -es (He works).',
      },
      {
        word: 'Drink / Drinks',
        partOfSpeech: 'Kata Kerja',
        meaning: 'Minum',
        example: 'I drink coffee vs He drinks tea.',
      },
      {
        word: 'Eat / Eats',
        partOfSpeech: 'Kata Kerja',
        meaning: 'Makan',
        example: 'They eat rice vs She eats bread.',
      },
      {
        word: 'Need / Needs',
        partOfSpeech: 'Kata Kerja',
        meaning: 'Butuh (Kebutuhan)',
        example: 'We need money vs He needs water.',
      },
      {
        word: 'Want / Wants',
        partOfSpeech: 'Kata Kerja',
        meaning: 'Ingin / Mau',
        example: 'You want coffee vs She wants water.',
      },
      {
        word: 'Work / Works',
        partOfSpeech: 'Kata Kerja',
        meaning: 'Bekerja',
        example: 'They work today vs He works today.',
      },
      {
        word: 'Go / Goes',
        partOfSpeech: 'Kata Kerja',
        meaning: 'Pergi',
        example: 'We go now vs She goes now.',
      },
      {
        word: 'Coffee / Tea / Water',
        partOfSpeech: 'Objek',
        meaning: 'Kopi / Teh / Air',
        example: 'Objek minuman sehari-hari.',
      },
      {
        word: 'Rice / Money',
        partOfSpeech: 'Objek',
        meaning: 'Nasi / Uang',
        example: 'Objek makanan dan kebutuhan.',
      },
    ],
    pdfUrl: '/materials/modul-bab-3.pdf',
  },
  4: {
    title: 'Seni Bertanya & Menyangkal (Do & Does)',
    videoId: 'z0KFseiQrCU', // Ganti dengan ID video YouTube BAB 4 Anda nanti
    summary: [
      'Pasangan Kunci Tanya: "Do" untuk geng ramai (I, You, We, They) dan "Does" untuk geng penyendiri (He, She, It). Rumus: Do/Does + Subjek + Kata Kerja Polos?',
      'Aturan Si Pencuri S: Saat "Does" masuk ke kalimat tanya, akhiran -s pada kata kerja hilang dicuri dan kembali ke bentuk dasar polos (Contoh: "Does she work here?", bukan "works").',
      'Cara Menyangkal (Kalimat Negatif): Tambahkan "not" setelah kata bantu -> Don\'t (Do not) untuk geng ramai, Doesn\'t (Does not) untuk geng penyendiri.',
      'Hukum 1 Huruf S: Dalam satu kalimat subjek penyendiri, huruf -s hanya boleh ada pada kata "Does/Doesn\'t". Dilarang dobel -s pada kata kerja (Contoh: "He doesn\'t like spicy food").',
    ],
    vocabulary: [
      {
        word: 'Do / Does',
        partOfSpeech: 'Kata Bantu',
        meaning: 'Apakah (Pembuka kalimat tanya)',
        example: 'Do you speak English? | Does she work here?',
      },
      {
        word: "Don't / Doesn't",
        partOfSpeech: 'Negatif',
        meaning: 'Tidak / Bukan (Penyangkalan)',
        example: "I don't know | He doesn't like spicy food.",
      },
      {
        word: 'Speak / Know',
        partOfSpeech: 'Kata Kerja',
        meaning: 'Berbicara (Bahasa) / Tahu (Mengerti)',
        example: "Do they speak English? | I don't know.",
      },
      {
        word: 'Like / Sleep',
        partOfSpeech: 'Kata Kerja',
        meaning: 'Suka (Gemar) / Tidur',
        example: "She doesn't like tea | Do they sleep early?",
      },
      {
        word: 'Here / All day',
        partOfSpeech: 'Keterangan',
        meaning: 'Di sini (Tempat) / Sepanjang hari (Waktu)',
        example: "Does he work here? | We sleep all day.",
      },
      {
        word: 'Spicy food',
        partOfSpeech: 'Objek',
        meaning: 'Makanan pedas',
        example: "He doesn't eat spicy food.",
      },
    ],
    pdfUrl: '/materials/modul-bab-4.pdf',
  },
  5: {
    title: 'Rahasia Jembatan Sakti (To Be)',
    videoId: 'aZQKNmu7Bfc', // Ganti dengan ID YouTube BAB 5 Anda
    summary: [
      'Rumus Utama Jembatan Sakti: Subjek (Pelaku) + To Be (am/is/are) + Deskripsi (Sifat / Profesi / Lokasi).',
      'Aturan Emas: Jika ada aksi fisik (eat, work) JANGAN pakai to be ("I work today"). Jika tidak ada aksi fisik WAJIB pakai to be ("I am happy today").',
      'Pasangan Abadi Subjek & To Be: I -> am | You, They, We -> are | He, She, It -> is.',
      '3 Momen Wajib Pakai To Be: Menjelaskan Perasaan/Sifat (Adjective), Menjelaskan Profesi/Benda (Noun), dan Menjelaskan Lokasi/Tempat (Location).',
    ],
    vocabulary: [
      {
        word: 'am / is / are',
        partOfSpeech: 'To Be',
        meaning: 'Adalah / berada / status subjek',
        example: 'am (pasangan I), is (He/She/It), are (You/They/We).',
      },
      {
        word: 'Happy / Sad',
        partOfSpeech: 'Sifat',
        meaning: 'Bahagia (Senang) / Sedih',
        example: 'I am happy today | She is sad.',
      },
      {
        word: 'Hungry / Tired',
        partOfSpeech: 'Sifat',
        meaning: 'Lapar / Lelah (Capek)',
        example: 'We are hungry | He is tired after work.',
      },
      {
        word: 'Doctor / Teacher / Pilot',
        partOfSpeech: 'Profesi',
        meaning: 'Dokter / Guru / Pilot',
        example: 'He is a doctor | She is a teacher | They are pilots.',
      },
      {
        word: 'At the office / At home',
        partOfSpeech: 'Lokasi',
        meaning: 'Di kantor / Di rumah',
        example: 'They are at the office | I am at home.',
      },
      {
        word: 'In the park / On the table',
        partOfSpeech: 'Lokasi',
        meaning: 'Di taman / Di atas meja',
        example: 'We are in the park | It is on the table.',
      },
    ],
    pdfUrl: '/materials/modul-bab-5.pdf',
  },
}

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const chapterNumber = parseInt(id, 10)

  if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 5) {
    redirect('/dashboard')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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

        {/* 1. Video Player */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#161b22] border border-[#30363d] shadow-xl">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${currentMeta.videoId}`}
            title={`Video Pembelajaran BAB ${chapterNumber}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* 2. Ringkasan Video */}
        <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#2dd4bf]">
              Poin Penting & Ringkasan Video
            </h3>
          </div>
          <ul className="space-y-2 text-xs lg:text-sm text-[#8b949e]">
            {currentMeta.summary.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className="text-[#2dd4bf] font-bold mt-0.5">•</span>
                <span className="leading-relaxed text-[#e6edf3]">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Kosakata Penting (Key Vocabulary) */}
        {currentMeta.vocabulary && currentMeta.vocabulary.length > 0 && (
          <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#30363d] pb-3">
              <span className="text-lg">📖</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#fbbf24]">
                Kosakata Kunci & Frasa Penting
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentMeta.vocabulary.map((v, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#2dd4bf] tracking-wide">
                      {v.word}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                      {v.partOfSpeech}
                    </span>
                  </div>
                  <div className="text-xs text-[#e6edf3] font-medium">{v.meaning}</div>
                  <div className="text-[11px] text-[#8b949e] italic leading-relaxed pt-1 border-t border-[#21262d]">
                    "{v.example}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Download PDF Modul */}
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
              className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#2dd4bf] text-xs font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              Unduh PDF ⬇
            </a>
          </div>
        )}

        {/* 5. Area Evaluasi */}
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
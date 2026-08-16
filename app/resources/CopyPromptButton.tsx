'use client'

import { useState } from 'react'

export default function CopyPromptButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Gagal menyalin:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="px-3.5 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-xs font-semibold text-[#2dd4bf] rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
    >
      <span>{copied ? '✓ Berhasil Disalin!' : '📋 Salin Prompt'}</span>
    </button>
  )
}
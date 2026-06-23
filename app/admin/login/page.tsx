'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push(redirect)
        router.refresh()
      } else {
        setError('รหัสผ่านไม่ถูกต้อง')
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-black tracking-tighter">
            GIORNO<span className="text-[#FF5722]">PARTS</span>
          </h1>
          <p className="text-[#9CA3AF] mt-2">Admin Panel</p>
        </div>

        <div className="bg-[#161622] rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-semibold mb-6">เข้าสู่ระบบผู้ดูแล</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-[#B0B8C8]">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF5722]"
                placeholder="กรอกรหัสผ่าน"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-400">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF5722] hover:bg-[#FF7043] text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <p className="text-xs text-[#9CA3AF] mt-6 text-center">
            สำหรับการพัฒนาเท่านั้น
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

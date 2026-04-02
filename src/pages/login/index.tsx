import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-[400px] bg-card rounded-card border border-border p-8">
        <div className="text-center mb-6">
          <div className="inline-block bg-primary-light text-primary text-[10px] font-bold px-2 py-[2px] rounded-badge tracking-[0.3px] mb-2">
            AI 청구 관리
          </div>
          <h1 className="text-[18px] font-bold text-txt">APT Insurance Admin</h1>
          <p className="text-[12px] text-secondary mt-1">손해사정사 어드민 로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-secondary mb-1">이메일</label>
            <input
              type="email"
              className="w-full border border-border rounded-input px-3 py-2 text-[13px] outline-none focus:border-primary focus:shadow-ring-primary transition-all"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-secondary mb-1">비밀번호</label>
            <input
              type="password"
              className="w-full border border-border rounded-input px-3 py-2 text-[13px] outline-none focus:border-primary focus:shadow-ring-primary transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-btn text-[13px] font-semibold hover:bg-primary-hover transition-all cursor-pointer"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/contexts/SidebarContext';

const routeLabels: Record<string, { label: string; sub?: string }> = {
  '/': { label: '대시보드', sub: '2026년 3월' },
  '/claims': { label: '청구 목록', sub: '전체 247건' },
  '/type-a': { label: 'TYPE A 상세', sub: 'CLM-2026-0246' },
  '/type-b': { label: 'TYPE B 상세', sub: 'CLM-2026-0245' },
  '/type-c': { label: 'TYPE C 적산', sub: 'CLM-2026-0247' },
  '/estimation': { label: '수량 내역서', sub: 'CLM-2026-0247' },
  '/approve': { label: '손해사정사 승인', sub: 'CLM-2026-0247' },
  '/opinion': { label: '법률 의견서' },
};

const HamburgerIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function Topbar() {
  const location = useLocation();
  const route = routeLabels[location.pathname] ?? { label: '대시보드' };
  const { toggle, isMobile } = useSidebar();

  return (
    <div className="bg-card border-b border-border px-6 h-topbar flex items-center justify-between shrink-0 sticky top-0 z-40">
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {isMobile && (
          <button
            onClick={toggle}
            className="text-secondary hover:text-txt p-1 -ml-1 rounded-lg hover:bg-border-light transition-all shrink-0"
            aria-label="메뉴 열기"
          >
            <HamburgerIcon />
          </button>
        )}
        <div className="text-[13px] text-secondary flex items-center gap-[5px] min-w-0">
          <span className="text-txt font-semibold truncate">{route.label}</span>
          {route.sub && (
            <>
              <span className="text-border hidden sm:inline">›</span>
              <span className="hidden sm:inline truncate">{route.sub}</span>
            </>
          )}
        </div>
      </div>
      {/* User */}
      <div className="flex items-center gap-[10px] shrink-0">
        <span className="text-[12px] text-secondary hidden sm:block">김지수 손해사정사</span>
        <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center text-white text-[10px] font-bold">
          김
        </div>
      </div>
    </div>
  );
}

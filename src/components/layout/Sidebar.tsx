import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useSidebar } from '@/contexts/SidebarContext';

interface NavItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  isSub?: boolean;
  end?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

function NavItem({ to, label, icon, isSub, end, collapsed, onClick }: NavItemProps) {
  if (collapsed) {
    return (
      <NavLink
        to={to}
        end={end}
        title={label}
        onClick={onClick}
        className={({ isActive }) =>
          clsx(
            'flex items-center justify-center w-10 h-10 mx-auto rounded-lg my-[2px] transition-all',
            isActive
              ? 'bg-primary-light text-primary'
              : 'text-secondary hover:bg-border-light hover:text-txt',
          )
        }
      >
        {icon}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-[9px] py-2 px-4 text-[13px] font-medium cursor-pointer transition-all text-secondary border-l-2 border-transparent my-[1px]',
          isSub && 'pl-7 text-[12px]',
          isActive
            ? 'bg-primary-light text-primary border-l-primary font-semibold [&_svg]:opacity-100'
            : 'hover:bg-border-light hover:text-txt [&_svg]:opacity-70',
        )
      }
    >
      {icon}
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

/* Icons */
const DashboardIcon = () => (
  <svg className="w-[15px] h-[15px] shrink-0" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const ClaimsIcon = () => (
  <svg className="w-[15px] h-[15px] shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.6" />
    <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const EstimationIcon = () => (
  <svg className="w-[15px] h-[15px] shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M9 7h6M9 11h6M9 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const ApproveIcon = () => (
  <svg className="w-[15px] h-[15px] shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const OpinionIcon = () => (
  <svg className="w-[15px] h-[15px] shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M14 2v6h6M16 13H8M16 17H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const LogoIcon = () => (
  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.8" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
  </svg>
);

function SidebarContent({
  collapsed,
  onClose,
}: {
  collapsed: boolean;
  onClose?: () => void;
}) {
  const { toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={clsx(
          'border-b border-border',
          collapsed ? 'py-[20px] px-[10px] flex flex-col items-center gap-1' : 'pt-[20px] px-[20px] pb-[16px]',
        )}
      >
        {collapsed ? (
          <LogoIcon />
        ) : (
          <>
            <div className="inline-block bg-primary-light text-primary text-[10px] font-bold px-2 py-[2px] rounded-badge tracking-[0.3px] mb-[6px]">
              AI 청구 관리
            </div>
            <div className="text-[13px] font-bold text-txt leading-[1.5] tracking-[-0.2px]">
              APT Insurance
            </div>
            <div className="text-[10px] text-secondary mt-[3px]">apt-insurance.ai</div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className={clsx('py-2 flex-1 overflow-y-auto', collapsed && 'px-1')}>
        {!collapsed && (
          <div className="text-[10px] font-semibold text-secondary px-4 pt-2 pb-1 uppercase tracking-[0.6px]">
            Overview
          </div>
        )}
        <NavItem to="/" label="대시보드" icon={<DashboardIcon />} end collapsed={collapsed} onClick={onClose} />

        {!collapsed && (
          <div className="text-[10px] font-semibold text-secondary px-4 pt-2 pb-1 uppercase tracking-[0.6px]">
            청구 관리
          </div>
        )}
        {collapsed && <div className="my-1 border-t border-border mx-2" />}
        <NavItem to="/claims" label="청구 목록" icon={<ClaimsIcon />} collapsed={collapsed} onClick={onClose} />
        {!collapsed && (
          <>
            <NavItem to="/type-a" label="TYPE A — 하자소송 이관" isSub onClick={onClose} />
            <NavItem to="/type-b" label="TYPE B — 면책" isSub onClick={onClose} />
            <NavItem to="/type-c" label="TYPE C — 지급" isSub onClick={onClose} />
          </>
        )}
        <NavItem to="/estimation" label="적산 결과 검토" icon={<EstimationIcon />} collapsed={collapsed} onClick={onClose} />
        <NavItem to="/approve" label="손해사정사 승인" icon={<ApproveIcon />} collapsed={collapsed} onClick={onClose} />
        <NavItem to="/opinion" label="법률 의견서" icon={<OpinionIcon />} collapsed={collapsed} onClick={onClose} />
      </div>

      {/* Footer / Toggle */}
      <div className={clsx('border-t border-border', collapsed ? 'py-2 flex flex-col items-center' : 'py-[14px] px-[16px] flex items-center justify-between')}>
        {!collapsed && (
          <span className="text-[11px] text-secondary">APT Insurance</span>
        )}
        <button
          onClick={handleToggle}
          title={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary hover:bg-border-light hover:text-txt transition-all"
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { open, setOpen, isMobile, isTablet } = useSidebar();

  // Mobile: overlay drawer
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />
        )}
        {/* Drawer */}
        <aside
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '240px',
            zIndex: 50,
            transform: open ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
            background: 'var(--color-card)',
            borderRight: '1px solid var(--color-border)',
          }}
        >
          <SidebarContent collapsed={false} onClose={() => setOpen(false)} />
        </aside>
      </>
    );
  }

  // Tablet: collapsed (icon-only, 64px)
  if (isTablet) {
    return (
      <aside
        style={{
          width: open ? '220px' : '64px',
          transition: 'width 0.25s ease',
          flexShrink: 0,
          background: 'var(--color-card)',
          borderRight: '1px solid var(--color-border)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <SidebarContent collapsed={!open} />
      </aside>
    );
  }

  // Desktop: full sidebar, collapsible
  return (
    <aside
      style={{
        width: open ? '220px' : '64px',
        transition: 'width 0.25s ease',
        flexShrink: 0,
        background: 'var(--color-card)',
        borderRight: '1px solid var(--color-border)',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <SidebarContent collapsed={!open} />
    </aside>
  );
}

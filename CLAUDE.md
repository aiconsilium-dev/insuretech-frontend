# CLAUDE.md — insuretech-admin-test 개발 가이드

## 프로젝트 개요
보험사/손해사정사 어드민 — AI 청구 관리 데스크톱 웹
- 데모: https://juh-oh.github.io/insuretech-admin-test/

## 기술 스택
| 역할 | 기술 |
|------|------|
| UI 프레임워크 | React 19 |
| 언어 | TypeScript 5 (strict) |
| 번들러 | Vite 8 |
| 라우팅 | React Router DOM v7 (HashRouter) |
| 서버 상태 | TanStack React Query v5 |
| 클라이언트 상태 | Zustand v5 |
| HTTP 클라이언트 | fetch 래퍼 (apiFetch) |
| 스타일링 | Tailwind CSS v4 (@tailwindcss/vite) |
| 아이콘 | Lucide React |
| 조건부 클래스 | clsx |
| API 모킹 | MSW (Mock Service Worker) v2 |
| 패키지 매니저 | pnpm |
| 배포 | GitHub Pages (gh-pages) |

## 환경 변수
- `VITE_API_BASE_URL` — API 서버 주소
- `VITE_USE_MOCK=true` — MSW 모킹 활성화
- `.env.example` 파일 참고, `.env.local`은 `.gitignore`에 포함

## 개발 명령어
```bash
pnpm dev          # 개발 서버 (--host 모드)
pnpm build        # 타입체크 후 프로덕션 빌드
pnpm lint         # ESLint
pnpm preview      # 빌드 결과 미리보기
```

## 폴더 구조 (FSD)
```
src/
├── App.tsx / main.tsx / index.css
├── pages/              ← 페이지별 FSD 구조
│   ├── login/
│   ├── dashboard/      (overview/KPIGrid, RecentClaimsTable, NotificationList)
│   ├── claims/         (claim-table/ClaimRow, FilterBar, DetailPanel)
│   ├── type-a/         (defect-list/DefectCard)
│   ├── type-b/         (denial-list/DenialCard)
│   ├── type-c/         (estimation-detail/EstimationTable, InsuranceCalc)
│   ├── field-check/    (check-list/CheckCard, ReportView)
│   ├── estimation/     (pricing/PricingTable)
│   ├── approve/        (approval-list/ApprovalCard)
│   └── opinion/        (opinion-list/OpinionCard, AppealCard)
├── components/         ← 공통 컴포넌트
│   ├── layout/         (Layout, Sidebar, Topbar)
│   └── common/         (Badge, Button, DataTable, KPICard, StatusPill, ...)
├── hooks/              ← 커스텀 훅
├── stores/             ← Zustand 스토어 (authStore, uiStore)
├── types/              ← 도메인 타입 정의
├── lib/                ← 유틸·API
│   ├── types.ts        (타입 re-export)
│   ├── queryClient.ts / queryKeys.ts
│   └── api/            (client.ts + 도메인별 API 함수)
├── config/             ← 설정 (routes, env)
├── contexts/           ← React Context (SidebarContext)
├── data/               ← 목업 데이터 (mockData.ts)
└── mocks/              ← MSW 설정
    ├── browser.ts
    ├── handlers/       (auth, claims, fieldChecks, estimations, approvals, opinions)
    └── data/           (claims, users, estimations, apartments)
```

## 코딩 규칙

### TypeScript
- `strict: true`, `any` 금지
- `@/*` 경로 별칭 필수

### API
- `apiFetch` 래퍼 사용 (`lib/api/client.ts`), 직접 `fetch` / `axios` 금지
- 에러는 API 레이어에서 `throw`, 훅에서 `catch`

### 상태 관리
- API 응답 → React Query (`useQuery` / `useMutation`)
- 인증 → Zustand (`stores/authStore.ts`)
- UI 상태 → Zustand (`stores/uiStore.ts`)
- 폼 → `useState`
- 쿼리키 → `lib/queryKeys.ts` 팩토리 함수 사용

### 컴포넌트
- `React.FC<Props>` 또는 typed function props
- `clsx`로 조건부 클래스
- `lucide-react` named import (아이콘)
- 공통 컴포넌트는 `components/common/index.ts`에서 re-export

### 스타일
- Tailwind CSS 전용, 인라인 `style` 최소화
- 데스크톱 레이아웃: Sidebar + Topbar + Main
- Tailwind CSS v4: 설정파일 없이 `@tailwindcss/vite` 플러그인

### 라우팅
- **HashRouter 사용** (GitHub Pages), BrowserRouter 금지
- auth 가드 필요 시 라우터 레벨에서 처리

### 인증
- `access_token` 쿠키, `refresh_token` HTTP-Only
- `tryRefresh()` 로직 포함
- `auth:logout` 이벤트로 글로벌 로그아웃

### MSW
- `VITE_USE_MOCK=true` 시 활성화
- `handlers/` + `data/` 분리
- `public/mockServiceWorker.js` 수동 편집 금지

### Git
- `.env.local` 등 민감정보 커밋 금지

## 주의사항
- React 19 전용 API 사용 가능
- HashRouter 사용 (GitHub Pages), BrowserRouter 금지
- Tailwind CSS v4: 설정파일 없이 @tailwindcss/vite 플러그인

## 구현 전 체크리스트
1. **영향 범위 파악**: query/state 소비하는 컴포넌트·훅 나열
2. **React Strict Mode**: useEffect cleanup 작성
3. **refetch 범위**: invalidateQueries 의도한 쿼리만
4. **TYPE 분류 일관성**: TYPE_MAP, AMOUNT_MAP, DAMAGE_LABELS 세 곳 모두 갱신
5. **타입 정확성**: 라이브러리 옵션 타입 확인

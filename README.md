# InsureTech Admin — 보험사/손해사정사 어드민

> AI 기반 아파트 보험 청구 관리 데스크톱 웹 애플리케이션

## 🚀 데모
**[https://juh-oh.github.io/insuretech-admin-test/](https://juh-oh.github.io/insuretech-admin-test/)**

## 📋 기술 스택

| 역할 | 기술 |
|------|------|
| UI 프레임워크 | React 19 |
| 언어 | TypeScript 5 (strict) |
| 번들러 | Vite 8 |
| 라우팅 | React Router DOM v7 (HashRouter) |
| 서버 상태 | TanStack React Query v5 |
| 클라이언트 상태 | Zustand v5 |
| HTTP 클라이언트 | fetch 래퍼 (apiFetch) |
| 스타일링 | Tailwind CSS v4 |
| 아이콘 | Lucide React |
| API 모킹 | MSW v2 |
| 패키지 매니저 | pnpm |

## 📂 폴더 구조 (FSD)

```
src/
├── pages/              # 페이지별 Feature-Sliced Design
│   ├── login/
│   ├── dashboard/      (overview)
│   ├── claims/         (claim-table)
│   ├── type-a/         (defect-list)
│   ├── type-b/         (denial-list)
│   ├── type-c/         (estimation-detail)
│   ├── field-check/    (check-list)
│   ├── estimation/     (pricing)
│   ├── approve/        (approval-list)
│   └── opinion/        (opinion-list)
├── components/         # 공통 컴포넌트
├── hooks/              # 커스텀 훅
├── stores/             # Zustand 스토어
├── types/              # 도메인 타입
├── lib/                # API 클라이언트, 쿼리키, 타입
├── config/             # 설정
├── contexts/           # React Context
└── mocks/              # MSW 핸들러 + 목업 데이터
```

## 🛠 개발

```bash
# 의존성 설치
pnpm install

# 개발 서버
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview
```

## 📄 환경 변수

`.env.example` 참고:
```env
VITE_API_BASE_URL=https://api.example.com
VITE_USE_MOCK=true
```

## 📖 개발 가이드

자세한 코딩 규칙은 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

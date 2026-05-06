# 차량 예약 시스템

**React / TypeScript** 기반의 사내 법인 차량 예약 관리 시스템 프론트엔드입니다.

담당자의 수동 배정 없이 직원이 직접 예약·조회·취소할 수 있도록 하여 **반복 업무를 줄이고** 차량 **사용 편의성을 높이기** 위해 개발했습니다.

> 관련 프로젝트: [차량 예약 시스템 REST API (car-booking-api)](https://github.com/durudumba/car-booking-api)

## 개발 기간

2024.09 ~ 2024.12

## 기술 스택

| 분류 | 기술 |
|---|---|
| Language | TypeScript 5.5 |
| Framework | React 18 |
| Build Tool | Vite 5 |
| 라우팅 | React Router DOM v6 |
| UI | FullCalendar 6, TUI Grid 4, react-modal, react-toastify |
| HTTP | Axios |
| 인증 | react-cookie (JWT 쿠키 관리) |

## 주요 기능

### 인증
- JWT 토큰 기반 로그인 / 로그아웃
- 인증 상태에 따른 라우트 보호 (`LoginOutlet`)
- 메뉴별 접근 권한 검증 (`AccessAuthValid`) — 관리자/일반 사용자 구분

### 차량 예약
- 예약 신청 시점 기준으로 **사용 가능한 차량만** 필터링하여 목록 제공
- 주 단위 차량 예약 일정표 조회 (FullCalendar)
- 예약 신청 / 수정 (모달)
- 취소 대신 **미운행 처리** 방식으로 운행 일정 보존

### 운행 및 주차 관리
- 주차 위치 등록 기능으로 운행 완료 여부 판단
- 주차 위치 미등록 시 **다음 사용자에게 알림** 제공 및 이전 사용자 정보 표시
- 운행 기록 등록 및 상세 조회 (모달)

### 관리자 기능
- 전체 예약 현황 / 운행 기록 / 주차 미등록 예약 조회
- 차량 정보(번호, 차종, 연료 등) 등록 / 수정 / 삭제 (TUI Grid)
- 사용자 목록 조회 및 권한·사용 제한 관리

## 페이지 구성

```
/login          로그인
/carBooking     차량 예약 (캘린더)
/carSchedule    운행 스케줄 조회
/drivingInfo    운행 정보
/carManage      차량 관리 (관리자)
/userManage     사용자 관리 (관리자)
/drivingManage  운행 기록 관리 (관리자)
```

## 프로젝트 구조

```
src/
├── components/
│   ├── Login.tsx
│   ├── CarBooking.tsx       # 예약 캘린더
│   ├── CarSchedule.tsx      # 스케줄 조회
│   ├── DrivingInfo.tsx      # 운행 정보
│   ├── CarManage.tsx        # 차량 관리
│   ├── UserManage.tsx       # 사용자 관리
│   ├── DrivingManage.tsx    # 운행 기록 관리
│   ├── Header.tsx
│   └── LoginOutlet.tsx      # 인증 라우트 가드
├── modals/
│   ├── BookingModal.tsx     # 예약 신청/수정
│   ├── CarInfoModal.tsx     # 차량 정보
│   ├── DrivingDetailModal.tsx
│   ├── DrivingRecordModal.tsx
│   ├── SingUpModal.tsx
│   └── UserInfoModal.tsx
└── utils/
    ├── AccessAuthValid.tsx  # 메뉴 접근 권한 검증
    └── useEnterBtnClick.tsx
```

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
```

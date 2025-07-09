# THE NOOK ☕

**모바일 카페 주문 시스템** - QR 코드 기반 무인 주문 서비스

---

## 📖 프로젝트 소개

THE NOOK은 모바일 환경에 최적화된 카페 주문 시스템입니다. 고객은 QR 코드를 스캔하여 간편하게 주문할 수 있고, 카페 운영자는 웹 기반 관리자 페이지에서 메뉴, 주문, 매출을 효율적으로 관리할 수 있습니다.

### ✨ 핵심 가치
- **간편한 주문**: QR 코드 스캔 → 메뉴 선택 → 주문 완료
- **효율적인 관리**: 통합 관리자 대시보드로 모든 운영 데이터 관리
- **실시간 동기화**: 주문과 매출 데이터의 실시간 업데이트
- **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험

---

## 🚀 주요 기능

### 👥 고객용 주문 사이트 (`index.html`)
- **브랜드 커스터마이징**: 로고와 소제목 표시
- **카테고리 탭**: 직관적인 메뉴 분류 시스템
- **메뉴 선택**: 이미지, 설명, 가격 정보와 함께 메뉴 표시
- **온도 선택**: HOT/ICE 옵션 선택
- **수량 조절**: +/- 버튼으로 수량 선택
- **ADD 버튼**: 선택한 메뉴를 장바구니에 추가
- **주문 확인**: 주문 내역 확인 및 최종 주문
- **실시간 알림**: 토스트 메시지로 사용자 피드백

### 🔧 관리자용 관리 사이트 (`admin.html`)
#### 브랜드 설정
- **로고 업로드**: 이미지 파일 업로드 및 미리보기
- **소제목 편집**: 브랜드 메시지 커스터마이징

#### 카테고리 관리
- **카테고리 추가/수정/삭제**: 메뉴 분류 체계 관리
- **ID 기반 관리**: 영문 ID로 체계적인 분류

#### 메뉴 관리
- **메뉴 추가/수정/삭제**: 완전한 메뉴 라이프사이클 관리
- **이미지 업로드**: 메뉴 사진 첨부
- **카테고리 필터링**: 카테고리별 메뉴 관리
- **가격 관리**: 숫자 전용 입력으로 정확한 가격 설정

#### 주문 관리
- **실시간 주문 모니터링**: 새로운 주문 실시간 확인
- **주문 상태 관리**: 대기중/완료 상태 변경
- **주문 삭제**: 잘못된 주문 제거
- **주문 내역 상세보기**: 메뉴, 수량, 온도, 금액 정보

#### 📊 매출 관리 (NEW!)
- **매출 통계 대시보드**:
  - 오늘 매출
  - 이달 매출
  - 전체 매출
  - 총 주문 수
- **일일 매출 분석**: 날짜별 매출과 평균 주문 금액
- **월별 매출 분석**: 월별 매출 트렌드
- **메뉴별 판매량**: 인기 메뉴 순위와 매출 기여도

---

## 🛠 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 반응형 디자인
- **Vanilla JavaScript**: ES6+ 문법 활용
- **Google Fonts**: 한국어 웹폰트 (Noto Sans KR, Dancing Script)

### Data Management
- **localStorage**: 클라이언트 사이드 데이터 저장
- **JSON**: 구조화된 데이터 형식
- **Base64**: 이미지 인코딩

### Design Pattern
- **Module Pattern**: 기능별 모듈화
- **Observer Pattern**: 데이터 변경 감지
- **Factory Pattern**: 동적 UI 생성

---

## 📁 파일 구조

```
THE-NOOK/
├── index.html              # 고객용 주문 페이지
├── admin.html              # 관리자용 관리 페이지
├── css/
│   ├── common.css          # 공통 스타일 (모달, 토스트 등)
│   ├── customer.css        # 고객 페이지 전용 스타일
│   └── admin.css           # 관리자 페이지 전용 스타일
├── js/
│   ├── common.js           # 데이터 관리, 유틸리티 함수
│   ├── customer.js         # 고객 페이지 기능
│   └── admin.js            # 관리자 페이지 기능
├── images/
│   └── logo.png            # 기본 로고 이미지
└── README.md               # 프로젝트 문서
```

---

## 🚀 설치 및 실행

### 1. 프로젝트 다운로드
```bash
# Git 클론 (Git 사용 시)
git clone [repository-url]
cd THE-NOOK

# 또는 ZIP 파일 다운로드 후 압축 해제
```

### 2. 웹 서버 실행
```bash
# Python 3 사용 (추천)
python -m http.server 8000

# Python 2 사용
python -m SimpleHTTPServer 8000

# Node.js 사용
npx http-server

# PHP 사용
php -S localhost:8000
```

### 3. 브라우저 접속
- **고객 페이지**: `http://localhost:8000/index.html`
- **관리자 페이지**: `http://localhost:8000/admin.html`

### 4. 관리자 로그인
- **비밀번호**: `admin123` (기본값)
- 관리자 페이지 우측 하단 ⚙️ 버튼 클릭

---

## 📱 사용 방법

### 고객 주문 과정
1. **QR 코드 스캔** → 고객 페이지 접속
2. **카테고리 선택** → 원하는 메뉴 카테고리 탭 클릭
3. **메뉴 선택** → 메뉴 카드에서 정보 확인
4. **온도 선택** → HOT 또는 ICE 버튼 클릭
5. **수량 조절** → +/- 버튼으로 수량 선택
6. **장바구니 추가** → ADD 버튼 클릭
7. **주문 확인** → 하단 주문 버튼 클릭
8. **최종 주문** → 주문 확인 후 제출

### 관리자 관리 과정
1. **로그인** → 관리자 비밀번호 입력
2. **브랜드 설정** → 로고, 소제목 업데이트
3. **카테고리 관리** → 메뉴 분류 추가/수정
4. **메뉴 관리** → 신메뉴 등록, 기존 메뉴 수정
5. **주문 관리** → 실시간 주문 확인 및 처리
6. **매출 분석** → 일일/월별/메뉴별 매출 데이터 확인

---

## 🎨 주요 특징

### 🎯 사용자 경험 (UX)
- **직관적인 인터페이스**: 최소한의 클릭으로 주문 완료
- **즉시 피드백**: 모든 액션에 대한 실시간 반응
- **에러 방지**: 필수 선택 사항 가이드 및 검증
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

### 📱 반응형 디자인
- **모바일 퍼스트**: 모바일 환경 우선 설계
- **적응형 레이아웃**: 화면 크기별 최적화
- **터치 친화적**: 충분한 터치 영역과 제스처 지원
- **고해상도 지원**: Retina 디스플레이 최적화

### 🔄 실시간 동기화
- **즉시 반영**: 관리자 변경사항 실시간 적용
- **자동 새로고침**: 30초마다 데이터 업데이트
- **충돌 방지**: 동시 접근 시 데이터 무결성 보장

### 💾 데이터 관리
- **오프라인 지원**: localStorage 기반 로컬 저장
- **데이터 백업**: 브라우저 개발자 도구에서 내보내기 가능
- **초기 데이터**: 샘플 메뉴와 카테고리 자동 생성

---

## 🌐 브라우저 호환성

| 브라우저 | 최소 버전 | 상태 |
|---------|----------|------|
| Chrome | 60+ | ✅ 완전 지원 |
| Firefox | 55+ | ✅ 완전 지원 |
| Safari | 12+ | ✅ 완전 지원 |
| Edge | 79+ | ✅ 완전 지원 |
| IE | 11 | ⚠️ 부분 지원 |

### 모바일 브라우저
- **iOS Safari** 12+
- **Chrome Mobile** 60+
- **Samsung Internet** 8+
- **Firefox Mobile** 55+

---

## 🔧 커스터마이징

### CSS 변수 수정
```css
/* css/customer.css, css/admin.css */
:root {
  --primary-color: #000000;    /* 기본 색상 */
  --accent-color: #f5f5f5;     /* 강조 색상 */
  --border-radius: 12px;       /* 모서리 둥글기 */
  --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 그림자 */
}
```

### 기본 데이터 수정
```javascript
// js/common.js - initializeData() 함수
const defaultData = {
  branding: {
    logoUrl: 'your-logo.png',
    subtitle: 'your custom subtitle'
  },
  categories: [
    // 기본 카테고리 수정
  ],
  menuItems: [
    // 기본 메뉴 수정
  ]
};
```

### 관리자 비밀번호 변경
```javascript
// js/customer.js - checkAdminPassword() 함수
const correctPassword = 'your-new-password';
```

---

## 🚨 문제 해결

### 데이터가 저장되지 않아요
- **원인**: localStorage 비활성화 또는 용량 부족
- **해결**: 브라우저 설정에서 localStorage 허용, 캐시 정리

### 이미지가 표시되지 않아요
- **원인**: 이미지 파일 크기 또는 형식 문제
- **해결**: JPG, PNG 형식으로 5MB 이하 파일 사용

### 모바일에서 레이아웃이 깨져요
- **원인**: 뷰포트 설정 누락
- **해결**: HTML 헤드에 viewport 메타태그 확인

### 주문이 관리자 페이지에 표시되지 않아요
- **원인**: localStorage 동기화 문제
- **해결**: 브라우저 새로고침 또는 하드 리프레시 (Ctrl+F5)

---

## 🔮 향후 계획

### 단기 계획 (1-2주)
- [ ] PWA (Progressive Web App) 지원
- [ ] 오프라인 모드 강화
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 프린터 연동 (영수증 출력)

### 중기 계획 (1-2개월)
- [ ] 결제 시스템 연동
- [ ] 회원가입/로그인 시스템
- [ ] 쿠폰 및 할인 기능
- [ ] 재고 관리 시스템

### 장기 계획 (3-6개월)
- [ ] 백엔드 API 서버 구축
- [ ] 데이터베이스 연동
- [ ] 멀티 스토어 지원
- [ ] 고급 분석 대시보드

---

## 📄 라이센스

```
MIT License

Copyright (c) 2024 THE NOOK

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 개발자 정보

**프로젝트**: THE NOOK Mobile Cafe Ordering System  
**개발기간**: 2024  
**기술지원**: Vanilla JavaScript, Modern CSS  

### 기여하기
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 지원 및 문의

- **이슈 리포트**: GitHub Issues 페이지 이용
- **기능 요청**: Discussions 페이지 이용
- **보안 문제**: 이메일로 직접 연락

---

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**

---

*마지막 업데이트: 2024년* 
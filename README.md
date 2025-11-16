# 관심 기업 관리 프로젝트

## 프로젝트 소개
이 프로젝트는 **관심 기업을 관리**할 수 있는 웹 애플리케이션입니다.  
사용자는 기업을 검색하고, 관심 기업으로 등록하며, 메모를 추가하고 수정할 수 있습니다.  
관심 기업 목록은 선택 삭제 및 상세 조회 기능도 제공합니다.

## 사용 기술
- **Frontend**: `Next.js(app router)`, `TypeScript`
- **State Management**: `Zustand`
- **Data Fetching**: `TanStack Query`, `Axios`
- **UI & Styling**: `TailwindCSS`, `Lucide React`

## 주요 기능
1. **관심 기업 등록**
   - 관심기업 생성에서 기업 검색
   - 중복 등록 방지 (이미 등록된 회사는 alert 표시)
   - 메모 작성 후 저장
   - 저장 버튼은 오른쪽 하단 고정
   <img width="861" height="822" alt="image" src="https://github.com/user-attachments/assets/c5b8de92-d9d5-4be8-b3cd-1c20bac59cc2" />

2. **관심 기업 목록**
   - 등록된 기업 목록 테이블
   - 개별/여러 개 선택 삭제
   - 삭제 전 확인 모달 제공
     
    <img width="861" height="438" alt="image" src="https://github.com/user-attachments/assets/9f4954d9-eeff-457b-aaeb-c5eff8488cd9" />

3. **기업 상세 조회**
   - 모달로 기업 이름 및 메모 확인
   - 메모 수정 기능 제공
   - 수정 취소/저장 버튼은 오른쪽 하단에 위치
  <img width="861" height="442" alt="image" src="https://github.com/user-attachments/assets/bd95101e-83c9-4d64-b9bd-994344ea13f4" />

     
4. **UI/UX**
   - 모달 외부 클릭 시 닫기
   - X 버튼 제거, 깔끔한 UI
   - 버튼 및 텍스트 정렬, TailwindCSS로 스타일링
   - 수정하기 버튼 왼쪽에 연필 아이콘

## 선택 과제
- 선택 과제는 기본 틀만 구현하였으며, company code 데이터 양이 많아 실제 요청은 구현하지 못했습니다.
- company code가 있으면 요청이 가능하도록 구조는 마련해 두었습니다.

  <img width="861" height="822" alt="image" src="https://github.com/user-attachments/assets/4bb96ed2-7f5f-4cd9-beef-e01d5ef82b83" />


## AI 활용 경험
- ChatGPT를 활용하여:
  - Axios 요청 에러(400) 원인 분석 및 처리 방법 확인
  - TailwindCSS 스타일링 문제 해결
  - 모달, textarea, 버튼 UI 구조 설계 및 코드 개선
  - 중복 체크 로직, 페이지네이션 로직 구현 아이디어 확인
- 활용 경험을 통해 코딩 속도 및 안정성을 높였습니다.

## 설치 및 실행 방법
1. 레포지토리 클론 후 프로젝트 폴더 이동
- cd company-insight
   
2. 의존성 설치
- npm install

3. 환경변수 설정
- company-insight 폴더 안에 .env.local 생성
- 메일로 전달받은 환경변수 내용을 붙여넣고 저장

4. 개발 서버 실행
- npm run dev

5. 브라우저에서 http://localhost:3000 접속

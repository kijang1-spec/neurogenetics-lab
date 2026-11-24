# 배포 안내 — Neurogenetics Lab 웹사이트

이 폴더는 **그대로 업로드하면 동작하는 정적 사이트**입니다. 빌드 단계 없음, 서버 코드 없음.

```
neurogenetics-lab/
  index.html            홈
  Research.html         연구
  People.html           구성원
  Publications.html     논문
  News.html             소식
  Gallery.html          갤러리
  Contact.html          연락처
  assets/
    fonts.css           웹폰트 (@font-face) — Google Fonts 대체
    fonts/              Newsreader · Archivo · Noto Serif KR (woff2, 6종)
    site.css            디자인 토큰 + 헤더/푸터 셸
    pages.css           페이지 컴포넌트
    gallery.css         갤러리 그리드 + 라이트박스
    site.js             헤더/푸터 주입, KO/EN 전환, 배경 삽화
    pubs.js             논문 데이터
    image_slot.js       드래그 이미지 슬롯 (에디터 전용)
    art/                배경 삽화 (WebP)
    gallery/            실사 사진 (JPEG)
    research/           워크플로 그림
    recruit/            모집 포스터 (WebP)
    portrait.jpg        PI 프로필 사진
  README-배포안내.md    이 문서
```

---

## 1. 가장 빠른 공개 — Netlify Drop (2분)

1. 이 폴더를 **zip으로 압축**
2. <https://app.netlify.com/drop> 접속
3. zip을 브라우저 창에 **끌어다 놓기**
4. 발급된 URL 확인 → 끝

`index.html`이 자동으로 첫 페이지가 됩니다. 커스텀 도메인은 Site settings → Domain management.

---

## 2. 권장 — GitHub Pages (계속 수정할 경우)

```bash
cd neurogenetics-lab
git init
git add .
git commit -m "Neurogenetics Lab website"
git branch -M main
git remote add origin https://github.com/<계정>/<저장소>.git
git push -u origin main
```

GitHub 웹에서:

```
Settings → Pages → Source: Deploy from a branch
Branch: main / (root) → Save
```

1–2분 후 `https://<계정>.github.io/<저장소>/` 접속 가능.

**GitHub Pages를 권하는 이유**: 이 사이트는 계속 고칠 것이고(논문·소식 추가), git 이력이 있으면 되돌리기와 변경 추적이 됩니다. Netlify Drop은 덮어쓰기라 이력이 남지 않습니다.

---

## 3. 배포본에 반영된 차이 — 원본 프로젝트와 다른 점

배포본은 **방문자용으로 조정**되어 있습니다. 다음 세 가지가 원본과 다릅니다.

| 항목 | 원본(편집용) | 배포본 | 이유 |
|---|---|---|---|
| **Tweaks 패널** | 우측 하단에 표시 | **표시되지 않음** | 방문자가 색·서체·배경을 바꾸는 건 일반 사이트에서 어색함 |
| **저장된 설정** | localStorage 값 적용 | **무시하고 기본값 사용** | 작성자가 테스트로 바꾼 값이 방문자에게 보이면 안 됨 |
| **웹폰트** | Google Fonts CDN | **로컬 woff2** | 외부 요청 제거, 오프라인·차단 환경에서도 동일하게 표시 |
| **이미지 형식** | 원본 PNG | **JPEG/WebP로 변환** | 전송량 약 20MB → 약 2.4MB. 육안 차이 없음 |

이 조정은 `assets/site.js`의 `window.__PUBLIC_BUILD` 플래그 하나로 동작합니다. 각 HTML의 `site.js` 앞에 `<script>window.__PUBLIC_BUILD = true;</script>` 한 줄이 있습니다. **편집용으로 되돌리려면 이 줄만 지우면** Tweaks 패널이 다시 나타납니다.

---

## 4. 배포 후 동작하지 않는 기능

| 기능 | 이유 |
|---|---|
| 갤러리·구성원 사진 **드래그 채우기** | `<image-slot>`은 편집 환경 전용. 배포본은 읽기 전용 |
| Tweaks 패널 | 위 3번 참조 (의도적 제외) |

나머지는 전부 동작합니다 — 페이지 이동, KO/EN 전환, 갤러리 라이트박스(←→/Esc), 논문 필터, 배경 삽화.

---

## 5. 배포 전 확인된 상태

| 항목 | 결과 |
|---|---|
| 페이지 | 7쪽 전부, 내부 링크 6개 정상 |
| 깨진 자산 참조 | **0건** (참조 21개 전부 존재) |
| 미사용 자산 | **0건** (참조되지 않는 파일 제거) |
| 콘솔 에러 | **0건** (index, People 검증) |
| 외부 요청 | **0건** (Google Fonts 제거 후) |
| 개인 이력서 | **미포함** (`source/` 폴더는 배포본에서 제외) |
| 편집기 사이드카 | `*.srcmap.json` 7개가 함께 포함됨 — **무해하며 삭제해도 사이트 동작에 영향 없음** (플랫폼이 자동 생성·삭제를 막음) |
| 작업용 파일 | `screenshots/`, `source/` **미포함** |
| 전체 크기 | **약 2.5MB** (사진 21장 + 폰트 4종, 이미지 압축 후). 편집기 사이드카 포함 시 약 2.9MB |

---

## 6. 나중에 내용을 고칠 때

| 고치고 싶은 것 | 파일 | 위치 |
|---|---|---|
| 구성원 이름·직책 | `People.html` | `.roster-row` 안 `<span class="rn-name">` / `<span class="rn-note">` |
| 논문 추가 | `assets/pubs.js` | 배열에 `{y:연도, t:'제목', a:'저자', j:'저널', d:'DOI URL', …}` 한 건 추가 |
| 소식 추가 | `News.html` | `<article class="news-row reveal">` 블록 복제 후 내용 교체 |
| 갤러리 사진 | `assets/gallery/` | 파일 넣고 `Gallery.html`의 `src` 경로 수정 |
| 모집 문구 | `People.html` | `#openings` 섹션 |
| 연락처 | `Contact.html` + `assets/site.js` 푸터 문자열 | 두 곳 모두 |
| 이메일 주소 | `People.html`, `Contact.html` 하단 스크립트 | `var u='kijang1', d='kbri.re.kr'` |

**사진은 반드시 `src="assets/..."`로 고정해야 합니다.** 드래그로 넣은 이미지는 브라우저에만 저장되어 배포본에 포함되지 않습니다.

사진을 추가할 때는 원본 PNG보다 **JPEG(품질 84 내외)로 변환해 넣는 편이 좋습니다.** 현재 배포본이 그렇게 되어 있고, 그래야 페이지 로딩이 1초 안쪽으로 유지됩니다.

---

## 7. 남은 작업

> 주소(URL)는 저장소 이름에 따라 자동으로 정해집니다. 저장소를 `neurogenetics-lab`으로 만들면 모든 메타 태그에 이미 박혀 있는 주소가 그대로 맞습니다. 다르게 만들 경우 8절을 참고해 일괄 교체하십시오.

| # | 항목 | 필요한 것 |
|---|---|---|
| 1 | 저장소 생성·push·Pages 활성화 | 선생님 계정 (README 2절) |
| 2 | 도메인 연결 여부 | 무료 주소로 먼저 공개하는 편 권장 |
| 3 | 갤러리 사진 게시 동의 확인 | 유지 결정됨 — 동의 확인만 남음 |

---

## 8. 주소(URL)를 바꾸려면

지금 모든 메타 태그는 **`https://kijang1.github.io/neurogenetics-lab/`** 를 기준으로 작성되어 있습니다. 저장소 이름이 다르거나 Netlify로 올리면 이 주소가 틀어집니다.

| 항목 | 위치 | 고칠 값 |
|---|---|---|
| OG·canonical | 7개 HTML `<head>` | 3곳의 `https://kijang1.github.io/neurogenetics-lab/...` |
| sitemap | `sitemap.xml` | 7개 `<loc>` |
| robots | `robots.txt` | `Sitemap:` 한 줄 |

주소만 알려주시면 일괄 교체해 드립니다. 손으로 고칠 경우 편집기에서 **모두 바꾸기**로 `https://kijang1.github.io/neurogenetics-lab/` 를 치환하면 됩니다.

> GitHub Pages 주소는 저장소 이름을 따라갑니다. 저장소를 `neurogenetics-lab` 으로 만들면 위 주소가 그대로 맞습니다.

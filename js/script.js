/* =========================================================
   01 HERO — CONNECTOR 애니메이션 (자동 반복)
   heroPlay(): 반복 재생 시작 / heroStop(): 멈춤
   ========================================================= */
(function () {
  var hero = document.querySelector('.hero');
  if (!hero) return;

  var caption = document.getElementById('heroCaption');
  var center  = document.getElementById('heroCenter');

  var CAPTIONS = {
    '-1': '',
    '0': 'PLAN → DESIGN → PUBLISH → DEV',
    '1': 'CONNECTING…',
    '2': 'CONNECTING…',
    '3': 'ONE FLOW'
  };

  var TIMELINE = [
    { phase: 0, at: 120 },    // 직무 등장 + 순서선
    { phase: 1, at: 1700 },   // 중앙으로 연결 (파란색)
    { phase: 2, at: 3200 },   // 직무가 중앙으로 모임
    { phase: 3, at: 4100 }    // CONNECTOR 완성
  ];

  var HOLD = 6000;   // ★ 완성 화면을 보여주는 시간 (ms) → 이후 처음부터 다시 재생
  var timers = [];

  function setPhase(phase) {
    hero.dataset.phase = phase;
    if (caption) caption.textContent = CAPTIONS[phase];
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function play() {
    clearTimers();
    hero.classList.remove('is-hover');
    setPhase(-1);
    TIMELINE.forEach(function (t) {
      timers.push(setTimeout(function () { setPhase(t.phase); }, t.at));
    });

    // 완성(4.1초) + HOLD(6초) 뒤 다시 처음부터 → 약 10초마다 반복
    var last = TIMELINE[TIMELINE.length - 1].at;
    timers.push(setTimeout(play, last + HOLD));
  }

  // 완성 후 CONNECTOR에 마우스를 올리면 선이 다시 파랗게
  if (center) {
    center.addEventListener('mouseenter', function () {
      if (hero.dataset.phase === '3') hero.classList.add('is-hover');
    });
    center.addEventListener('mouseleave', function () {
      hero.classList.remove('is-hover');
    });
  }

  // fullPage에서 부를 함수
  window.heroPlay = function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { clearTimers(); setPhase(3); return; }
    play();
  };
  window.heroStop = function () {
    clearTimers();   // 다른 페이지에 있는 동안은 반복 멈춤
  };
})();


/* =========================================================
   03 MY JOURNEY — 순차 등장 애니메이션 (처음 한 번만)
   ========================================================= */
(function () {
  var section = document.querySelector('.journey');
  if (!section) return;

  var steps    = section.querySelectorAll('.journey__step');
  var progress = document.getElementById('journeyProgress');

  var START = 300;   // 첫 단계가 나오기까지 (ms)
  var GAP   = 550;   // 단계 사이 간격 (ms)
  var played = false;   // ★ 이미 재생했는지 기억

  function showAll() {
    steps.forEach(function (s) { s.classList.add('is-show'); });
    progress.style.height = '100%';
    section.classList.add('is-done');
  }

  function play() {
    steps.forEach(function (step, i) {
      setTimeout(function () {
        steps.forEach(function (s) { s.classList.remove('is-current'); });
        step.classList.add('is-show', 'is-current');                    // 등장 + 블루
        progress.style.height = ((i + 1) / steps.length * 100) + '%';   // 선 늘리기
      }, START + i * GAP);
    });

    setTimeout(function () {
      steps.forEach(function (s) { s.classList.remove('is-current'); });
      section.classList.add('is-done');
    }, START + steps.length * GAP + 400);
  }

  window.journeyPlay = function () {
    if (played) return;   // ★ 두 번째 방문부터는 아무것도 안 함 (완성 화면 그대로)
    played = true;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    reduce ? showAll() : play();
  };
})();

/* =========================================================
   04 WORKS — CASE STUDY 팝업 열기 / 닫기 / 이전·다음
   ========================================================= */
(function () {
  var openers = document.querySelectorAll('[data-modal]');
  var modals  = document.querySelectorAll('dialog.case');
  if (!modals.length) return;

  // 팝업이 열려 있는 동안 fullPage(휠·방향키로 섹션 넘김) 멈추기
  function lockPage(lock) {
    document.body.classList.toggle('is-modal-open', lock);
    if (window.fullpage_api) {
      fullpage_api.setAllowScrolling(!lock);
      fullpage_api.setKeyboardScrolling(!lock);
    }
  }

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.showModal();
    modal.scrollTop = 0;          // 항상 맨 위부터
    lockPage(true);
  }

  // ① 카드 클릭 → 팝업 열기
  openers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.dataset.modal);
    });
  });

  modals.forEach(function (modal) {
    // ② X 버튼 → 닫기
    modal.querySelector('.case__close').addEventListener('click', function () {
      modal.close();
    });

    // ③ 바깥(어두운 배경) 클릭 → 닫기
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.close();
    });

    // ④ 이전 / 다음 프로젝트로 바로 이동
    modal.querySelectorAll('[data-goto]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        modal.close();
        openModal(btn.dataset.goto);
      });
    });

    // ⑤ 닫힐 때(ESC 포함): 열린 팝업이 하나도 없으면 페이지 다시 움직이기
    modal.addEventListener('close', function () {
      if (!document.querySelector('dialog.case[open]')) lockPage(false);
    });
  });
})();
/* =========================================================
   05 CONTACT (엔딩) — 노드 연결 애니메이션 (처음 한 번만)
   ========================================================= */
(function () {
  var section = document.querySelector('.ending');
  if (!section) return;

  var played = false;

  // fullPage에서 부를 함수
  window.endingPlay = function () {
    if (played) return;          // 두 번째 방문부터는 완성 상태 그대로
    played = true;
    section.classList.add('is-play');   // CSS 애니메이션 시작
  };
})();
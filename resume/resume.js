/* =========================================================
   온라인 이력서 — 섹션 펼치기 / 접기
   처음엔 모두 펼친 상태 → 버튼을 누르면 접힘
   ========================================================= */
document.querySelectorAll('.toggle-btn').forEach(function (btn) {
  var section   = btn.closest('section');
  var container = document.getElementById(btn.dataset.container);
  var label     = btn.querySelector('.hidden');
  if (!section || !container) return;

  // 스크린리더용: 버튼이 어떤 영역을 열고 닫는지 연결
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-controls', container.id);
  btn.setAttribute('aria-expanded', 'true');

  btn.addEventListener('click', function (e) {
    e.preventDefault();                                   // href="#" 이동 막기
    var closed = section.classList.toggle('is-closed');
    btn.setAttribute('aria-expanded', String(!closed));
    if (label) label.textContent = closed ? '펼쳐보기' : '접기';
  });
});
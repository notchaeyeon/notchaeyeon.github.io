// =====================================================
// Studying 블로그 데이터 — 새 글은 위쪽에 추가하세요.
// 필드: date / title / summary / tags / minutes / status / source / body(HTML)
// =====================================================
window.STUDYING_POSTS = [
  {
    date: "2026.04.22",
    title: "강화학습(Reinforcement Learning) 개요",
    summary: "에이전트가 시행착오를 거치며 최대 보상을 학습하는 알고리즘. 구성요소·MDP·할인인수·탐색-활용 트레이드오프·분류 방식까지 핵심 개념을 한 번에 정리.",
    tags: ["AI", "강화학습", "ML", "Note"],
    minutes: 10,
    status: "published",
    source: "https://blog.naver.com/noisy_duck/224261529664",
    body: `
<section class="rb-section">
  <h3 class="rb-heading">강화학습이란?</h3>
  <p class="rb-def">에이전트가 시행착오를 거치며 가장 큰 보상(Reward)을 얻기 위해 스스로 최적의 행동 방식을 학습하는 알고리즘</p>
</section>

<section class="rb-section">
  <h3 class="rb-heading">구성요소</h3>
  <ul class="rb-list">
    <li><strong>에이전트 (Agent)</strong> — 학습과 결정을 수행하는 주체. 목표: 누적 보상의 합을 최대화하는 정책 학습</li>
    <li><strong>환경 (Environment)</strong> — 에이전트가 상호작용하는 외부 시스템. 행동을 받아 → 새로운 상태 + 보상 반환</li>
    <li><strong>상태 (State, S)</strong> — 현재 환경의 정보</li>
    <li><strong>행동 (Action, A)</strong> — 에이전트가 취할 수 있는 선택</li>
    <li><strong>보상 (Reward, R)</strong> — 행동 결과에 따른 피드백</li>
    <li><strong>정책 (Policy, π)</strong> — 상태에 따라 행동을 선택하는 전략</li>
    <li><strong>가치 함수 (Value Function, V)</strong> — 현재 상태에서 기대되는 누적 보상의 합</li>
  </ul>
</section>

<section class="rb-section">
  <h3 class="rb-heading">학습 절차</h3>
  <p class="rb-desc">강화학습은 다음의 반복 루프를 통해 학습이 이루어진다.</p>
  <ol class="rb-ordered">
    <li>에이전트가 환경의 <strong>상태(State)</strong>를 관찰한다.</li>
    <li>현재 정책에 따라 <strong>행동(Action)</strong>을 선택한다.</li>
    <li>환경은 새로운 상태와 <strong>보상(Reward)</strong>을 반환한다.</li>
    <li>에이전트는 보상 정보를 기반으로 <strong>정책 또는 가치 함수를 업데이트</strong>한다.</li>
    <li>이 과정을 수천 ~ 수백만 회 반복하며 성능을 개선한다.</li>
  </ol>
</section>

<section class="rb-section">
  <h3 class="rb-heading">할인 인수 (Discount Factor, γ)</h3>
  <p class="rb-desc">미래 보상은 현재 보상보다 불확실하므로 할인을 적용한다.</p>
  <div class="rb-formula">G<sub>t</sub> = R<sub>t+1</sub> + γR<sub>t+2</sub> + γ²R<sub>t+3</sub> + ⋯ = Σ γ<sup>k</sup>R<sub>t+k+1</sub></div>
  <ul class="rb-list">
    <li><code>γ = 0</code> → 현재 보상만 고려 (근시안적)</li>
    <li><code>γ = 1</code> → 미래 보상도 동일하게 고려 (장기적)</li>
    <li><code>γ = 0.9</code> → 일반적으로 사용되는 값</li>
  </ul>
</section>

<section class="rb-section">
  <h3 class="rb-heading">탐색 vs 활용 (Exploration vs Exploitation)</h3>
  <ul class="rb-list">
    <li><strong>탐색 (Exploration)</strong> → 새로운 행동을 시도해 더 좋은 보상을 찾음 — 단기적으로 손해일 수 있음</li>
    <li><strong>활용 (Exploitation)</strong> → 지금까지 알고 있는 최선의 행동 선택 — 더 좋은 방법을 놓칠 수 있음</li>
  </ul>
  <p class="rb-desc"><strong>ε-greedy 방법으로 균형:</strong> ε 확률로 랜덤 행동(탐색), 1-ε 확률로 최선 행동(활용)</p>
  <ul class="rb-list">
    <li>학습 초기 → ε 크게 (많이 탐색)</li>
    <li>학습 후반 → ε 작게 (주로 활용)</li>
  </ul>
</section>

<section class="rb-section">
  <h3 class="rb-heading">마르코프 결정 과정 (MDP)</h3>
  <p class="rb-desc"><em>마르코프 성질:</em> "현재 상태만 알면 과거 정보 없이도 미래를 결정할 수 있다" — S(t+1)은 S(t)에만 의존</p>
  <div class="rb-formula">MDP = (S, A, P, R, γ)</div>
  <ul class="rb-list">
    <li><code>S</code> — 상태 집합</li>
    <li><code>A</code> — 행동 집합</li>
    <li><code>P</code> — 상태 전이 확률 P(s'|s,a)</li>
    <li><code>R</code> — 보상 함수</li>
    <li><code>γ</code> — 할인 인수</li>
  </ul>
</section>

<section class="rb-section">
  <h3 class="rb-heading">강화학습의 분류</h3>
  <ul class="rb-list">
    <li><strong>Model-based</strong> — 환경의 작동 원리를 예측하는 가상 모델을 만든 후 학습</li>
    <li><strong>Model-free</strong> — 환경 예측 없이 시행착오만으로 최적 행동을 찾아가는 방식</li>
    <li><strong>On-policy</strong> — 행동하는 정책을 실시간으로 평가하고 업데이트</li>
    <li><strong>Off-policy</strong> — 탐색 전략(행동 정책)과 목표 최적 전략(목표 정책)을 분리해서 학습</li>
  </ul>
</section>

<section class="rb-section">
  <h3 class="rb-heading">장단점</h3>
  <div class="rb-pros-cons">
    <div class="rb-pros">
      <div class="rb-badge rb-badge-pros">장점</div>
      <ul class="rb-list">
        <li>정답 레이블 없이 스스로 학습 가능</li>
        <li>복잡한 순차적 의사결정 문제에 강함</li>
        <li>환경과 상호작용하며 지속적 개선 가능</li>
      </ul>
    </div>
    <div class="rb-cons">
      <div class="rb-badge rb-badge-cons">단점</div>
      <ul class="rb-list">
        <li>학습에 매우 많은 시행착오 필요</li>
        <li>보상 함수 설계가 어려움</li>
        <li>실제 환경 적용 시 안전성 문제</li>
        <li>학습 불안정, 재현성 낮음</li>
      </ul>
    </div>
  </div>
</section>
    `
  }
];

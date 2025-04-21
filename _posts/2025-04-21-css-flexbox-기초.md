---
layout: post
title: "CSS Flexbox 기초"
date: 2025-04-21
categories: 프론트엔드
tags: CSS
---

---
layout: post
title: CSS Flexbox 기초
---

CSS **Flexbox**는 웹페이지 내의 객체들 간의 간격과 위치를 보다 유연하게 조정할 수 있는 웹 디자인 기법인 Responsive Design의 일환입니다. **Flexbox**는 'Flexible Box'의 줄임말로, 유연성을 바탕으로 웹페이지의 레이아웃을 쉽게 구성하는 데 사용됩니다. 이 포스트에서는 Flexbox의 기본 개념을 배우고 실제 코드 예시와 함께 실무에서 어떻게 활용할 수 있는지 살펴보겠습니다.

Flexbox는 Flex Container와 Flex Items으로 구성되며, Flex Container 안에 있는 Flex Items의 배열을 조절합니다. Flexbox의 주요 속성은 다음과 같습니다:

1. `flex-direction` : 항목들이 배치될 주 축을 설정합니다. row(기본값), row-reverse, column, column-reverse 중 하나를 설정할 수 있습니다.
2. `justify-content` : 주 축의 공간 분배를 설정합니다.
3. `align-items` : 교차 축의 정렬을 설정합니다.
4. `flex-wrap` : 항목들을 한 줄에 강제 배치할지, 여러 줄로 나누어 배치할지 설정합니다.
5. `flex-flow` : flex-direction과 flex-wrap을 한번에 설정하는 단축 속성입니다.
6. `align-content` : 여러 줄 간의 간격 및 정렬을 설정합니다.

실제 코드 예시를 살펴보겠습니다.

```css
.flex-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}
```

위 코드는 flex container를 설정하고, 그 안의 항목들을 행 방향으로 배치하되 각 항목 사이에 공간을 동일하게 배치하고, 아이템들이 가운데 정렬되도록 속성을 지정하였습니다. 만약 화면 너비가 아이템들을 한줄에 배치하기 충분하지 않으면, 새로운 줄로 아이템들이 배치됩니다.

실무에서는 이런 방식으로 Navigation bar, Footer 등을 구현할 수 있습니다. 예를 들어, Navigation bar의 메뉴 아이템들이 항상 동일한 간격으로 배치되게 하거나, Footer의 내용물이 가운데 정렬되게끔 설정할 수 있습니다.

회사 로고와 같이 어떤 특정 아이템만 유연성을 늘리거나 줄이고 싶다면, 해당 아이템에 `flex-grow`, `flex-shrink`, `flex-basis` 속성을 적용할 수 있습니다.

```css
.flex-item {
    flex-grow: 1;
    flex-shrink: 2;
    flex-basis: auto;
}
```

Flexbox는 이 외에도 다양한 속성들을 제공하고 있어, UI/UX를 효과적으로 디자인 할 수 있습니다.

요약하자면, CSS Flexbox는 웹페이지의 레이아웃을 유연하게 구성하고, 화면 크기의 변화에 따라 그 레이아웃을 쉽게 바꾸어 줄 수 있는 강력한 도구입니다. Flex Container와 Flex Items의 특성을 이해하고, 속성들을 적절하게 활용한다면 화려하고 효율적인 웹페이지를 디자인할 수 있을 것입니다.

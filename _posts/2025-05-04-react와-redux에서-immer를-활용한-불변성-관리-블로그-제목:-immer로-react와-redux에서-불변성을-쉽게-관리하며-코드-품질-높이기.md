---
layout: post
title: "Immer로 React와 Redux에서 불변성을 쉽게 관리하며 코드 품질 높이기"
date: 2025-05-04 07:29:45
categories: 프론트엔드
tags: immer
---

# Immer로 React와 Redux에서 불변성을 쉽게 관리하며 코드 품질 높이기
---

React와 Redux에서 상태를 관리할 때, 우리는 불변성(Immutability)이 매우 중요하다는 사실을 알게 됩니다.
불변성이란, 데이터가 한번 생성되면 그 이후로는 변경되지 않는, 바꿀 수 없는 속성을 말합니다. React와 Redux의 상태는 불변성을 지켜주는 것이 중요하며, 이를 위해 불변성을 쉽게 관리해주는 라이브러리인 'Immer'를 사랑하는 개발자들이 많습니다.

## 불변성과 Immer

Immer는 상태 업데이트 로직을 매우 단순하게 만들어줍니다. 일반적으로 JavaScript에서 객체를 복사하거나 배열에 뭔가를 추가하는 등의 작업은 불변성을 지키기 위해 복잡한 코드를 작성해야 합니다. 하지만 Immer를 사용하면 이러한 불편함이 사라집니다.

```javascript
import produce from "immer";

const baseState = [
  {
    todo: "Learn typescript",
    done: true
  },
  {
    todo: "Try immer",
    done: false
  }
];

const nextState = produce(baseState, draftState => {
  draftState.push({todo: "Tweet about it"});
  draftState[1].done = true;
});

```

위 코드에서 produce 함수는 첫번째 인자로 상태 객체(baseState), 두번째 인자로 변경을 수행하는 함수(draftState => { ... })를 받습니다. 변경을 수행하는 함수에서 복잡한 작업을 수행하더라도, Immer의 produce 함수는 이를 자동으로 불변성을 지키면서 처리해줍니다.

## 실무에서 활용하기

아래는 Redux(또는 React-Redux)에서 action에 따라 state를 어떻게 업데이트할지 정의하는 리듀서 코드 예제입니다.

```javascript
import produce from "immer";

function todos(state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case ADD_TODO:
        draft.push({ text: action.text, done: false });
        break;
      case TOGGLE_TODO:
        draft[action.index].done = !draft[action.index.done];
        break;
      // ... 추가 액션 핸들러
    }
  });
}

```

위 예제에서 리듀서는 immer의 produce를 사용하고, action 종류에 따라서 변경할 state의 값을 직접 수정하고 있습니다. 이러한 방식으로 코드를 작성하면 불변성을 해치는 위험 없이, 쉽고 간결하게 상태를 업데이트할 수 있습니다. 이로 인해 코드의 유지보수성과 가독성 또한 향상됩니다.

## 응용 사례

Immer는 너무나도 간편하게 사용할 수 있으니, 가변 데이터에 대한 복잡한 로직을 단순화하는 등의 다양한 방식으로 응용이 가능합니다. 예를 들면, 중첩된 객체의 상태를 변경하는 등 복잡한 상태 업데이트가 필요한 경우 아래와 같이 사용할수 있습니다.

```javascript

const baseState = {
  object1: {
    object2: {
      value: 1,
    },
  },
};

const nextState = produce(baseState, draftState => {
  draftState.object1.object2.value = 2;
});

```

결과적으로, 복잡한 상태 업데이트 로직에서도 Immutable하게 상태를 변경하는 것이 가능합니다. 이로 인해 코드의 복잡성을 크게 줄일 수 있습니다.

## 결론

Immer란 라이브러리는 사용법이 간단하면서도, 불변성을 보장하는데 큰 편리함을 줍니다. 이렇게 간단하면서도 강력한 도구를 활용하여 품질 좋은 코드를 작성해보는 것은 어떨까요? Immer를 활용한 불변성 관리는 코드의 유지보수성과 가독성을 높이며, 여러분의 개발 경험을 훨씬 더 유쾌하게 할 것입니다.

이번 글을 통해 react와 redux에서 Immer를 활용한 불변성 관리 기법을 알게 되었다면, 여러분의 프로젝트에도 적용해보시기를 권장드립니다. 일상적인 개발에서도 이러한 기법들을 적극 활용하면 효율적이고 안정적인 코드를 작성하는 데 큰 도움이 될 것입니다.

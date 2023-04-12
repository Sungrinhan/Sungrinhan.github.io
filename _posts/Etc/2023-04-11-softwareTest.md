---
title: "[Jest, RTL] 소프트웨어 테스트"
date: 2023-04-11 16:20:SS +/- TTTT
categories: [Etc]
tags: [jest, rtl] # TAG는 반드시 소문자로 이루어져야함!
---

# 소프트웨어 테스트란..?

> TDD 같은 소프트웨어 개발론을 통해 테스트 라는 것을 알고는 있다. 부트캠프에서 시험 같은 경우도 테스트를 통해 채점 되는 형식이어서, 어떻게 검사하는지는 대략적으로 알고있다. 이번 기회에 좀 더 구체적으로 블로깅하면서 공부할까 한다.

- 소프트웨어가 의도한대로 동작하는지를 테스트
- 가장 큰 이점 = **"피드백을 빠른 주기로 개발 중에 받을 수 있다"**
- 거의 실시간으로 소프트웨어 동작에 대해 피드백을 받으며 올바른 방향으로 수정해 나갈 수 있고,
- 소프트웨어가 최소한 작성한 테스트 코드 안에서는 제대로 동작한다는 **확신을 갖게 됨**
- Software-test == 개발자의 생산성 향상
- 자동화된 테스트는 CI/CD 와 같은 프로세스에서도 해당 소스 코드들이 정상적으로 동작하는지 확인하는 과정에서 사용하는 등 다방면에 활용 가능.

# 소프트웨어 테스트의 종류

테스트가 확인하고자 하는 범위, 복잡성에 따라 크게 3종류

## 1) Unit Test

- 테스트 중 가장 로우 레벨, 가장 작은 범위를 테스트한다.
- 개별 함수, 메서드, 클래스, 컴포넌트 등의 동작을 테스트.
- 제일 간단한 형태의 테스트로, 가장 적은 비용

## 2) Integration Test

- 통합 테스트는 두개 이상의 모듈이 결합해서 동작을 잘 수행하는지에 대한 테스트

## 3) End-to-End Test (E2E Test)

- 실제 유저가 애플리케이션을 사용하는 것과 유사한 환경을 구축한 후 실제 유저의 동작을 흉내내서 테스트 하는 것
- 굉장히 비싼 테스트
- 소스코드에 변화가 있을때마다 빈번하게 수행할 수 없음
- 핵심 기능에 대해서 E2E 테스트를 구축 한 후 확인이 필요한 순간에만 실행하는 것이 일반적

# Jest 를 활용한 JavaScript 테스트

- 자바스크립트 에서는 Jest, Mocha, chai 등의 테스트 라이브러리들이 대표적으로 사용됨.
- Jest 가 주간 약 1800만 다운로드의 압도적인 점유율
- CRA 에서도 기본적으로 Jest 를 포함해 환경을 구성, 사실상 표준으로 사용되어서 jest 에 대해 알아보자.

## Jest 사용법

기본적으로 `*.test.*` 의 형태를 가진 파일을 테스트 파일로 인식, 해당 파일안에 있는 코드를 실행한다. 테스트 과정은 일반적으로

1. 특정한 동작을 수행한다.
2. 동작을 수행한 결과가 기대한 상황과 일치하는지 판단한다.

와 같다.

테스트 코드를 작성하는 것도 마찬가지로 테스트를 하고자 하는 동작을 수행한 뒤 그 결과가 기대한 상황과 일치하는지를 검증하는 과정을 코드로 작성하게 됨.

Jest 에서는 이를 기대한 상황과 일치하는지 판단하는 함수들을 **matchers** 라고 표현함.
이때 하나의 특정한 동작을 수행하기 위해서 `test()` 또는 `it()` 함수를 활용할 수 있음.

```ts
test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});

it("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});
```

- 테스트는 <span style="color:#ff0000">`test("테스트 이름", callback)`</span> 의 형태
- Callback 함수 안에서 원하는 동작을 수행
- <span style="color: #ff0000">`expect(실제 결과 값).matcher()`</span> 의 형태
- 하나의 콜백 안에서 여러 `expect` 를 수행할 수 있으며, 하나라도 기대값과 일치하지 않으면 테스트는 실패로 간주됨

```ts
const sum = (x, y) => x + y;

test("sum", () => {
  expect(sum(2, 2))
    .toBe(4) // 통과
    .expect(sum(3, 1))
    .toBe(5); // 실패
});
```

### Jest 에서 주로 사용되는 matcher 들

1. `toBe`: expect의 인자가 toBe 의 인자와 일치하는지를 검사
2. `toEqual`:
   - Object 의 경우 참조값이 다르기 때문에, toBe 를 활용할 경우 실제 각 객체의 내용이 같더라도 일치하지 않다고 판단. 따라서 객체를 상호 비교할 경우 `toEqual` matcher 를 활용해야함. `toEqual` 은 객체의 각 요소들을 재귀적으로 검사하면서 두 객체가 동일한지 판단해줌.
3. `toBeNull, toBeUndefined`
4. `toBeGreaterThan, toBeGreaterThanOrEqual, toBeLessThan, toBeLessThanOrEqual` : 숫자값을 검증할 때.
5. `toContain` : Iterable한 객체들이 특정한 요소를 포함하고 있는지 검증할 때 사용

   ```ts
   const iterable = [1, 2, 3, 4, 5];

   test("iterable contain 3", () => {
     expect(iterable).toContain(3);
   });
   ```

6. `not` : matcher의 기대값을 반대로 변경해줌.

   ```ts
   test("null", () => {
     const n = null;
     expect(n).toBeNull();
     expect(n).not.toBeUndefined();
   });
   ```

# Jest 와 RTL 을 이용한 리액트 테스트

리액트는 UI 라이브러리기에 리액트의 동작을 순수한 Jest 만으로 테스트 하기에는 다소 어려움이 있다. 따라서 UI를 렌더링 하는 부분을 책임지는 `react-dom` 라이브러리에서 제공해주는 별도의 기능들과 결합하여 테스트를 수행해야 한다.

컴포넌트의 UI 와 동작을 테스트 할 때 많이 사용되는 라이브러리 : Enzyme, React-Testing-Library

- Enzyme : "구현"을 테스트 하는것에 초점이 맞춰져 있는 라이브러리
- RTL: "결과"를 테스트 하는것에 초점이 맞춰진 라이브러리

이중에서

1. 리액트 공식문서에서 권장
2. CRA 기본 구성으로 포함된 점
3. npm 다운로드 수가 더 많은 점
4. "결과"를 테스트 하기위해 RTL 에 대해 알아보자 .

## React Testing Library

컴포넌트 테스트 시 내부에서 어떤식으로 세부적인 구현이 이루어졌는지를 테스트 하는게 아니라
행위에 대해서 어떤 결과가 나와야 하는지에 초점

세부적인 구현을 기반으로 테스트를 한다는 것은 "특정 버튼을 클릭하면 컴포넌트의 state 가 변한다. 그리고 이게 UI 에 반영된다" 처럼 동작을 기반으로 테스트를 구성.

반면에 결과에 대해서 테스트를 한다는 것은 "특정 버튼을 클릭하면 화면에 2라는 숫자가 나와야 한다" 처럼 최종적으로 유저가 어떤 UI 를 볼 수 있어야 하는지에 초점을 두고 테스트 하는 것.

이처럼 결과를 중심으로 테스트를 작성하게 되면 컴포넌트의 겉보기 동작은 그대로 유지하며, 내부적인 구현은 얼마든지 변경할 수 있음. 예를들어 구현을 테스트 했을 경우, 상태관리를 useState 가 아닌 Recoil, Redux 등으로 변경했을 경우 테스트코드를 다시 작성해야 하지만, 결과를 중점으로 테스트 했을 경우 상태관리가 어떻게 바뀌든 최종적으로 버튼을 클릭했을 때 화면에 2라는 숫자가 나온다는 결과마 동일하다면 테스트코드를 변경할 필요가 없다.

RTL 은 이러한 철학에 기반을 두었기에 리액트 컴포넌트를 렌더링하고, 특정요소에 접근할 수 있게 하는 기능을 제공한다. `testing-library/user-event` 의 경우 유저의 행동과 마찬가지로, 특정 엘리먼트에서 이벤트를 발생시키는 기능을 제공한다.

```ts
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("App rendering", () => {
  render(<App />);

  const header = screen.getByText("Hello World");
  const button = screen.getByText("Click me!");

  userEvent.click(button);
});
```

그리고 RTL 은 통상 `jest-dom` 라이브러리와 함께 사용됨. RTL은 렌더링, 요소 접근 등의 기능을 수행해 준다. 하지만 테스트를 위해서는 이 요소들이 DOM 상에 존재하는지, 특정 프로퍼티를 가지고 있는지 등을 검사할 수 있어야 한다. 이는 DOM 에 관련된 기능이기에 jest 에서는 이러한 기능을 수행할 수 있는 matcher들을 기본적으로 포함하고 있지 않다. 이러한 matchers 를 추가하기 위해서는 jest-dom 라이브러리를 사용해야 한다.(CRA 에 포함되어 있음)

```ts
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "./App";

test("App rendering", () => {
  render(<App />);

  const header = screen.getByText("Hello World");
  const button = screen.getByText("Click me!");

  userEvent.click(button);

  expect(header).toBeInTheDocument();
  expect(button).toBeDisabled();
});
```

## RTL의 기본적인 활용

- `screen`: screen은 말 그대로 현재 렌더링이 진행되고 있는 화면을 의미. DOM 상에서는 document.body와 동일하다고 할 수 있다. DOM API 와 마찬가지로 screen을 통해서 현재 화면에 렌더링된 요소들에 관련된 여러 메서드들을 확인할 수 있다.

  1.  `screen.debug`

      - screen.debug 메서드는 테스트 과정에서 출력된 DOM을 확인하고 싶을 때 사용할 수 있다. 이 메서드를 호출하면 호출한 시점의 렌더링된 DOM tree 를 확인할 수 있다.

  2.  요소를 가져오는 메서드

      - DOM에서 제공하는 `getElementBy, querySelector` 등의 API와 마찬가지로 RTL 에서도 렌더링 된 요소들에게
      - 크게 3가지 종류로 구분된다.
        - `getBy~~~` : 해당 요소가 현재 DOM상에 있는지 동기적으로 확인한다. 찾는 요소가 없는 경우 예외를 던짐.
        - `findBy~~~` : 해당 요소가 현재 DOM 상에 있는지 비동기적으로 확인. 해당 요소를 찾기 위해 일정 시간을 기다리며, 시간이 지난 후에도 찾을 수 없는 경우 예외를 던짐.
        - `queryBy~~~` : getBy와 동일하게 동작하지만 찾는 요소가 없을 경우 예외를 던지는 것이 아닌 null을 반환.
      - 예시
        - `getByRole`
        - `getByText`
        - `getByLabelText`
        - `getByPlaceholderText`
        - `getByDisplayValue`
        - `getByAltText`
        - `getByTitle`
        - `getByTestId`

  3.  userEvent
      - 실제 DOM 상에서 유저처럼 이벤트를 발생시키기 위해서 `testing-library/userEvent` 라이브러리를 사용할 수 있다.
      - `userEvent.이벤트명(엘리먼트)` 의 형태로 활용 가능하다.

  ```ts
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import "@testing-library/jest-dom";
  import App from "./App";

  test("App rendering", () => {
    render(<App />);

    const button = screen.getByText("Click me!");

    userEvent.click(button);
  });
  ```

# TDD 란?

Test-Driven-Devvelopment 의 약어. 소프트웨어를 개발하는 여러 방법론 중 하나.

실제 코드를 작성하기 전 테스트 코드부터 작성을 시작.

크게 Red-Green-Blue 3가지 단계를 거친다.

1. <span style="color: red">Red</span>: 실제 구현을 하기 전에, 먼저 실패하는 테스트 코드를 작성한다. 그 후 테스트를 실행한다. 실제 코드가 작성되지 않았기에 테스트 코드는 당연히 실패한다.
2. <span style="color: green">Green</span> : 테스트를 통과하기 위해 가장 간단한 형태로 코드를 작성한다. 그 후 테스트를 실행한다. 테스트는 실제 구현이 되었기에 통과한다.
3. <span style="color: blue">Blue</span> : Green 단계의 코드를 더 좋은 형태로 리팩터링 한다. 이 과정에서 지속적으로 테스트를 실행해서 테스트가 통과하는지 확인한다.

### 장점

1. 코드 작성 과정에서 확신 및 자신감을 얻을 수 있게 됨.
2. 구현을 잘못 한 경우 바로 확인 가능
3. 코드의 동작이 명확해진다.
   - "어떻게 코드를 짜야할 지가 아닌 무슨 코드를 짜야할 지 부터 고민하게 됨"

## 참조

원티드 프리온보딩

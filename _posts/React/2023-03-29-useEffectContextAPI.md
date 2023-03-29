---
title: "[React] UseEffect & Context API"
date: 2023-03-29 14:01:SS +/- TTTT
categories: [React]
tags: [react, useeffect, context] # TAG는 반드시 소문자로 이루어져야함!
---

UseEffect & Context API

# 의존성 배열

의존성 배열을 제대로 다루지 못한다면 React 를 사용하면서 버그가 발생할 확률이 높아진다.
useEffect의 의존성 배열을 통해 중요성과 올바르게 다루는 법을 배워보자.

### 1. 의존성 배열이란?

- useEffect 훅에 두번째 인자로 넘기는 배열.
- 두번째 인자를 넘기지 않으면 Effect는 매번 실행되고, 빈 배열에 넘긴다면 컴포넌트의 첫번째 렌더링 이후에만 실행됨.

이정도는 나도 알고있는 수준이다. 그런데 이정도만 알고 useEffect를 사용하고 있었다면 애플리케이션에서 버그가 발생할 확률이 굉장히 높다...!

### 2. useEffect 의존성 배열의 잘못된 활용

```ts
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `you clicked ${count} times`;
  }, []);
}
```

위에 코드에서 state 가 변경된다고 document.title은 변경되지 않는다. 왜냐? 빈배열을 넘겼기 때문에 저 effect 함수는 첫 렌더링에만 실행되고 (컴포넌트 함수가 호출되었을 때만 ) 이후에는 실행되지 않기 때문!

### 3. useEffect 의존성 배열을 잘 설정하는 법

- 모든 의존성을 빼먹지 말고 의존성 배열에 명시해라
- 가능하다면 의존성을 적게 만들어라

```ts
// bad
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(intervalID);
  }, [count, setCount]);

  return (
    <div>
      <h1>count: {count}</h1>
    </div>
  );
}
```

간단한 일반 변수, state, props 는 까먹지 않고 dependencies array 에 명시하기 쉽다.

하지만 함수 컴포넌트의 내부에서 선언한 Object 나 Function 의 경우에는 함수 컴포넌트의 매 호출마다 새로운 객체, 함수가 선언되고 참조형 데이터 타입의 특징으로 인해 객체 내부의 요소들이 동일하더라도 새롭게 생성된 객체와 이전객체를 비교하면 서로 다른 객체라고 판단되게 된다.

따라서 아래의 코드는 무한루프를 반복하게 됨.

```ts
function Component() {
  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount((prev) => prev + 1);
  };

  useEffect(increseCount, [increaseCount]);
}
```

위의 문제를 해결하기 위해서 여러가지 방안이 있다.

#### 1. 의존성을 제거 , 함수를 effect 안에 선언하기

```ts
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increaseCount = () => {
      setCount((prev) => prev + 1);
    };

    increaseCount();
  }, []);
}
```

#### 2. 함수를 컴포넌트 바깥으로 이동시키기

```ts
// bad

function Component() {
  const getUserAuth = () => {
    localStorage.getItem("ACCESS_TOEKN");
  };

  useEffect(() => {
    const token = getUserAuth();
    // login....
  }, []);
}
```

```ts
// good

function Component() {
  useEffect(() => {
    const token = getUserAuth();
    // login ...
  }, [getUserAuth]);
}

const getUserAuth = () => {
  localStorage.getItem("ACCESS_TOKEN");
};
```

#### 3. 메모이제이션

```ts
// normal

function Component() {
  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    // do something 1
    increaseCount();
  }, []);

  useEffect(() => {
    // do something 2
    increaseCount();
  }, []);
}
```

```ts
// 최적화

function Component() {
  const [count, setCount] = useState(0);

  const increaseCount = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // do something 1
    increaseCount();
  }, [increaseCount]);

  useEffect(() => {
    // do something 2
    increaseCount();
  }, [increaseCount]);
}
```

> [A Complete Guide to useEffect](https://overreacted.io/ko/a-complete-guide-to-useeffect/) 참고 .. 아주 자세히 잘 적혀있다. 지금은 흐름만 봐보자.

# Context API

- React에서 제공하는 내장 API, 컴포넌트들에게 동일한 Context 를 전달하는데 사용
- Redux 의 개념과 비슷. Props drilling 문제를 해결할 수 있다. 상태관리 저장 기능.

## 사용법

### 1. `createContext`

```ts
const UserContext = createContext(null);
```

- createContext 함수를 호출하면 Context 객체가 리턴
- 함수를 호출할 떄는 defaultValue 를 인자로 전달가능

이때 defaultValue 는 Context Value의 초기값이 아닌, 다른 컴포넌트에서 Context 에 접근하려고 하지만 Provider로 감싸져 있지 않은 상황에서 사용될 값을 의미.

### 2. `Provider`

만들어진 Context 를 통해서 특정한 값을 전달하기 위해서는 Provider 컴포넌트를 이용해야 함.
Context 객체에는 Provider 라는 프로퍼티가 있고, 이거는 리액트 컴포넌트다.

Provider 컴포넌트는 value 라는 props 를 가지고 있으며, value 에 할당된 값을 Provider 컴포넌트 하위에 있는 어떤 컴포넌트든 접근할 수 있게 해주는 기능을 가지고 있다.

> redux 에서도 provider 를 app.tsx 에서 컴포넌트를 감싸고,

```ts
const UserContext = createContext(null);

const user = { name: "yeonuk" };

<UserContext.Provider value={user}>
  <Child />
</UserContext.Provider>;
```

### 3. `useContext`

함수 컴포넌트에서 useContext 라는 내장 Hook을 이용해 Context Value 에 접근할 수 있다.

```ts
const UserContext = createContext(null);

const user = { name: "yeonuk" };

<UserContext.Provider value={user}>
  <Child />
</UserContext.Provider>;

function Child() {
  const user = useContext(UserContext);

  return <h1>{user.name}</h1>;
}
```

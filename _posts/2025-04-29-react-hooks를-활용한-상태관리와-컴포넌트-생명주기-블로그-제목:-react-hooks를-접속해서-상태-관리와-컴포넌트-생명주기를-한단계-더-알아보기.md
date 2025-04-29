---
layout: post
title: "React Hooks를 활용한 상태관리와 컴포넌트 생명주기

블로그 제목: React Hooks를 접속해서 상태 관리와 컴포넌트 생명주기를 한단계 더 알아보기"
date: 2025-04-29 07:07:56
categories: 프론트엔드
tags: React
---

---
layout: post
title:  "React Hooks를 활용한 상태관리와 컴포넌트 생명주기"
date:   2021-06-30
desc: "React Hooks 사용법과 상태 관리, 컴포넌트 생명주기를 이해하고 실무에 활용해보자."
categories: [Development]
tags: [React, Hooks, State Management]
---

React Hooks는 React의 16.8 버전 이후로 도입된 기능으로, 함수형 컴포넌트에서도 상태 정보를 가질 수 있게 만들어주며 생명주기 훅을 함수형 컴포넌트에서도 사용할 수 있게 해준다. 이전에는 클래스 컴포넌트에서만 가능했던 이런 작업을 Hooks를 사용해서 함수형 컴포넌트에서도 할 수 있게 되었다.

React의 기본 제공 Hook에는 `useState`, `useEffect`, `useContext` 등이 있다. 각각의 Hook은 상태 관리와 생명주기, 그리고 context API를 활용한 글로벌 상태 관리를 지원한다.

#### useState
먼저, `useState`는 가장 기본적인 상태 관리 Hook이다. 다음은 `useState`를 사용하는 간단한 예제다.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
위 예제는 count라는 상태 값을 관리하고, 버튼 클릭 시 count 값을 1씩 증가시키는 기능을 하는 컴포넌트다. `useState` 함수는 인자로 초기 상태 값을 받고, 배열을 반환하는데 첫 번째 원소는 현재 상태 값, 두 번째 원소는 해당 상태를 갱신하는 함수다. 

꿀팁으로는, 상태 값이 복잡한 객체나 배열일 경우 `setCount` 함수를 사용할 때 이전 상태 값에 기반하여 업데이트를 해야한다면 함수를 인자로 넣어줄 수 있다는 점이다. 이렇게 하면 React가 알아서 이전 상태 값을 넣어 호출해준다.

```jsx
setCount(prevCount => prevCount + 1);
```

#### useEffect
`useEffect` 는 컴포넌트가 렌더링된 이후에 어떤 작업을 수행해야 하는지 정의할 수 있다. 이를 통해 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` 와 같은 생명주기 함수를 사용할 수 있다. 

실제 예제를 살펴보자.

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
위 예제는 `useEffect` 를 통해 브라우저의 문서 제목을 변경하는 부수 효과(side effect)를 수행한다. 

마지막으로, 커스텀 Hook을 만들어 재사용 가능한 로직을 제작할 수 있다. 아래 코드는 특정 URL에 대한 API 요청 결과를 반환하는 커스텀 Hook인 `useFetch`를 만드는 예제다.

```jsx
import { useState, useEffect } from 'react';
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  async function fetchUrl() {
    const response = await fetch(url);
    const json = await response.json();
    
    setData(json);
    setLoading(false);
  }
  
  useEffect(() => {
    fetchUrl();
  }, []);
  
  return [data, loading];
}
```

위와 같이 개발자가 필요로 하는 로직을 커스텀 Hook으로 만들어 재사용하면 코딩을 더 효율적이고 일관성 있게 작성할 수 있다. 처음 Hook을 접하는 개발자라면 익숙해질 때까지 공식 레퍼런스를 뒤져보고, 기존의 클래스 컴포넌트를 함수형 컴포넌트로 바꿔보는 연습을 해보는 것을 추천한다. 

이상이다. Happy Coding!

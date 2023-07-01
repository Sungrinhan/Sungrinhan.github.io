---
title: "[React] React 에 key 값이 필요한 이유(Rendering Lists)"
date: 2023-07-01 21:35:SS +/- TTTT
categories: [React]
tags: [react, keys] # TAG는 반드시 소문자로 이루어져야함!
---

# React 에 key 값이 필요한 이유(Rendering Lists)

화면에서 어떤 데이터 리스트를 구현해야 하는 경우는 매우 많다. 그리고 그러한 리스트들은 비슷한 컴포넌트 모양을 가지고있다. 그래서 보통은 data 의 array method 를 사용해서 표현했다.

> 이번 배우기 목표
>
> - array method `map()`, `filter()` 를 사용해서 컴포넌트 렌더링하기
> - 언제 그리고 왜 React keys 가 필요한가

## 1. Rendering data from arrays

사실 이 부분은 여기 블로그에서 따로 다루지 않겠다.
왜냐? 잘 아는 부분이라... ㅎㅎ 자세한 방법은 [React 공식 블로그](https://react.dev/learn/rendering-lists)에서 참고바란다.

## 2. When and why to use React keys

자, 앞으로 나올 내용이 블로깅을 작성하게 된 이유다.

위와 같이 list 배열을 array method 를 사용해서 렌더링 하게 되면, 다음과 같은 Warning 을 마주하게 된다.

`Warning: Each child in a list should have a unique “key” prop.`

> Note
> JSX 요소에서 사용하는 `map()`함수 포출은 언제나!! keys 값이 필요하다!!

왜냐? 리액트에서는 리렌더링이 일어날 때, DOM tree 를 변경 전과 비교하여 바뀐 부분만 수정 한후 -> 렌더링을 한다. 고유 key 값이 없을 경우, 이러한 비교 알고리즘의 시간복잡도는 빅오표기법으로 O(n^3) 까지 된다. 하지만 적절한 유니크 key 값을 넣어주면, O(n)까지 줄일 수 있다.

key 값을 주는경우, data list(array) 가 이동되거나 , sorting, 삽입, 삭제 되는 경우 빠르게 찾을 수 있다.

### 어디서 `key` 값을 찾아야 할까?

데이터의 다양한 출처는 다양한 key 값을 참고하게 한다:

- 디비에서 얻은 데이터: 데이터베이스에 있는 keys/IDs 를 참고하면 된다(유니크하기 때문)
- 클라에서 생성된 데이터: 데이터가 local 에서 생성되고 유지되는 경우(note taking app), 증가 카운터를 사용하면된다. 혹은 uuid 같은 패키지를 items 를 만들때 쓰면된다.

### `keys` 의 규칙

- keys 는 자매관계들에서 유니크 해야한다. 하지만 JSX에서 다른 데이터 배열이면 같은 id 라도 상관없다.
- keys 는 바뀌면 안된다. 무슨말이냐~ 유니크하게 만든다고 해서 어떤 로직이 동작하면 안된다는 뜻. like 순수 값.

### 리액트는 왜 키값을 필요로 할까?

위에서 설명하였듯이, array 가 변경되어도 유니크한 key 값을 통해 리액트는 변경점만 감지할 수 있게된다.

간단히 예를 들어서, 컴퓨터에 파일들이 있고 그 파일들은 이름이 없이 순서로만 구분한다고 하자. 파일의 삽입, 삭제, 혹은 필터링을 통해 사용자에게 보여질 때, 순서가 없으면 구분하기가 어렵다. 유니크한 이름을 통하면 찾기가 더 쉬워지는 원리와 같다고 생각하면 된다!

> ## 함정을 조심하자
>
> key 값으로 배열의 index 를 줄 수도 있다. 사실, 이 방법은 내가 key 를 정의하지 않으면 react 에서 자체적으로 하는 일이다. 하지만, `map()`함수에서 data 의 index 는 변화하는 값이다. 배열 요소의 삭제, 이동, 삽입이 일어날 경우 index 는 변화할 수 있기 때문에 Index as key 는 자주 버그를 일으킬 수 있다.
>
> 비슷하게, JSX 내에서 즉석으로 키를 생성하는 것도 문제가 된다. like `key = {Math.random()}`. 렌더 사이에서 key 값들은 절대 match 가 되지 않을 거며, 리렌더링이 일어날 때마다 리스트의 모든 컴포넌트와 DOM 을 재생성할 것이다. 당연히 이 속도는 느릴거고, list items 안에 있는 유저 input 값들도 잃을 것이다.

---

> 출처
>
> - [리액트 공식문서](https://react.dev/learn/rendering-lists

---
title: "[React] useState 왜 비동기로 만들었을까?"
date: 2022-07-27 16:21:SS +/- TTTT
categories: [React]
tags: [react, useState] # TAG는 반드시 소문자로 이루어져야함!
---

useState 왜 비동기로 만들었을까?

React 에서 state 는 컴포넌트 내부의 변경 가능한 값이다.

일반적으로 사용하는 변수를 놔두고, 왜 state 를 사용해서 값을 관리할까?

_state 가 갖는 특성 때문이다. 바로 값이 변경되면 리렌더링(Re-rendering) 이 발생하기 때문이다._

-> 따라서 값이 변화함에 따라 **실시간으로 화면이 렌더링**되고 변화된 값이 화면에 바로 반영된다.

값의 변화를 리액트도 알아차릴 수 있게 해주어야 하므로 값의 변경은 리액트가 제공하는 함수를 통해서만 이루어져야 한다.

```ts
import React, {useState } from 'react';

const MyFunc = () => {
	const [cnt, setCnt] = useState(0) // 초기화 0

	const plusNum = () => {
		setCnt( cnt +1 );
	}

return (
	<div>
		<p> 값: {cnt} </p>
		{/*훅이 반환하는 함수를 통해서만 값을 변경해야 함 */}
		<button onClick={plusNum>plus</button>
	</div>
	)
}
```

`plusNum()` 함수에 콘솔을 추가해보자.

```ts
const plusNum = () => {
  setCnt(cnt + 1);
  console.log("result:" + cnt);
};
```

의도한 것은 state 에 cnt+1. 의 값을 설정하고 새로 설정된 값을 바로 콘솔창에 출력하고 싶다. 하지만 결과는 한 걸음 늦는다.

`result: 0`

왜 이럴까? 바로 비동기(Asynchronous)의 특성 때문이다.

## 동기로 처리하기

비동기 특성을 갖는 이벤트 루프에 의해 setCnt 작업은 뒤로 밀리고, console.log 작업이 먼저 실행되기 때문이다.

이벤트 루프가 비동기로 업무를 처리하기 때문에.

```ts
const printSequence = () => {
	console.log('first Call')
	setTimeout(() => {secondCall()}, 0)
	console.log('third Call');
}

const secondCall = () => {
	console.log('second Call');
}


결과는 다음과 같다.
first Call
third Call
second Call
```

`setTimeout()` 함수도 비동기적으로 작동하기 때문이다.

그러면 setTimeout 을 통해 console.log 작업시간을 뒤로 연기하면 작업이 끝난 뒤 로그를 찍을테니 값이 제대로 표시될까?

일단 정답부터말하면 NO 다.

```ts
const showAlert = () => {
	setCnt(cnt+1);
	setTimeout(() => {
		console.log('result(3sec):' +cnt)}
		, 3000);
	}
이 함수를 5번 실행해보자 .

결과는 다음과 같다.

result(3sec): 0
result(3sec): 1
result(3sec): 2
result(3sec): 3
result(3sec): 4
```

함수를 다섯번 실행했으니 콘솔도 5까지 찍혀야 하지만 , 업데이트 되기 전의 값이 나온다.

Why?

이거는 그냥 setTimeout 함수의 특성 때문이다. 함수가 실행할 때 마다 새로운 함수가 만들어지고, 전달되는 함수 내부의 값은 변수가 아닌 전달하는 시점의 변수값(상수) 이 전달되기 때문이다.

따라서 1000초뒤에 실행하더라도 실행되는 값은 전달하는 시점의 변수값이다.

## 해결방법

useEffect 를 사용하면된다.

```ts
consts plusNum = () => {
	setCnt(cnt+1);
}

useEffect(() => {
	console.log(cnt);
}, [cnt])
```

디펜던시가 cnt 이므로 , cnt 가 변경될때마다 (즉 변경 후 ) 콘솔 함수가 실행되므로, 의도된 값을 출력할 수 있다.

## 비동기로 작동하는 이유

state 값이 변경되면 리렌더링 발생.

여러개의 값이 변경될때마다 렌더링이 된다면, 엄청나게 많은 수의 렌더링을 하게 될 것이다.

따라서 변경된 값들을 모아 한번에 업데이트를 진행하여 렌더링을 줄이고자 배치(Batch)기능을 사용해 비동기로 작동시키는 것이다.

배치업데이트는 16ms 주기라고 한다.

## 참조

https://choonse.com/2022/01/21/677/

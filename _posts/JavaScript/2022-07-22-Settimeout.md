---
title: "[JS][Method] 스케줄링 호출(setTimeout)"
date: 2022-07-22 11:45:SS +/- TTTT
categories: [JavaScript]
tags: [javascript, settimeout, setinterval] # TAG는 반드시 소문자로 이루어져야함!
---

SetTimeout 과 setInterval 을 이용한 호출 스케일링

일정 시간이 지난 후 원하는 함수를 예약 실행(호출)할 수 있게 하는 것을 '호출 스케일링' 이라고 한다.

- `setTimeout` 을 이용해 일정 시간이 지난 후 함수를 실행하는 방법
- `setInterval` 을 이용해 일정 시간 간격을 두고 함수를 실행하는 방법

자바스크립트 명세서엔 두개 모두 명시되어있지 않다. 하지만 시중에 나와있는 브라우저, Node.js 를 포함한 자바스크립트 환경 대부분이 이와 유사한 메서드나 내부 스케줄러를 지원한다.

# setTimeout

문법:

```ts
let timerId = setTimeout(func|code, [delay], [arg1], [arg2], ...)
```

**Arguments**

- `func|code`
  실행하고자 하는 코드, 함수 또는 문자열 형태이다. 대개는 이 자리에 함수가 들어간다. 하휘 호환성을 위해 문자열도 받을 수 있지만, 추천하진 않는다.

- `delay`
  실행 전 대기 시간으로, 단위는 밀리초(millisecond, 1000밀리초 = 1초) 이며 기본값은 0 이다.

- `arg1`, `arg2`...
- 함수에 전달할 인수들이다.

## 예시

아래 코드를 실행하면 1초 후에 `sayHi()` 가 호출된다.

```ts
function sayHi() {
  alert("안녕하세요.");
}

setTimeout(sayHi, 1000); // 1초 뒤 sayHi 가 호출됨.
```

아래와 같이 함수에 인수를 넘겨줄 수도 있다.

```ts
function sayHi(who, phrase) {
	alert( who + ' 님, ' + phrase);

setTimeout(sayHi, 1000, "홍길동", "안녕하세요."); // 홍길동 님, 안녕하세요.
```

`setTimeout` 의 첫 번째 인수가 문자열이면 자바스크립트는 이 문자열을 이용해 함수를 만든다.

```ts
setTimeout("alert('안녕하세요.')", 1000);
```

그런데 이렇게 문자열을 사용하는 방법은 추천하지 않는다. 되도록 다음 예시와 같이 익명 화살표 함수를 사용한다.

```ts
setTimeout(() => alert("안녕하세요."), 1000);
```

> 함수를 실행하지 말고 넘기자.
>
> ```ts
> // 잘못된 코드
> setTimeout(sayHi(), 1000);
> ```
>
> `setTimeout`은 함수의 참조 값을 받도록 정의되어 있는데, sayHi() 를 인수로 전달하면 함수 실행결과가 전달되어 버린다. `sayHi()` 엔 반환문이 없다. 호출 결과는 undefined 가 될 것이다.

## clearTimeout 으로 스케줄링 취소하기

`setTimeout` 을 호출하면 '타이머 식별자(timer identifier)' 가 반환된다. 스케줄링을 취소하고 싶을 땐 이 식별자(아래 예시에서 `timerId`)를 사용하면 된다.

스케줄링 취소하기:

```ts
let timerId =  setTimeout(...);
clearTimeout(timerId);
```

아래 예시는 함수 실행을 계획해 놓았다가 중간에 마음이 바뀌어 계획해 놓았던 것을 취소한 상황을 코드로 표현하고 있다. 예시를 실행해도 스케줄링이 취소되었기 때문에 아무런 변화가 없는 것을 확인할 수 있다.

```ts
let timerId = setTimeout(() => alert("아무런 일도 일어나지 않는다."), 1000);
alert(timerId); // 타이머 식별자

clearTimeout(timerId);
alert(timerId); // 위 타이머 식별자와 동일함 (취소 후에도 식별자의 값은 null 이 되지 않는다.)
```

code sandbox 로 실행해 보니 처음 alert 값과 두번째 alert 값이 같았다. 어떠한 랜덤한 숫자가 나온다. `clearTimeout` 을 써도 인자는 변하지 않는다 < 결론!

# setInterval

`setInterval` 메서드는 `setTimeout` 과 동일한 문법을 사용한다.

```ts
let timerId = setInterval(func|code, [delay], [arg1], [arg2], ...)
```

`setTimeout` 이 함수를 단 한번만 실행하는 것과 달리 `setInterval` 은 함수를 주기적으로 실행하게 만든다.

함수 호출을 중단하려면 `clearInterval(timerId)`을 사용하면 된다.

다음 예시를 실행하면 메시지가 2초간격으로 보이다가 5초 이후에는 더이상 메시지가 보이지 않는다.

```ts
// 2초 간격으로 메시지를 보여줌
let timerId = setInerval(() => alert("째깍"), 2000);

// 5초 후에 정지
setTimeout(() => {
  clearInterval(timerId);
  alert("정지");
}, 5000);
```

> 💡 `alert` 창이 떠 있더라도 타이머는 멈추지 않는다.
>
> Chorme, firefox 를 포함한 대부분의 브라우저는 `alert/ confirm/ prompt` 창이 떠 있는 동안에도 내부 타이머를 멈추지 않는다.
>
> 위 예시를 실행하고 첫번째 alert 창이 떴을 때 몇 초간 기다렸다가 창을 닫으면, 두 번째 alert 창이 바로 나타난다. 그래서 명시된 지연시간인 2초보다 더 짧은 간격으로 뜨게 됨!

# 중첩 setTimeout

무언가를 일정 간격을 두고 실행하는 방법에는 크게 2가지 있다.
하나는 `setInterval` 을 이용하는 방법, 다른하나는 아래와 같이 중첩 `setTimeout`을 이용하는 방법이다.

```ts
/* setInterval 을 이용하지 않고 아래와 같이 중첩 setTimeout을 사용함
 * let timerId = setInterval(() => alert('째깍'), 2000);
 */

let timerId = setTimeout(function tick() {
  alert("째깍");
  timerId = setTimeout(tick, 2000); // (*)
}, 2000);
```

다섯 번째 줄의 `setTimeout` 은 `(*)` 로 표시한 줄의 실행이 종료되면 다음 호출을 스케줄링 한다.

중첩 `setTimeout` 을 이용하는 방법은 `setInterval`을 사용하는 방법보다 유연하다. 호출 결과에 따라 다음 호출을 원하는 방식으로 조정해 스케줄링 할 수 있기 때문이다.

`setInterval` <<< `중첩 setTimeout`

## 중첩 setTimeout 사용하기

5초 간격으로 서버에 요청을 보내 데이터를 얻는다고 가정해보자. 서버가 과부하 상태라면 요청간격을 10, 20 , 30초 등으로 증가시켜주는게 좋을 것이다.

```ts
let delay = 5000;

let timerId = setTimeout(function request() {
	...요청 보내기...

	if (서버 과부하로 인한 요청 실패) {
		//요청 간격을 늘린다.
		delay = delay * 2; // delay *= =2;
	}

	timerId = setTimeout(request, delay);

}, delay);
```

CPU 소모가 많은 작업을 주기적으로 실행하는 경우에도 `setTimeout` 을 재귀 실행하는 방법이 유용하다. 작업에 걸리는 시간에 따라 다음 작업을 유동적으로 계획할 수 있기 때문이다.

- 중첩 `setTimeout` 을 이용하는 방법은 지연간격을 보장한다.
- `setInterval` 은 이를 보장하지 않는다.

## 두개 비교해보기

`setInterval`

```ts
let i =1 ;
setInterval(funciton() {
	func(i++);
}, 100);
```

두 번째 예시에선 중첩 `setTimeout` 을 이용했다.

```ts
let i = 1;
setTumeout(function run() {
  func(i++);
  setTimeout(run, 100);
}, 100);
```

첫 번째 예시에선, 내부 스케줄러가 `func(i++)` 를 100밀리초마다 실행한다.

- `func` 호출 사이의 지연 간격이 실제 명시한 간격 (100ms)보다 짧아진다.
- 이는 `func`을 실행하는데 '소모되는' 시간도 지연간격에 포함시키기 때문이다.
- 동기적으로 실행 :`func` 의 실행이 종료될때까지 기다렸다가, 실행이 종료되면 엔진은 스케줄러를 확인하고, 지연시간이 지났으면 다음 호출을 바로 시작한다.

두 번째 예시에서는 명시한 지연시간(여기서는 100ms)이 보장된다.
이렇게 지연 간격이 보장되는 이유는 이전 함수의 실행이 종료된 이후 다음 함수 호출에 대한 계획이 세워지기 때문.

> **가비지 컬렉션과 setInterval-setTimeout**
>
> `setInterval` 이나 `setTimeout` 에 함수를 넘기면, 함수에 대한 내부 참조가 새롭게 만들어지고 이 참조 정보는 스케줄러에 저장된다. 따라서 해당 함수를 참조하는 것이 없어도 `setInterval` 과 `setTimeout` 에 넘긴 함수는 가비지 컬렉션의 대상이 되지 않는다.
>
> ```ts
> // 스케줄러가 함수를 호출할 때까지 함수는 메모리에 유지된다.
> setTimeout(function() {...}, 100);
> ```
>
> `setInterval`의 경우는, `clearInterval` 이 호출되기 전까지 함수에 대한 참조가 메모리에 유지된다.
>
> 그런데 이런 동작 방식에는 부작용이 하나 있다. 외부 렉시컬 환경을 참조하는 함수가 있다고 가정해보자. 이 함수가 메모리에 남아있는 동안에는 외부 변수 역시 메모리에 남아있기 마련이다. 그런데 이렇게 되면 실제 함수가 차지했어야 하는 공간보다 더 많은 메모리 공간이 사용된다. 이런 부작용을 방지하고 싶다면 스케줄링할 필요가 없어진 함수는 아무리 작더라도 취소하자.

## 대기 시간이 0인 setTimeout

`setTimeout(func, 0)` 이나` setTimeout(func)` 을 사용하면 `setTimeout`의 대기 시간을 0으로 설정할 수 있다.
이렇게 대기 시간을 0으로 설정하면 `func` `을 '가능한 한' 빨리 실행할 수 있다. 다만, 이때 스케줄러는 현재 실행중인 스크립트의 처리가 종료된 이후에 스케줄링한 함수를 실행한다.

이런 특징을 이용하면 현재 스크립트의 실행이 종료된 '직후에' 원하는 함수가 실행될 수 있게 할 수 있다.

```ts
setTimeout(() => alert("World"));

alert("Hello");
```

예시에서 첫 번째 줄은 '0밀리초 후에 함수 호출하기' 라는 할일을 '계획표에 기록' 해주는 역할을 한다. 그런데 스케줄러는 현재 스크립트의 실행이 종료되고 나서야 '계획표에 어떤 할 일이 적혀있는지 확인'하므로, `Hello` 가 출력되고, `World`는 그다음에 출력된다.

> **브라우저 환경에서 실제 대기 시간은 0이 아니다.**
>
> 브라우저 표준에서는 "다섯 번째 중첩 타이머 이후엔 대기시간을 최소 4밀리초 이상으로 해야한다.
> 예시를 보자.
>
> ```ts
> let start = Date.now();
> let times = [];
>
> setTimeout(function run() {
>   times.push(Date.now() - start); // 이전 호출이 끝난 시점과 현재 호출이 시작된 시점의 시차를 기록
>   if (start + 100 < Date.now())
>     alert(times); // 지연 간격이 100ms 넘어가면 array를 얼럿창에 띄워줌
>   else setTimeout(run); // 지연 간격이 100ms를 넘어가지 않으면 재스케줄링함
> });
>
> // 출력량 예시:
> // 1,1,1,1,9,15,20,24,30,35,40,45,50,55,59,64,70,75,80,85,90,95,100
> ```
>
> 앞쪽 타이머들은 스펙에 적힌 것처럼 지연없이 바로 실행되는데, 다섯 번째 중첩 타이머 이후엔 지연간격이 4밀리초 이상이 되어 다른값이 저장되는 것을 확인할 수 있다.

서버측에서는 이런 제약이 없다.

## 참조

https://ko.javascript.info/settimeout-setinterval

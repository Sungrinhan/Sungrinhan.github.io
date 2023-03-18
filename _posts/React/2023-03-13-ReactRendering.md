---
title: "[React] React Rendering 최적화"
date: 2023-03-13 18:34:SS +/- TTTT
categories: [React]
tags: [react, rendering] # TAG는 반드시 소문자로 이루어져야함!
---

React 렌더링 최적화

## 1. 렌더링

### 1-1) 렌더링이란?

- 화면에 특정한 요소를 그려내는 것
- **렌더링 과정을 잘 처리해 주는 것이** 우리가 Vanilla JavaScript 를 사용하지 않고 UI 라이브러리 or 프레임워크를 사용하는 이유
- VanillaScript 는 DOM 에 직접 접근하고 수정하는 것( **명령형** ), 애플리케이션 규모가 커지면 커질수록 관리 힘듬.
- 개발자들은 애플리케이션에서 보여주고 싶은 핵심 UI를 "선언"하기만 하면 실제로 DOM 을 조작해서 UI 를 그려내고, 변화시키는 일은 라이브러리나 프레임워크가 대신해주는 방식을 찾게 됨. ( <span style="background-color: #fff5b1"><strong>선언적 개발<strong/></span> )

> 이처럼, React는 선언형으로 실제 렌더링 과정은 React에서 대신 처리해주고, 개발자는 UI를 설계하는데만 집중하게 해준다. 하지만 때로는 React 내부에서 처리해주는 렌더링을 최적화 해야되는 상황이 발생함.

이러한 상황에서는 React 내부에서 렌더링이 언제 발생하는지, 어떤 과정을 거쳐서 이루어지는지를 이해하고 있어야 각 과정에서 렌더링을 최적화 할 수 있음!!

### 1-2) 리액트에서 리렌더링이 되는 시점 ( State : 상태 )

- 리액트에서 state 를 사용하는 이유 : UI 와 상태( state ) 를 연동시키기 위함.
- UI는 어떠한 데이터가 있고 그것을 보기 편한 형태로 표현한 것.
- 리액트는 이를 이해해야 하고 UI와 연동되어야 하고, 변할 여지가 있는 데이터들을 state 라는 형태로 사용할 수 있게 해주었음
- 데이터가 변경되었을 때 UI가 그에 맞춰서 변화하기 위해서 state 를 변경시키는 방법을 제한시키고 ( setState ) 이 함수가 호출 될 때 마다 리렌더링이 되도록 설계.

  이런 이유로 인해서 리액트에서 리렌더링이 발생하는 시점은 state가 변했을 때다. 즉, **"state가 변하면 해당 컴포넌트를 포함한 하위 컴포넌트들은 모두 리렌더링 된다"** 라는 _<u>명확한 멘탈 모델을 이해하고 있는것이 리액트를 이용해서 애플리케이션을 설계하고, 최적화하는데 가장 기본이 되는 사항이다!_<u/>

### 1-3) 리액트의 렌더링 과정

state 가 변화되고, 최종적으로 브라우저상의 UI 에 반영되기까지 각 컴포넌트에서는 크게 아래의 4단계를 거치게 된다.

1. 기존 컴포넌트의 UI를 재사용할 지 확인
2. 함수 컴포넌트: 컴포넌트 함수를 호출 / CLass 컴포넌트: `render` 메소드를 호출
3. 2의 결과를 통해서 새로운 VirtualDOM 을 생성.
4. 이전의 VirtualDOM 과 새로운 VirtualDOM 을 비교, 실제 변경된 부분만 DOM 에 적용.

> 일반적인 CRP (Cirtical Rendering Path) :
>
> 1. HTML 을 파싱해서 DOM 을 만든다.
> 2. CSS를 파싱해서 CSSOM 을 만든다.
> 3. DOM 과 CSSOM을 결합해서 Render Tree 를 만든다.
> 4. Render Tree와 Viewport 의 width를 통해서 각 요소들의 위치와 크기를 계산함.(Layout)
> 5. 지금까지 계산된 정보를 이용해 Render Tree 상의 요소들을 실제 Pixel로 그려냄 (Paint)
>
> DOM 또는 CSSOM 이 수정될 때 마다 위 과정을 반복한다.
> -> 따라서 이 과정을 최적화 하는 것이 퍼포먼스상에 중요 포인트!

리액트는 CRP 이 수행되는 횟수를 최적화 하기 위해서 VirtualDOM 을 사용함! ( DOM과 유사한 객체형태로 만들어냄)

UI를 변화하기 위해서는 많은 DOM 조작이 필요. 리액트는 이런 브라우저의 많은 연산과 낮은 퍼포먼스의 향상을 위해 VirtualDOM 이란 개념을 도입.

리액트를 사용하는 개발자가 할 수 있는 최적화는 :

1. 기존 컴포넌트의 UI를 재사용할 지 확인한다.
2. 컴포넌트 함수가 호출되면서 만들어질 VirtualDOM 의 형태를 비교적 차이가 적은 형태로 만들어지도록 한다. 예를들어, `<div>` tag 를 `<span>` 으로 변환시키는 것 보다 `<div className='block' />` 을 `<div className='inline />`으로 변환시키는 것이 VirtualDOM 끼리 비교했을 때 차이가 적은 형태로 만들어지도록 하는 것.

`기존 컴포넌트의 UI를 재사용할지 확인` 하는 법에 대해 자세히 알아보자.

## 2. 기존의 컴포넌트의 UI 를 재사용할 지 판단하는 방법

리액트는 state 가 변할 경우 해당 컴포넌트와 하위의 컴포넌트들을 모두 리렌더링한다.

그런데? state 가 변한 컴포넌트는 당연히 UI 변화가 있겠지만, props 가 변화하지 않은 하위 컴포넌트가 있다면 ? 이런 경우에는 굳이 새롭게 컴포넌트 함수를 호출할 필요없이 이전에 저장되어 있던 결과를 그대로 사용하는 것이 효율적이다!

하지만 UI가 실질적으로 변화되었는지를 매번 리액트가 렌더링 과정에서 일일이 모든 컴포넌트 트리를 순회하면서 검사하는 것은 비효율적.

리액트는 개발자에게 이것을 명시할 수 있는 `React.memo` 함수를 제공하고 이를통해 `기존의 컴포넌트의 UI 를 재사용할 지 판단하는 방법` 을 정해놨다...!

### 2-1) React.memo

```ts
const MyComponent = React.memo(function MyComponent(props) {
  /* render using props */
});
```

React.memo 는 HOC (Higher Order Component) 다.
HOC 란 컴포넌트를 인자로 받아서 컴포넌트를 리턴하는 컴포넌트.
아니 뭐이리 복잡하지 ? 결국 컴포넌트를 감싼 컴포넌트인 것!

```ts
function HOC(Component) {
  /* do something */
  return <Component />;
}
```

이전 컴포넌트의 Props 와 다음 렌더링 때 사용될 Props 를 비교해서 차이가 있을 경우에만 리렌더링을 수행한다. 차이가 없다면 ? 기존 렌더링 결과를 재사용함 (Memoization 이랑 개념이 비슷한거 같기도? )

-> 즉, 컴포넌트에서 불필요하게 리렌더링이 되는 경우를 막을 수 있음 !

> ### Props 를 비교하는 방식
>
> React.memo 는 기본적으로 props 의 변화를 `shallow compare` 함.
> 이러한 기본 비교 로직을 사용하지 않고 비교를 판단하는 로직을 직접 작성하고 싶을 경우를 대비해서, 변화를 판단하는 함수를 두번째 인자로 받을 수 있도록 설정해놨다.
> 판단하는 함수의 return 값이 true, false 인지에 따라 리렌더링 할지를 결정한다.
> 다음은 예시코드다.

```ts
function MyComponent(props) {
  /* render using props */
}

function areEqual(prevProps, nextProps) {
  /*
	true를 return 할 경우 이전 결과를 재사용
	false를 return 할 경우 리렌더링을 수행
	*/
}

export default React.memo(MyComponent, areEqual);
```

예시: https://codesandbox.io/s/react-memo-vzn7ql?file=/src/App.js

### 2-2) 불변성

불변성이란?

- 값이 변하지 않는 것.
- 원시타입은 모두 불변

```ts
let dog = "tori";

dog = "mozzi";
```

변수에 할당된 값을 변경 x, "mozzi" 라는 새로운 string을 만들고 `교체` 하는 식으로 동작한다.
이미 만들어진 원시형 타입을 변경할 수 있는 방법은 없다.

하지만 참조형 타입은 가변함!

```ts
const yeonuk = { name: "yeonuk", gender: "male" };

yeonuk.name = "charlie";
```

- 객체는 여러 타입들을 모아서 만들어진 형태
- 객체 안의 내용물들은 언제든지, 어떤형태로든 변경가능 = 객체가 가변함

자, 그럼 여기서 문제가 뭐냐 ?
자바스크립트는 기본적으로 비교연산자를 수행할 때 해당 데이터의 메모리 주소를 통해서 일치 여부를 판단한다. 안그러면 내용물이 바뀌어도 메모리 주소가 동일하기 때문에 비교가 어렵다.

1. 기존 state 에 참조형(객체) 타입이 선언됨.
2. 안의 내용물이 바뀐다고 해서, 메모리 주소까지 바뀌지 않음.
3. 자바스크립트는 메모리주소를 참조해서 비교하기 때문에 내용물이 바뀐거를 탐지할 수 없음
4. 따라서 새로운 객체를 생성하고, 기존 state 를 복사하는 형식으로 변화를 감지하게 해야함!

실제 객체의 내용물이 같은지 판단하기 위해서는 두 객체 안의 모든 property 들을 순회하면서 일일이 비교해야함. 만약 property 중에 객체가 존재한다면 또다시 해당 객체를 순회해야 하기에 복잡도는 기하급수적으로 늘어남.

### 객체가 가변함의 장점 & 단점

객체를 가변하게 사용하면 이처럼 객체간의 비교를 하기 힘들어진다. 하지만, 한번 선언하고 메모리에 저장해 둔 각체를 계속해서 조금씩만 변경하면서 활용할 수 있기 때문에 **메모리 용량 측면에서는 효율적**이다.

### 객체의 불변함

최근에는 객체를 선언하고 저장하는데 사용할 수 있는 메모리 용량으 늘어남. 즉, 메모리 효율성 보다 객체비교의 편리함을 위해 불변하게 활용하는 방식이 최근에 많다.

한번 만들어진 객체를 수정하지 않는다. 객체의 내용이 변해야 할 경우에는 원시형 타입과 마찬가지로 기존의 객체를 수정하지 않고 새로운 객체를 만든 후 교체하는 방식을 적용한다.

### 2-4) memo 의 잘못된 활용

React.memo 는 기본적으로 props 의 변화를 이전 props 와 새로운 props를 `shallow compare` 해서 판단한다.

props 는 객체 형태로 표현된다. 그리고 props 객체는 매 렌더링마다 새롭게 생성됨 => 따라서 props 객체 자체를 비교하는 것은 의미가 없다.

그렇다면 비교해야 하는 것은 props 객체 안의 각 property 들이다. 따라서 리액트는 props 객체 안의 각 property 들을 `Object.is(===)` 연산자를 통해 비교한다. 이 중 하나라도 false 가 나올 경우 props 가 변경되었다고 판단하고 리렌더링을 수행한다.

```ts
<Component name="foo" hello="world" />

<Component name="bar" hello="world" />

const areEqual = (prevProps, nextProps) => {
	if(prevProps.name !== nextProps.name) return false;
	if(prevProps.hello !== nextProps.hello) return false;

	return true;
}
```

이러한 동작과 데이터 타입에 대해서 제대로 이해하지 않으면 memo를 잘 못 활용하는 상황도 생긴다. 조심하자.
[React.memo 의 잘못된 활용 예](https://codesandbox.io/s/react-memoyi-jalmosdoen-hwalyong-u828v5?file=/src/App.js)

## 3. Memoization

메모이제이션이란 ?

특정한 값을 저장해뒀다가, 해당 값이 필요할 때 새롭게 계산해서 사용하는게 아니라 저장해둔 값을 활용하는 테크닉을 의미.

- 함수 컴포넌트는 근본적으로 함수다.
- 리액트는 매 렌더링마다 함수 컴포넌트를 다시 호출한다.
- 함수는 기본적으로 이전호출과 새로운 호출간에 값을 공유할 수 없다.
- 특정한 함수 호출 내에서 만들어진 변수를 다음 함수 호출에도 사용하고 싶다면, 그 값을 함수 외부의 특정한 공간에 저장해뒀다가 다음 호출 때 명시적으로 다시 꺼내와야 한다.
- 리액트에서는 함수 컴포넌트에서 값을 memoization 할 수 있도록 API 를 제공한다.

### 1. useMemo

값을 memoization 할 수 있도록 해주는 함수.

```ts
// useMemo(callbackFunction, dependencies)

const memoizedValue = useMemo(() => computeExpensiveValue(a,b), [a,b]
```

- 첫번째 인자는 콜백함수, 이 함수에서 리턴하는 값이 메모됨.
- 두번째 인자는 dependencies 배열.
- 주의할점 ; 새로운 값을 만들어서 사용해야 하는 상황임에도, 이전의 결과를 그대로 활용해버리면 버그가 발생가능.
- 방지하기 위해 dependencies 에 의존성을 만드는 것.
- 어디다 저장하는걸까? 공식문서에서는 캐시한다고 나와있다.

### 2. useCallback

- useMemo를 조금 더 편리하게 사용할 수 있도록 만든 버전.
- 일반적인 값들은 useMemo 를 통해서 메모하기 편리
- 함수의 경우에는 콜백함수에서 또다른 함수를 리턴하는 형태가 됨.
- 다음 예시를 보자.

```ts
const memorizedFunction = useMemo(() => () => console.log("hello world"), []);

const memorizedFunction = useCallback(() => console.log("hello world"), []);
```

즉, 메모해야할 값이 간단하다면 useMemo를 , 어떤 함수의 return 값을 메모해야 한다면 useCallback 으로 입력.

# 💡언제 memoization 을 해야할까...

- 명확한 목적 없이 무작정 메모이제이션을 사용하는 것은 오히려 비효율적.
- **새로운 값을 만드는 것과 어딘가에 이전의 값을 저장해두고 메모이제이션 함수를 호출하고 의존성을 비교해서 가져올지 말지 여부를 판단하는 것 중 어떤 것이 비용이 더 적게 들까?**

즉 상황에 따라 다르므로, 개발자의 판단 하에 이루어져야 함.

다음과 같은 상황에 쓰면 좋다.

1.  새로운 값을 만드는 연산이 복잡하다.
2.  함수 컴포넌트의 이전 호출과, 다음 호출 간 사용하는 값의 **동일성을 보장하고 싶다.**

1번의 경우 만약 만개의 요소를 가진 배열이 있다고 생각하면, 이 배열을 매번 생성하는 것 보다는 메모해서 활용하는 것이 효율적.

2번의 경우애는 함수 컴포넌트의 호출 간 값들의 동일성을 보장하기 위해서. WHY? `React.memo` 와 연동해서 사용하기 위함이다.

memo 의 잘못된 활용 예시에서 props 로 전달되는 객체의 동일성이 보장되지 않아 실제 객체의 내용은 똑같아도 shallow compare 를 통해서 다른객체라고 판단되어 매번 리렌더링이 되었다. 이런 상황에서 전달되는 객체의 동일성을 보장하기 위해 메모이제이션을 활용할 수 있음.

메모이제이션 된 객체는 새롭게 만들어진게 아님. 이전 객체를 그대로 활용하는것. 참조하는 메모리주소가 같아 shallow compare에서 동일함을 보장받을 수 있음.

[React.memo + memoization](https://codesandbox.io/s/react-memo-memoization-0dv1z7?file=/src/App.js)

# 언제 최적화를 해야할까..?

최적화를 해야 하는 시기는 이 최적화가 명확히 가치를 창출해낼 수 있을 것이라고 기대되는 상황 즉, 현재의 프로젝트에 성능적인 이슈가 발생했거나, 발생할 가능성이 있고 이를 해결해야 될 필요성이 있는 상황에서 수행하는 것입니다. 만약 내가 최적화를 하고 싶다면 현재 상황을 분석해서 최적화를 해야 하는 이유를 정리하고 이를 관련된 사람들에게 알리고 최적화의 필요성에 대한 공감대가 형성시키고 난 후 최적화를 수행해야 합니다.

## 출처

[React 공식문서 : useMemo](https://react.dev/reference/react/useMemo)

[원티드 프리온보딩](https://pollen-port-115.notion.site/React-Advanced-Hook-b80758fddcd348da971265b10f595cc0)

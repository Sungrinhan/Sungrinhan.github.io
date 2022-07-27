---
title: "[React] Event Capturing, Bubbling"
date: 2022-07-27 15:26:SS +/- TTTT
categories: [React]
tags: [react, capturing, bubbling] # TAG는 반드시 소문자로 이루어져야함!
---

[React] Event Capture, Bubbling 에 대해서...

패스트캠퍼스 React & Redux 과정중에서 생명주기에대해 배우는 중이었다.
이전 class 형 컴포넌트에서, 즉 16.8버전에서 Hook 이 나오기 전에는 이 생명주기가 굉장히 중요했다(지금 안중요하다는 것은 아님)

willmount, update, didmount, unmount 에 대해서 일일히 제어를 해줘야 했었고, 중복코드가 굉장히 많았다고 알게 되었다. 왜 취업 면접에서 이러한 것들에대해 물어보는지 알게되는 계기였다.

그중에서 처음본게 있었는데, `Capture` 와 `Bubbling` 에 대해서다.

## 예시

```ts
export default function Event() {
	return (
		<div onClickCapture={handleClickCapture}>
			<div onClickCapture={handleClickCapture2} onClick={handleClickBubble}>
				<button onClick={handleButtonClick}>Button</button>
			</div>
		</div>
		)
	}
위와 같이 실행했을 때 , 버튼을 클릭하게 되면
1. 부모컴포넌트에서 캡쳐메소드로 인해 `onClickCapture` 가 먼저 실행됨
2. 이후 자식 컴포넌트에서 캡쳐메소드 `onClickCapture` 가 실행됨
3. 이후 최하단에 있는 자식컴포넌트인 버튼에서 `onClick` 이벤트가 실행됨
4. 마지막으로 자식에서 부모컴포넌트로 가는(부모에게 전파되는) `onClick={handleClickBubble}`이 실행됨 Capture -> target -> Bubble 이라고 생각하면 됨.
```

과정을 보자.

부모컴포넌트가 자식컴포넌트에서 무엇이 일어났는지에 대해 확인하는 것이 `Capture` , 자식으로부터 부모컴포넌트까지 전달되는 것을 `Bubbling` 이라고 한다. 캡쳐 -> 버블링 순서로 일어난다고 보면 된다.

## 근데 왜? 이러한 Capture 랑 Bubbling 을 왜 해야될까?

구글에 검색해보니 2015년에도 Stack Overflow 에 관련질문이 올라온게 있었다. 생각보다 오래되었다고 생각이 들었다.

이벤트 핸들러를 만들 때, 그로인한 Side-Effect 또한 생각되야 한다. 나비효과 같이, 어떤 이벤트

### Event Bubbling

JavaScript and its DOM API 에서 기원했다고 한다.

![event bubbling](https://www.robinwieruch.de/static/38fe7473659ab1857f053983442547c2/2bef9/event-bubbling.png)

하위 태그에서 실행 된 이벤트가, 그위 이벤트까지 실행시키면서 버블 효과가 나는것.

이것을 멈추기 위해서는 Stoppropagation 을 써야한다.

`event.stopProppagation()`. 을 이벤트함수에 넣어서, 상위 태그에서 실행되는 버블효과를 멈출 수 있다.

![event stoppropagation](https://www.robinwieruch.de/static/bd9782ed9ff5d35ddf39033cfbbf5eaf/2bef9/event-stoppropagation.png)

### Capturing in React

![event phases](https://www.robinwieruch.de/static/e1154027b337ed2208fb032d4ca50666/2bef9/event-phases.png)

상위태그에서 실행시킨 이벤트가 하위 태그까지 가는경우이다.
document 에서 실행된 이벤트가 하위태그인 버튼까지 가는 경우를 그림으로 표시했다. 이경우에는 상위에 있는 이벤트가 가장먼저 실행되며, 이후 하위컴포넌트(태그) 순으로 이벤트가 실행된다.

## 출처

https://www.robinwieruch.de/react-event-bubbling-capturing/

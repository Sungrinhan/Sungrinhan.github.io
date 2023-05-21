---
title: "[React] 관심사의 분리 & Custom Hook"
date: 2023-03-31 10:01:SS +/- TTTT
categories: [React]
tags: [react, customhook] # TAG는 반드시 소문자로 이루어져야함!
---

관심사의 분리, SRP, Custom Hook

# Clean Code

기능 구현이 급급한 코드...?

나중에 다시보는 경우는 드물다. 만들 때 부터 클린코드로 하는 것이 나의 생각과 마음가짐, 코드의 방향성이 좋아지는 것 같다. 첫 단추를 잘끼워야 되어야지.

### 내가 생각하는 클린 코드.

그런데 좋은 코드, 클린한 코드란 무엇일까? 내가 볼때는 선언적 으로 코드를 짜는 것이 클린한 코드인 것 같다. 즉, 코드가 짧아지고 로직이 단순하기 보다 어떤 함수가 어떤 기능을 하는지 명확하게 해주는게 클린코드인 것 같다.

왜냐? 선언적으로 코드를 작성 할 경우, 협업단계 즉 코드리뷰 시간이 줄어든다. 코드를 파악하는데 시간이 줄어든다 -> 유지보수가 쉬워진다. 시간이 단축됨은 결국 생산성과 관련되어 있는 것이라고 생각한다.

이전에 동기가 얘기해준 [OOP] 객체 지향 5원칙 (SOLID)- 단일책임 원칙이 생각난다.
이것도 이전 블로그에 정리해뒀으니 한번 참고해보자.

> [Sungrin blog 단일책임원칙](https://sungrinhan.github.io/posts/OOP-single-responsibility/)

# Custom Hook

16.8 리액트에서 class 형 컴포넌트 -> 함수형 컴포넌트로 구현이 가능했다.

- 함수 컴포넌트 문법이 더 단순
- 교착상태로 인한 버그가 발생하지 않음
- Custom Hook 의 편리함과 유용성

## React의 관심사

1. UI
2. 로직 (UI를 변경시키는 부분)

이 중 UI는 실제 코드상에서 JSX 혹은 TSX 로 표현됨.
로직은 유저의 입력에 반응, API 호출, 스크린의 변화에 반응하는 등 여러 동작들을 통해서 UI에 영향을 미치는 행위

## React에서 관심사를 분리하는 법: Presentational - Container

- Custom Hook 기법 전에 사용하던 관심사 분리 방법
- Container 는 로직들을 다루는 부분으로 UI에 관여하지 않고 오로지 UI를 구성하고 변화하기 위한 로직에 집중하는 컴포넌트
- Presentational 은 반대로 로직은 상관 x, UI 가 어떻게 구성되어야 하는지에만 집중하는 컴포넌트.
- Presentational 을 Container 로 감싼 후 필요한 정보들과 로직을 모두 props 로 전달해주는 형태로 설계하는 방법.

## 더 나은 관심사 분리법 : Custom Hook

- 커스텀 훅은 리액트가 기본적으로 제공해주는 훅들( useState, useEffect 등) 이용해서 만든 함수

간단한 예제 코드를 보자.

```ts
// 기본 컴포넌트 즉 tsx 확장자 파일
export default function App() {
  const [isLightMode, changeMode] = useToggle(true);

  return (
    <>
      <h1
        style={%raw%}{{
          backgroundColor: isLightMode ? "white" : "black",
          color: isLightMode ? "black" : "white",
        }}{%endraw%}
      >
        current mode: {isLightMode ? "Light Mode" : "Dark Mode"}
      </h1>
      <button onClick={changeMode}>change mode</button>
    </>
  );
}

// 상태를 변경해주는 함수. custom hook으로 분리하였다. 그랬더니 위에처럼 한줄로 표현이 딱되었다.
// 그리고 어떤 기능을 하는 함수를 담은 hook인지도 잘 알수 있게 선언적 표현이 되었다.
//
const useToggle = (defaultValue) => {
  const [toggle, setToggle] = useState(defaultValue);

  const changeToggle = () => {
    setToggle((prev) => !prev);
  };

  return [toggle, changeToggle];
};
```

## 출처

원티드 프리온보딩

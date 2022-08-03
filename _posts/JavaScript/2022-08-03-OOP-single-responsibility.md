---
title: "[JS][OOP] 객체지향 5원칙(SOLID)- 단일 책임 원칙 (Single Responsibility Principle)"
date: 2022-08-03 15:41:SS +/- TTTT
categories: [JavaScript]
tags: [javascript, oop] # TAG는 반드시 소문자로 이루어져야함!
---

# [OOP] 객체지향 5원칙(SOLID)- 단일 책임 원칙 (Single Responsibility Principle)

## 객체지향 5원칙

올바른 객체지향 설계를 위해 수립한 원칙이 있으며, 이 다섯 가지 원칙을 통틀어 객체지향 5원칙(SOLID) 이라 명명한다.

- 필수는 아니다.
- 적어도 이 규칙을 준수하면 준수할 수록 올바르게 설계된 객체지향이라 할 수 있다.

1. 단일 책임 원칙 (Single Responsibiity Principle)
2. 개방-폐쇄 원칙 (Open-Closed principle)
3. 리스코프 치환 원칙 (Liskov Substitution Principle)
4. 인터페이스 분리 원칙 (Interface Segregation Principle)
5. 의존성 역전 원칙 (Dependency Inversion Principle)

각 원칙의 영어 앞글자를 따서 SOLID 원칙이라고도 한다.

## 단일 책임 원칙

단일 책임 원칙이란 하나의 객체는 반드시 하나의 동작만의 책임을 갖는다는 원칙이다.

모듈화가 강해질수록 다른 객체와의 의존/연관성이 줄어든다. 반대로 이야기하면 모듈화가 약해질수록 다른 객체와의 의존/연관성은 크게 늘어나며, 최악의 경우 어떠한 은닉화 정책도 존재하지 않아 모듈의 메소드에 무분별하게 접근할수도 있게된다.

객체가 담당하는 동작, 즉 책임이 많아질 수록 해당 객체의 변경에 따른 영향도의 양과 범위가 매우 커진다. 단일 책임 원칙은 특정 객체의 책임 의존성 과중을 최대한 지양하기 위한 원칙.

내가 궁금한 점은 다음과 같다. 실제 코드로 확인해보자.

```tsx
// 미출고 목록 table 에서 Columns 을 만드는 컴포넌트

const makeCheckNoneExportListsColumns = (
  handleClickOrderProcessState,
  UserListsOfCenterForColumn,

  setIsProductOrderDetailModalVisible,
): ColumnsType<ProductOrderInfo> => {
  const NoneExportLists = useAppSelector((state) => state.order.NoneExportLists);

// 문제의 코드 시작. 버튼을 클릭했을 때 모달을 띄우는 함수다.
  const handleOpenProductOrderDetailModal = useCallback(
    (list) => () => {
      setIsProductOrderDetailModalVisible(true);
    },
    [NoneExportLists],
  );
```

버튼을 클릭하는 함수를 만들 때 였다.

내가 생각했을 때는 버튼을 클릭했을때 → 동작하는 함수를 모두 넣어서 관리하는 것이 편하다고 생각했다.

동기분의 생각은 달랐다. 클릭했을 때 동작하는 setModal 함수만 하나 집어넣고, 그 값이 변경되었을 때 list 를 받아오는 함수를 따로 작성하는 것이 단일책임 원칙에 더 부합하다 라고 생각했다.

예를 들어

```tsx
useEffect(() => {
	리스트를 받아오는 함수
}, [IsProductOrderDetailModalVisible])
```

와 같이, setModal 값이 변경되었을 때 list 를 받아오게 만드는 것이 더 좋다고 하였다.

## 코드로 보는 단일 책임 원칙

자동차는 휠의 구동 특성에 따라 전륜(FWD), 후륜(RWD), 사륜(AWD)로 나뉘며, 그 특성은 아래와 같다.

- 전륜 구동인 경우 앞의 두 바퀴에만 동력을 전달한다.
- 후륜 구동인 경우 뒤의 두 바퀴에만 동력을 전달한다.
- 사륜 구동인 경우 전체 바퀴에 동력을 전달한다.

이를 객체로 구현해 보면 다음과 같다.

```tsx
class Car {}
```

위와 같이 `Car` 객체 안에 FWD, RWD, AWD 에 대한 함수를 넣을 수 있다.

Car 는 생성 시 파라미터로 휠 구동방식을 받는다.

Car 에는 주행 동작을 구현하는 `run()`메소드가 있다. 이 메소드는 파라미터로 동력을 받는다.

- 휠의 구동 방식 별 동작이 하나의 책임
- Car 객체가 짊어지는 책임은 무려 세가지
- 프로젝트에서 해당 객체의 의존성이 높아지게 됨 → 객체지향의 주요 특징 중 하나인 캡슐화를 정면으로 부정함!
- 각자의 코드가 서로 의존될 경우, 코드 수정에 따른 영향도 역시 높아지고, 범위또한 넓어진다.

단일 책임 원칙은 바로 이와 같은 상황을 방지하고자 수립된 원칙

1객체 = 1책임 으로 최대한 객체를 간결하고 명확하게 설계할 것을 요구함.

이를 해결하려면 어떻게 해야할까?

```tsx
abstract class Car {}
```

우선 공통된 인터페이스 내지는 상귀 객체를 구현할 필요가 있다. 이 객체의 경우, 생성자가 필요 → 인터페이스 보단 상위 객체가 적합(Class 형으로 만들기)

`run()` 메소드는 휠 구동 타입에 따라 동작이 달라짐 → abstract 지시자를 통해 추상 메소드로 선언한다. 해당 객체의 인스턴스를 생성하거나, 상속받는 객체가 직접 구현하게 될 것!

```tsx
class FrontWheelCar extends Car {}

class RearWheelCar extends Car {}

class AllWheelCar extends Car {}
```

전륜, 후륜, 사륜에 해당하는 객체를 생성한다. 이 세 객체는 모두 `Car` 에 포함되므로, `Car`를 상속받아 구현한다.

→ 각 객체의 run() 메소드에 동작을 구현함으로써, 각각의 객체가 하나의 책임을 가지게 됨!

## 정리

하나의 객체/ 메소드에 한가지보다 많은 책임을 할당하는 경우, 다른사람이 보았을 때 이 함수가 어떤 작용을 하는건지 명확히 파악하기가 어려운 것 같다.

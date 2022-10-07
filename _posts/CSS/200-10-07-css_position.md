---
title: "[CSS] CSS Position(relative, absolute)"
date: 2022-10-07 14:51:SS +/- TTTT
categories: [CSS]
tags: [css, position, relative, absolute] # TAG는 반드시 소문자로 이루어져야함!
---

# CSS Position

- `position` 속성을 통해 **문서 상에 요소를 배치하는 방법**을 지정한다.
- `top, right, bottom, left` 속성을 통해 **요소의 최종 위치**를 결정한다.
- 사용법은 간단함.
  1.  기준을 잡는다. (ex. `position: relative`)
  2.  기준점으로부터 이동시킨다. (ex. `left: 30px`)

## Position property

> 요소를 옮기려면 일단 위치를 옮길 **기준점**을 잡는다.

| 값           | 의미                            |
| ------------ | ------------------------------- |
| **static**   | 기준없음(배치불가능 / 기본값)   |
| **relative** | 요소 자기 자신을 기준으로 배치  |
| **absolute** | 부모(조상) 요소를 기준으로 배치 |
| **fixed**    | viewport 기준으로 배치          |
| **stickey**  | scroll 영역 기준으로 배치       |

### Top, Botoom, Left, Right property

> 기준점을 잡으면 위의 네 가지 속성을 이용해서 요소의 위치를 옮길 수 있음.

---

## 1-1. Relative

> 요소를 일반적인 문서 흐름에 따라 배치.
> 요소 자기 자신의 원래 위치(static 일 때의 위치)를 기준으로 배치한다.
>
> - 위치를 이동하면서 다른 요소에 영향 x
> - 문서 상 원래 위치가 그대로 유지됨.

## 1-2. Absolute

> 요소를 일반적인 문서 흐름에서 제거함.
> 가장 가까운 위치에 있는 조상 요소를 기준으로 배치.
>
> - 조상중 Position을 가진 요소가 없다면 초기 컨테이닝 블록(`<body>` 요소)를 기준으로 함.(static 제외)
> - 문서 상 원래 위치를 잃어버림 (아래에 있는 div 가 해당 자리를 차지함)

## 언제사용할까?

요소를 겹치려고 할 때 사용했다.
일반적으로 태그가 바뀌는 경우는, 요소를 겹치게 하기가 쉽지 않다.
겹치게 하고 싶은 요소에 `position:absolute ` 를 넣고, 기준점을 바로 부모조상에 하면, 부모조상 기준에서 원하는 위치로 보낼 수 있다. (top, bottom, left, right)
부모 요소가 꼭 relative 일 필요는 없다. static 을 제외한 `position` 이 있다면 , 그 부모(조상) 요소가 기준점이 된다. 하지만 보통은 부모요소를 기준점으로 잡는 경우가 많았다.

참고

---

https://creamilk88.tistory.com/197

---
title: "[React] Konva React delete Shapes from Stage(Stage에서 Shape 지우기)"
date: 2022-12-28 15:44:SS +/- TTTT
categories: [React]
tags: [react, konva] # TAG는 반드시 소문자로 이루어져야함!
---

# Konva 에서 클릭한 Shape 지우기

해당 Shape , 혹은 Shape 를 감싸고 있는 Layer, Group, Stage 에서, onClick 이벤트를 활용한다.

예를들어, 클릭이벤트로 currentShape 을 가져오는게 가능하다.

```ts
// 실제 사용하는 코드
// StageSize 는 내가 emotion 으로 만든거다. konva에서 <Stage> </Stage> 이다.
const StageSize=styled(Stage)`
  border: 1px solid black;
`

<StageSize
	width={screenWidth}
	height={screenHeight}
	visible={true}
	ref={stageRef}
	onClick={(e) =>  console.log('Stage Clicked', e)} // 나의 경우 stage 에 이벤트를 넣었다.
>
<Layer>
	{shapes.map((shape, i) => {
		return (
			<Group  key={i} draggable  onClick={(e) =>  handleTarget(e.target)}>
			{shape}
			</Group>
		);
	})}
</Layer>

---



```

- onClick 이벤트로 가져온 익명함수로 `e.target` 이 currentShape 이 되겠다.
- stage 에서 지우는 메소드가 있다. `destroy()`
- 컨트롤 함수를 만들어, `e.target.destroy()` 를 하면 stage 에서 해당 모양이 사라진다.

출처

---

[konva 공홈](https://konvajs.org/docs/sandbox/Canvas_Context_Menu.html)

---
title: "[React] Konva React "
date: 2022-12-26 15:16:SS +/- TTTT
categories: [React]
tags: [react, konva] # TAG는 반드시 소문자로 이루어져야함!
---

# Konva-react 버튼 클릭으로 stage 에 shape 추가하기

### Add Shapes Konva React

To add shapes to a stage in Konva using React when a button is clicked, you can use a combination of the `useState` hook to manage the state of the shapes on the stage, and the `onClick` event handler to specify the action that should be taken when the button is clicked.

Here is an example of how you can do this:

```ts
import { Stage, Layer, Rect, Button } from "react-konva";

function App() {
  const [shapes, setShapes] = useState([]);

  const handleButtonClick = () => {
    setShapes([
      ...shapes,
      {
        type: "rect",
        x: 20,
        y: 20,
        width: 50,
        height: 50,
        fill: "red",
        shadowBlur: 5,
      },
    ]);
  };

  return (
    <div>
      <Button onClick={handleButtonClick}>Add Shape</Button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {shapes.map((shape, index) => {
            if (shape.type === "rect") {
              return (
                <Rect
                  key={index}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  shadowBlur={shape.shadowBlur}
                />
              );
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
}
```

In this example, the `handleButtonClick` function is called when the button is clicked, and it adds a new shape object to the `shapes` state array. The shape object contains the properties for a rectangle shape. The `shapes` array is then mapped over and rendered on the stage using the `<Rect>` component.

You can adjust this example to add other types of shapes to the stage by adding additional `if` statements in the `map` function and using the appropriate shape components provided by Konva.

For more information and examples, you can refer to the Konva documentation: [https://konvajs.org/docs/react/index.html](https://konvajs.org/docs/react/index.html)

### Delete Shapes with React Konva

To delete a shape from the stage in react-conva, you can use the `remove` method of the `Stage` object. Here is an example of how you can do this:

```ts
import { Stage, Layer, Rect } from "react-konva";

function MyComponent() {
  const stageRef = useRef(null);

  const handleDelete = () => {
    const stage = stageRef.current;
    const shape = stage.findOne("#myShape");
    shape.remove();
  };

  return (
    <Stage ref={stageRef}>
      <Layer>
        <Rect id="myShape" x={50} y={50} width={100} height={100} fill="red" />
      </Layer>
      <button onClick={handleDelete}>Delete Shape</button>
    </Stage>
  );
}
```

In this example, we have a `Rect` shape with the ID "myShape" that we want to delete. When the user clicks the "Delete Shape" button, the `handleDelete` function is called. This function gets a reference to the `Stage` object using the `stageRef` ref, and then uses the `findOne` method to find the shape with the ID "myShape". Finally, it calls the `remove` method on the shape to delete it from the stage.

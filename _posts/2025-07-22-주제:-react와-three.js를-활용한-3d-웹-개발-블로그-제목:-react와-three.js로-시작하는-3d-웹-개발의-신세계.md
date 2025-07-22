---
layout: post
title: "주제: React와 Three.js를 활용한 3D 웹 개발 

블로그 제목: React와 Three.js로 시작하는 3D 웹 개발의 신세계"
date: 2025-07-22 13:45:33
categories: 프론트엔드
tags: 주제:
---

# React와 Three.js로 시작하는 3D 웹 개발의 신세계

얼마나 많은 웹 개발자들이 3D 웹 개발에 대해 충분히 알고 있을까요? 또는 얼마나 많은 웹 개발자들이 3D 웹 개발에 관심을 갖고 있을까요? 그 수는 상당히 제한적일 것입니다. 그 이유는 주로 3D 웹 개발이 글로벌 수준에서 아직 산업 표준이 정착되지 않았기 때문입니다. 하지만, 최근에 바뀌는 추세에 주목해보면, 3D 웹 개발은 향후 웹의 핵심 기술 중 하나가 될 것으로 보입니다. 그 중에서도 React와 Three.js는 이러한 3D 웹 개발에 큰 역할을 하고 있습니다.

## React와 Three.js란?

React는 페이스북이 개발한 자바스크립트 라이브러리로, 사용자 인터페이스를 구성하기 위해 사용됩니다. 특히, 상태가 변경될 때마다 일정한 간격으로 렌더링되는 함수 컴포넌트를 사용하면서, 웹 개발에서의 선언형 프로그래밍을 가능하게 해 줍니다.

Three.js는 WebGL과 같은 복잡한 3D 그래픽스 API를 추상화하여 사용자 친화적인 방법으로 3D 웹 개발을 할 수 있게 해주는 자바스크립트 라이브러리입니다.

## 실제 코드 예시

이제 React와 Three.js를 결합하여 간단한 3D 객체를 생성하는 웹 페이지를 만들어 보겠습니다. 우선, React 프로젝트를 만든 후에 Three.js 라이브러리를 설치해야 합니다.

```bash
npx create-react-app my-3d-web
cd my-3d-web
npm install three
```

그리고나서, Three.js를 이용하여 3D Scene을 생성하고, 그 안에 Cube Geometry와 Basic Material을 사용하여 Cube Mesh를 만드는 코드를 작성하면 됩니다.

```jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function My3DComponent() {
  const refDiv = useRef(null);
  
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    camera.position.z = 5;
    
    const animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
 
    renderer.setSize(window.innerWidth, window.innerHeight);
    refDiv.current.appendChild(renderer.domElement);
    animate();
  }, []);
  
  return (
    <div ref={refDiv} />
  );
}

export default My3DComponent;
```

이 코드를 살펴보면, useEffect Hook 내에서 Three.js를 사용하여 Scene, Camera, Renderer를 초기화하고, 3D Cube를 생성하고, 이를 Scene에 추가한 다음, 매 프래임마다 Cube를 회전시키는 animation 함수를 실행합니다.

## 실무에서 활용하기

실무에서는 어떻게 활용할 수 있을까요? 예를 들어, 제품을 소개하는 웹 사이트에서, 사용자가 제품의 3D 모델을 회전시키며 상세히 볼 수 있게 하거나, 건축물의 완성 예측 이미지를 보여주는 데 사용할 수 있습니다. 또는 3D 게임같은 복잡한 그래픽스 애플리케이션을 만드는 데도 사용될 수 있습니다.

## 응용 버전 예시

기본적인 3D 객체를 다루는 방법을 배웠으니 이제 조금 더 발전된 기능, 예를 들면 텍스처를 로딩하거나 다른 모델 형식을 가져오는 등의 기능을 도입해 보겠습니다. 이를 위해 Three.js에는 다양한 로더가 제공되고, 이를 활용하면 복잡한 3D 모델이나 텍스처를 쉽게 사용할 수 있습니다.

React와 Three.js를 조합하면 복잡한 3D 웹 개발도 상대적으로 간단하게 처리할 수 있기 때문에, 웹 개발자라면 한 번쯤은 시도해보실 만한 도전 과제일 것입니다. 반복적인 화면 코딩에서 벗어나, 3D로 표현된 새로운 세계를 만들어보실 준비가 되셨나요?

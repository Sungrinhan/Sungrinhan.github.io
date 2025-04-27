---
layout: post
title: "React-Router를 이용한 싱글 페이지 어플리케이션 구현

블로그 제목: React-Router 활용 가이드: 싱글 페이지 어플리케이션 구현하기"
date: 2025-04-27 10:46:25
categories: 프론트엔드
tags: React-Router를
---

# React-Router 활용 가이드: 싱글 페이지 어플리케이션 구현하기

React-Router는 React를 함께 사용할 수 있도록 설계된 유연하고 강력한 라우팅 라이브러리입니다. 클라이언트 사이드 라우팅을 지원함으로써 페이지 간의 이동이 서버와의 새로운 요청 없이 이루어지는 싱글 페이지 어플리케이션을 구축하기에 최적화되어 있습니다.

React-Router는 URL의 변화를 감지하고 URL에 따라 다른 컴포넌트를 렌더합니다. 이에 따라 사용자는 페이지를 새로고침하지 않고도 애플리케이션의 다른 부분을 볼 수 있습니다. 이것이 싱글 페이지 어플리케이션의 중요한 특성인데요, 이를 통해 사용자 경험은 획기적으로 향상됩니다.

이해를 돕기 위해 간단한 코드 예시를 살펴봅시다.
```jsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
      </Switch>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

ReactDOM.render(<App />, document.getElementById("root"));
```
위 예시에서 `BrowserRouter` 컴포넌트는 라우터로서의 기능을 제공하며, 앱의 최상위 컴포넌트로 위치해야 합니다. `Switch` 컴포넌트는 여러 `Route` 중 단 한개의 `Route`만을 렌더하게 합니다. 여기서 `Route`의 `path`는 URL 경로를, `component`는 해당 경로에 렌더될 컴포넌트를 명시합니다. 그래서 `/` 경로에선 `Home` 컴포넌트가, `/about` 경로에선 `About` 컴포넌트가 렌더됩니다.

실무에서는 페이지 규모가 훨씬 크기 때문에 라우터 구조를 보다 체계적으로 관리해야 합니다. 이럴 때 사용하는 패턴 중 하나는 각 페이지 별로 별도의 디렉터리를 두고 이 안에 해당 페이지에서만 쓰이는 컴포넌트와 페이지 컴포넌트를 함께 둡니다. 이렇게 하면 페이지 관련 코드를 한 곳에서 관리할 수 있어 유지보수에 유리합니다.

더욱 응용하려면 비동기 로딩이 가능한 코드 스플리팅을 통해 초기 로딩 시간을 줄일 수 있습니다. React-Router는 `React.lazy`와 함께 사용할 수 있어 이를 활용하면 상황에 따라 필요한 코드만 로드할 수 있습니다.

```jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
```

단, 위와 같이 비동기 로딩을 사용하면 JS 번들이 분리되어 네트워크 요청이 추가로 발생하므로, 사용자가 방문할 확률이 높은 중요한 페이지는 코드 스플리팅을 적용하지 않는 것이 좋습니다. 이를 통해 초기 로딩 속도를 향상시킬 수 있습니다. 

이처럼 React-Router는 싱글 페이지 어플리케이션을 효과적으로 구현할 수 있도록 도와줍니다. 다만 강력한 도구임에도 불구하고, 그 이면에는 복잡한 고려사항들이 있습니다. 이에 적절한 아키텍처와 섬세한 코드 조직을 통해 이를 극복할 수 있습니다. 이 글을 통해 React-Router의 기능을 이해하고 이를 활용한 싱글 페이지 어플리케이션 구현에 한발짝 가까이 다가가셨길 바랍니다.

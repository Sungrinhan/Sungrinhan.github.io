---
title: "[Next Deep Dive][Routing 기초 (3)] Intercepting Routes"
date: 2023-08-06 22:24:SS +/- TTTT
categories: [NextJs]
tags: [nextjs, interceptingroutes] # TAG는 반드시 소문자로 이루어져야함!
---

# Intercepting Routes

현재 페이지의 컨텍스트를 유지하면서 현재 레이아웃 내에서 route 를 로드할 수 있다. 이 라우팅의 패러다임은 특정 경로를 "가로채" 다른 경로를 표시하려는 경우에 유용하다.

![](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fintercepting-routes-soft-navigate.png&w=3840&q=75&dpl=dpl_BcpSQQ3frqqXQsrdgEjeww6HyJ7W)

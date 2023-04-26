---
title: "[Nextjs/Image] Next에서 Imgae 태그"
date: 2022-07-19 11:30:SS +/- TTTT
categories: [NextJs, Image]
tags: [nextjs, image] # TAG는 반드시 소문자로 이루어져야함!
---

# Next `<Image>` 태그에 대해서

내가 만든 컴포넌트에는 이미지 업로드 내용이 있다. `<img>` 태그를 사용하려 했으나 ? next 에서 import 해온 `next/image` 의 `<Image>` 태그를 사용하라고 알려준다. 그 이유는 next 에서는 이미지를 최적화 시켜주기 때문이다.

## Why Image tag?

- Loader 을 통해서 url을 커스터마이징 할 수 있다.
- 자동으로 Lazy Loading 을 통해 이미지 최적화를 지원해준다. pre loading 을 원하는 경우 취소할 수 있다.
- 자동 스켈레톤 UI(placeholder 통해서) CLS 방지도 가능하다.
- 이미지 캐싱도 자동으로 해주고 , expiration time 설정도 가능하다.
- next.config.js 를 통해 지정된 곳에서만 이미지를 받아오며 앱 보호가 좋다.

어떤 props 를 필수로 받고, optional 한 props 에는 어떤것들이 있을까?

## essential props

1. src
   - 정적 import 된 이미지 파일
   - 외부 url ( next.config.js 의 domain에 추가해 두어야 해당사이트에서 이미지를 받아올 수 있음)

```ts
const  nextConfig  = { // nextConfig 에 대해 도메인 설정은 필수
images: {	// 설정을 안하면 이미지가 뜨질 않음!!
domains: [
'modument-openmarket-icon.s3.ap-northeast-2.amazonaws.com',
'modu-company-document.s3.ap-northeast-2.amazonaws.com',
'modument-wms-img.s3.ap-northeast-2.amazonaws.com',
],
}.
```

2. width, height
   - layout 이 fill 또는 정적으로 import 해오는 이미지의 경우를 제외하고는 모두 필수로 지정!
   ```ts
   <Image  src={imgUrls.pcsUrl} alt="avatar"  width={'320'} height={'210'} />
   //혹은
   <Image  src={imgUrls.pcsUrl} alt="avatar" layout='fill' />
   ```

## optional props

1. layout

   - 앞서 설명한것 처럼 이미지를 '**뷰포트 기준**'으로 어떤 사이즈로 출력할지 지정하게 됨
   - `intrinsic` 은 default 값으로 container 의 width 에 fit 하게 축소시킴.
   - layout 이 `responsive ` 나 `fill` 인 경우를 사용하기 위해 부모 요소에 따로 설정이 필요하다. 요고 중요!!
     - responsive: `display: block`
     - fill: `position: relative`

2. loader

   - URL 을 커스텀할 수 있는 함수를 가질 수 있다. loader 의 경우 src, width, quality 를 props 로 받아 url에 포함시킨 후 return 하게 됨.

3. quality

   - 1부터 100 사이 숫자를 지정가능, 숫자는 높이질수록 높은 퀄리티
   - default 는 75

4. priority
   - next/image 의 장점은 LazyLoading 을 자동 지원한다는 것. 하지만 Lazy Loading 을 사용할 필요가 없는 경우는 priority 를 true 로 함으로 lazy loading을 취소시킬 수 있다.
   - Priority 는 LCP(Largest Contentful Paint)와 관련있다. LCP란 사용자가 화면에 렌더링 되는 콘텐츠를 보기까지 얼마나 시간이 걸리냐를 말함. 즉 , LCP가 발생하면 응답시간이나 리소스 로드 시간이 느리다고 판단. 그러면 언제 사용해야 될까? pre-loading 이 필요한 경우, 예를 들어 KV인 경우가 가장 대표적이라고 볼 수 있다.

> Lazy Loading 은 무엇인가?
>
> 성능을 개선하고, 시스템 리소스를 절약하는데 도움을 준다.
> 실제로 필요할 때까지 리소스 또는 개체의 로드나 초기화를 지연하는 것이다.
> 예를 들어 웹페이지에서 사용자가 이미지를 보기위해 아래로 스크롤 해야 하는 경우, 사용자가 해당 위치에 도착한 경우에만 이미지를 지연로드 할 수 있다.
>
> - **초기 로딩 시간 단축** - 웹 페이지를 지연로드하면 한번에 로드해야 하는 페이지 무게가 줄어들어 초기 속도가 빨라진다.
> - **대역폭 보존** - 지연로딩은 요청된 경우에만 사용자에게 컨텐츠를 제공하여 대역폭을 절약한다.
>   **시스템 리소스 보존** - 지연 로딩은 이미지, JavaScript 및 기타 코드 중 일부만 실제로 렌더링 하거나 실행하기 때문에 서버와 클라 리소스를 모두 절약한다.
>   ![처음 로드될 때와 전체 페이지가 로드된 후 지연 로드](https://www.imperva.com/learn/wp-content/uploads/sites/13/2019/01/Lazy-Loading-2.jpg.webp)

> Largest Contentful Paint 는 무엇인가?
> LCP 는 페이지에서 가장 큰 콘텐츠 요소가 방문자의 뷰포트에 표시되는데 걸리는 시간을 측정한다.

5. placeholder
   - image가 로딩되기 이전에 상태를 지정가능하고, blur, empty 중 설정 가능
   - empty(default) 인 경우, 그냥 빈 space 를 보여주지만, blur을 설정한 경우 `blurDataURL` 을 통해 정적/ 동적 이미지 지정이 가능! 이미지는 10px 이하의 사이즈를 추천, 로딩이 성공적으로 되기 이전까지 보여줌!

## 스타일링 방식! (제일 힘들었던 부분...)

내가 원하는 사이즈를 조정하기가 매우 힘들었다.
next/image 자체에서 default 로 지정된 스타일이 있는데 그것이 우선반영되다보니 조작하기가 매우 힘들었다.

해결방법으로는 다음과 같다.

1. styled.component 내부에 스타일링을 해주되, 제대로 반영되지 않는 경우 `!important`를 사용하여 스타일링에 우선순위를 부여. 하지만 side effect가 발생할 수 있기 때문에 유의.
2. next/image 를 `<span>` 으로 감싼 후 부모요소에 className 을 지정해줌, 그 후 css를 통해 스타일링을 해줄 수 있음.

심지어 width, height 의 경우 픽셀만되고 %는 되지 않아서 적용하기 어려웠다.

imageLoader 에서 src, width, quality 를 받아 원하는 url 로 변환시켜 반환한다.

```ts
const myLoader = ({ src, width, quality=75} ) => {
	return `https://example.com/${src}?w=${width}&q=${quality}``
}
```

## Dummy Image Generator (2023-04-26 내용추가)

최근 내 블로그를 보고 Dummy Image Generator 를 추천해준 친구가 있다. 메일까지 보내준 것을 보면 고마운 친구다.

### Dummy Image Generator 란?

웹사이트 혹은 랜딩페이지를 생성할 때, 이미지가 아직 준비가 되지 않으면 placeholders 로 더미 이미지를 사용할 수 있다. 즉, 좋은 사용자 경험을 유지시키기 위해 쓰는 더미 이미지인 것이다.

나같은 경우, api 요청이 끝나고 paint 단계가 이루어지기 전까지는 skeleton 으로 보여줬는데 이때 같이 사용하면 좋을 것 같다.

## 참조

https://velog.io/@joy37/NextImage%EC%97%90-%EB%8C%80%ED%95%B4-%EC%96%BC%EB%A7%8C%ED%81%BC-%EC%95%8C%EC%95%84
[Next.js](https://nextjs.org/docs/api-reference/next/image#required-props)

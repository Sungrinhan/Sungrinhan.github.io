---
title: "[JS][Library] JSBarcode, html2canvas, jsPdf를 사용하여 pdf 다운로드 하기"
date: 2022-11-29 14:45:SS +/- TTTT
categories: [JavaScript]
tags: [javascript, jsbarcode, html2canvas, jspdf] # TAG는 반드시 소문자로 이루어져야함!
---

# JsBarcode, JsPdf + html2canvas Next(react) 에서 사용하기

## 사용하게 된 계기

고객사에서 입고시키는 물품들에 대해서 간단히 확인할 수 있는 입고 라벨지를 만들어야 했다.
양식은 다음과 같다.

![입고라벨양식](../../assets/img/%EC%9E%85%EA%B3%A0%EB%9D%BC%EB%B2%A8%EC%96%91%EC%8B%9D.png)

고객은 위 라벨을 pdf 로 다운받을 수 있어야 한다.

![테이블에 입고라벨](/assets/img/%ED%85%8C%EC%9D%B4%EB%B8%94%EC%97%90%EC%9E%85%EA%B3%A0%EB%9D%BC%EB%B2%A8.png)
위 pdf 그림 클릭하면 다운이 되어야 한다.

내가 생각한 로직은 다음과 같다.

1. 기본 양식을 html로 작성한다.
2. 상품코드, 회사명, 입고주문번호는 api로 받아온다.
3. 받아온 상품코드, 주문번호는 바코드도 같이 출력한다.
4. html로 작성된 내용을 html2canvas 로 이미지파일로 변경한다.
5. 변경된 img file 을 jspdf 통해서 pdf로 보거나 다운받을 수 있게끔 한다.

어떻게 했는지 알아보자.

## 1. 입고 양식 만들기

입고 양식부터 만들기로 했다. html 로 작성해야 되고, 프린트 할 수 있는 a4 크기로 만들기로 했다.

```ts
// a4 용지 크기를 기준으로 css 를 적용했다.
.div_paper {

height: 842px;
width: 595px;

margin: 30px;
background-color: white;
text-align: center;
display: flex;
justify-content: center;
align-items: center;
font-size: 20px;
font-weight: 700;
}
```

## 2. 바코드 만들어서 입고양식에 넣기( jsbarcode )

우선 jsbarcode 를 받아보자.

```ts
npm i jsbarcode --save
```

기본적인 사용방법은 다음과 같다.

```ts
const BarcodeItemScreen = () => {
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, barcodeNumber, { height: 50, displayValue: false });

    setImageUrl(canvas.toDataURL("image/png"));
  }, []);

  // 이후에 img 태그에 위에서 저장한 dataUrl 을 src에 넣어줌.
  return <div>{imageUrl && <img src={imageUrl} />}</div>;
};
```

- canvas 를 사용하기 위해 `<canvas>` 엘리먼트를 만들어 준다.
- jsBarcode()함수를 통해 바코드를 만든다.
  - `canvas`: 위에서 정의한 `<canvas>` 엘리먼트
  - `barcodeNumber`: 바코드로 변경할 문자
  - `{height, width, displayValue, format:'CODE128', fontSize}` : 만드는 바코드의 option 을 설정할 수 있음!
    > - 더 많은 옵션은 깃헙에서 확인 가능 [jsBarcode github](https://github.com/lindell/JsBarcode/wiki/Options)
- image/png 파일 형식으로 dataurl 을 imageUrl 에 저장한다.

## 3. html 을 canvas(이미지파일)로 변경 후 pdf 만들기 ( html2canvas -> jspdf)

```ts
npm i html2canvas --save

npm i jspdf --save
```

더 많은 정보는 공식 홈페이지에서 확인이 가능하다.

> [html2canvas 공식 홈페이지 ](https://html2canvas.hertzen.com/) > [jsPDF 홈페이지](https://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html)

pdf로 만들어 주는 ts 파일을 생성했다.

```ts
// makePdf.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const makePdf = (labelInfo) => {
  const converToImg = async () => {
    // html 을 imgFile 로
    const paper: any = document.querySelector(".div_container > .div_paper");
    const canvas = await html2canvas(paper, { scale: 4 });
    const imageFile = canvas.toDataURL("image/png", 1.0);

    return imageFile;
  };

  const converToPdf = (imageFile) => {
    // 이미지file 을 pdf 로
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.addImage(imageFile, "JPEG", 0, 0, pageWidth, pageHeight);

    // 저장하기
    const custDate = labelInfo.custDate;
    const orderNumber = labelInfo.custNo;
    const itemCd = labelInfo.itemCd;
    doc.save(`${custDate}_${orderNumber}_${itemCd}_모두먼트_입고라벨.pdf`);

    // 웹뷰어로 pdf 파일 보여주기
    // window.open(doc.output('bloburl'));

    const pdf = new File([doc.output("blob")], "test.pdf", {
      type: "application/pdf",
    });

    return pdf;
  };

  return {
    viewWithPdf: async () => {
      // html to imageFile
      const imageFile = await converToImg();

      // imageFile to Pdf
      const pdf = converToPdf(imageFile);
    },
  };
};

export default makePdf;
```

### 문제점

여기서 문제가 생겼다. 나는 입고라벨 페이지를 구현하지 않고 다운로드 기능만 만들려고 했다.
위 converToImg 함수에서 이미지로 바꿀 dom을 querySelector 로 선택했는데, **만약에 page 를 구현하지 않고 dom 을 불러 올 수있는가?** 에 대한 해답을 찾지 못하였다.

> 따라서 나는 다음과 같이 해결했다. 이것이 맞는건지는 모르지만...

- 다운로드 버튼을 클릭시 모달창이 뜬다.
- 해당 모달창은 입고라벨 양식을 렌더링하는 페이지다.
- jsbarcode, makepdf 함수를 거쳐 페이지를 렌더링 하게되면 바로 다운로드가 실행되며 , 모달창이 꺼지도록 하였다.

코드를 보면 다음과 같이 했다.

```ts
{
	title:  '입고라벨',
	width:  '90px',
	dataIndex:  'custLineNo',
	align:  'center',
	editable:  true,
	render: (text, info, index) => {
		const  onClick  =  async (e) => {
			try {
				setLabelInfo(info);
				await  showPdfModal();
				closePdfModal();
			} catch (err) {
				console.log(err);
		}
	};

	return  <FilePdfOutlined  style={{ fontSize:  '20px', color:  'red' }} onClick={onClick} />;
	},
},
```

jsBarcode , makepdf 함수 모두 async/ await 함수를 쓰는 비동기 작업이다.
따라서 pdf 파일을 다운로드하려고 버튼을 클릭하게 되면

1. label 에 들어갈 info 를 저장하고
2. showPdfModal 이 실행되게 하며, 해당 페이지에서는 useEffect 를 통해 바코드가 먼저 생성되고 pdf 파일형식을 다운로드하게 되며
3. 마지막으로 위 작업이 끝나면 modal 이 닫히게끔 하였다.

위와 같이 작업했을 때 문제는 없다. 정상적으로 다운로드가 되고, 모달창은 보이지 않는다. 다시한번 말하지만 이 방법이 맞는지는 더 연구해봐야 할 것 같다.

그러면 pdfModal 창에 대한 코드를 확인해 보자.

```ts
// PdfLabe.tsx

import  JsBarcode  from  'jsbarcode';
import  makePdf  from  '@utils/makePdf';
import { GlobalLayout, BigBox, Title, Main, LineWrapper, Left, Right } from  '@styles/oms/label';
import { useEffect, useState } from  'react';
import  Image  from  'next/image';
import { useAppSelector } from  '@redux/store/configureStore';

const  PdfLabel  = ({ labelInfo }) => {
	const [productBarcode, setProductBarcode] =  useState<string>();
	const [orderNumberBarcode, setOrderNumberBarcode] =  useState<string>();

	const [isBarcodeDone, setIsBarcodeDone] =  useState<boolean>(false);

	const  companyName  =  useAppSelector((state) =>  state.user.companyName);

	const  pdf  =  makePdf(labelInfo);

	const  handleBarcodeDone  = () =>  setIsBarcodeDone(true);
	const  handleBarcodeUndone  = () =>  setIsBarcodeDone(false);

	const  handleProductBarcode  = (value) =>  setProductBarcode(value);
	const  handleOrderNumberBarcode  = (value) =>  setOrderNumberBarcode(value);

	// 바코드 만드는 함수
	const  makeBarcode  = (barcodeInfo, handleBarcode) => {
		const  canvas  =  document.createElement('canvas');
		JsBarcode(canvas, barcodeInfo, { displayValue:  true, format:  'CODE128', fontSize:  18, textMargin:  0 });
		handleBarcode(canvas.toDataURL('image/png'));
	};

	// 바코드 생성하는 effect
	useEffect(() => {
		const  itemCd  =  labelInfo?.itemCd;
		const  custNo  =  labelInfo?.custNo;

		makeBarcode(itemCd, handleProductBarcode);
		makeBarcode(custNo, handleOrderNumberBarcode);
		handleBarcodeDone();
	}, []);

	// pdf 만드는 effect
	useEffect(() => {
		if (isBarcodeDone) {
		pdf.viewWithPdf();
		handleBarcodeUndone();
		}
	}, [isBarcodeDone]);

...
...
...

export  default PdfLabel;
```

- 해당 모달이 렌더링 될 때, useEffect 를 사용해서 barcode 를 만들어 준다.
- 바코드생성이 완료되면(isBarcodeDone 으로 컨트롤) 다음 useEffect 가 실행되고, pdf 다운로드가 진행된다.
- 렌더링과 사이드이펙트가 모두 실행되고 나면, 모달창을 닫는다. 이는 위에 `table: render()` 함수에서 작성해 놓았다.

## 출처

본인

## 참조

[대기만성개발자 블로그](https://devmemory.tistory.com/98)

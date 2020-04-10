import React, { useState, useEffect} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { MdControlPoint, MdDeleteForever } from 'react-icons/md';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

function SalesTable() {
  const columns = [
    {
      dataField: 'date',
      text: '날짜',
      events: {
        onMouseOver: (e, column, columnIndex, row, rowIndex) => {
          console.log("Mouse Over!!")
          console.log(column);
          console.log(columnIndex);
        }
      },
      editable: false
    }, {
      dataField: 'tableNum',
      text: '테이블수',
      editable: true
    }, {
      dataField: 'cardSales',
      text: '카드 매출',
      editable: true
    }, {
      dataField: 'cashSales',
      text: '현금 매출',
      editable: true,
    }, {
      dataField: 'serviceSales',
      text: '서비스 매출',
      editable: true
    }, {
      dataField: 'totalSales',
      text: '총 매출',
      editable: false
    }, {
      dataField: 'unitPrice',
      text: '객단가',
      editable: false
    },{
      dataField: 'action',
      //isDummyField: true,
      text: '-',
      formatter: (cellContent, row) => {
       return (
         <MdDeleteForever onClick={() => onRemove(row.date)}/>
       )
      },
      editable: false
    },
  ];

  const [products, setProducts] = useState ([
    {
      date: '2020-01-01',
      tableNum: '5',
      cardSales: '500000',
      cashSales: '300000',
      serviceSales: '10000',
      totalSales: 0,
      unitPrice: 0,
      active: false
    },{
      date: "2020-01-02",
      tableNum: '20',
      cardSales: "1000000",
      cashSales: "100000",
      serviceSales: "50000",
      totalSales: 0,
      unitPrice: 0,
      active: false
    }
  ]);

  useEffect(() => {
    console.log("컴포넌트가 화면에 나타남");
    console.log(products);
     // active가 true인 것만 행 색 변하기
    return () => {
      console.log("컴퓨넌트가 화면에서 사라짐");
      console.log(products);
    };
  }, [products]);

  //const CaptionElement = () => <h3 style={{ borderRadius: "0.25em", textAlign: "center", color: "purple", border: "1px solid purple", padding: "0.5em" }}>매출 관리</h3>;

  const updateCellValue = (key, value, dataField) => {
    setProducts(
      products.map(product => 
        product.date === key ? {
          ...product, 
          [dataField]: value, 
          totalSales: Number(product.cardSales)+Number(product.cashSales)+Number(product.serviceSales),
          unitPrice: Number(product.totalSales)/Number(product.tableNum),
          active: true
        } : product,
      )
    )
  }

  const onCreate = () => {
    console.log("배열 추가");

    const product = {
      date: "2020-01-03",
      tableNum: "0",
      cardSales: "0",
      cashSales: "0",
      serviceSales: "0",
      totalSales: 0,
      unitPrice: 0,
      active: true
    }

    setProducts(products.concat(product));
  }

  const onRemove = (date) => {
    console.log("배열 삭제");
    //console.log(products);
    setProducts(
      products.map(product => 
        product.date === date ? {
          ...product, 
          tableNum: 0,
          cardSales: 0,
          cashSales: 0,
          serviceSales: 0,
          totalSales: 0,
          unitPrice: 0,
          active: true
        } : product,
      )
    )
    //console.log(products);
  }

  return (
    <>
      <BootstrapTable 
        keyField="date" 
        data={ products } 
        hover
        columns={ columns } 
        //caption={<CaptionElement />} 
        cellEdit={ cellEditFactory({ 
          mode: "click",
          afterSaveCell: (oldValue, newValue, row, column) => { 
            updateCellValue(row.date, newValue, column.dataField);
          }
        }) }
      />
      <MdControlPoint onClick={onCreate}/>
    </>
  );
}

export default SalesTable;

// TODO Mock 데이터 연동 - 조회 및 저장
// TODO 변경된 값은 색 바꾸기
// TODO 삭제 아이콘 클릭시 배열 초기화
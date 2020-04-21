import React, { useState, useEffect} from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const columns = [
  {
    dataField: 'saleDate',
    text: '날짜',
    editable: false,
    headerAlign: 'center'
  }, {
    dataField: 'tableCount',
    text: '테이블 수',
    editable: true,
    headerAlign: 'center'
  }, {
    dataField: 'cardSales',
    text: '카드 매출',
    editable: true,
    headerAlign: 'center',
    formatter: priceFormatter
  }, {
    dataField: 'moneySales',
    text: '현금 매출',
    editable: true,
    headerAlign: 'center',
    formatter: priceFormatter
  }, {
    dataField: 'serviceSales',
    text: '서비스 매출',
    editable: true,
    headerAlign: 'center',
    formatter: priceFormatter
  }, {
    dataField: 'totalSales',
    text: '총 매출',
    editable: false,
    headerAlign: 'center',
    formatter: priceFormatter
  }, {
    dataField: 'unitPrice',
    text: '객단가',
    editable: false,
    headerAlign: 'center',
    formatter: priceFormatter
  }, {
    dataField: 'modified',
    text: '수정여부',
    editable: false
  }, {
    dataField: 'selected',
    text: '선택여부',
    editable: false
  }
];

function priceFormatter(cell, row) {
  const regexp = /\B(?=(\d{3})+(?!\d))/g;
  return <span> {cell > 0 ? Math.ceil(Number(cell)).toString().replace(regexp, ',') : cell} </span>;
}

function SalesTable({year, month}) {

  const [sales, setSales] = useState(null);
  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [average, setAverage] = useState ({
    averageTableCount: '',
    averageCardSales: '',
    averageMoneySales: '',
    averageServiceSales: '',
    averageUnitPrice: '',
    montlyTotalSales: ''
  });

  const fetchSales = async () => {
    try {
      setError(null);
      setSales(null);
      setLoading(true);
      const response = await axios.get(
        'http://ctk0327.iptime.org:8080/sales', {
          params: {
            saleYear: year,
            saleMonth: month
          }
        });
      setSales(response.data);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
    setInit(true);
  };

  const saveSales = async () => {
    const saveSalesList = sales.filter(sale => sale.modified === true);
    console.log(JSON.stringify(saveSalesList));

    try {
      const response = await axios.post(
        'http://ctk0327.iptime.org:8080/sales', {body: JSON.stringify(saveSalesList)}
        );
    } catch (e) {
      console.log(e.response.data.message);
    }
  };

  const calculate = () => {
    const calculateTotalSales = (cardSales, moneySales, serviceSales) => {
      return Number(cardSales)+Number(moneySales)+Number(serviceSales);
    }
  
    const calculateUnitPrice = (totalSales, tableCount) => {
      return totalSales > 0 ? Number(totalSales)/Number(tableCount) : 0;
    }

    setSales(
      sales.map(sale =>
        true ?
        { ...sale,
          totalSales : calculateTotalSales(sale.cardSales, sale.moneySales, sale.serviceSales),
          unitPrice : calculateUnitPrice(calculateTotalSales(sale.cardSales, sale.moneySales, sale.serviceSales), sale.tableCount)
        } : sale,
      )
    )
  }

  const calculateAllAvrage = (arrSize) => {
    const calculateSum = (arrName) => {
      return sales.reduce((acc, currValue) => {
        if (arrName === 'tableCount')
          return Number(acc)+Number(currValue.tableCount);
        else if (arrName === 'cardSales')
          return Number(acc)+Number(currValue.cardSales);
        else if (arrName === 'moneySales')
          return Number(acc)+Number(currValue.moneySales);
        else if (arrName === 'serviceSale')
          return Number(acc)+Number(currValue.serviceSale);
        else if (arrName === 'unitPrice')
          return Number(acc)+Number(currValue.unitPrice);
        else if (arrName === 'totalSales')
          return Number(acc)+Number(currValue.totalSales);
      }, 0)
    }

    const calculateAverage = (sum, arrSize) => {
      return sum > 0 ? Number(sum)/Number(arrSize) : 0;
    }

    setAverage({
      ...average,
      averageTableCount: calculateAverage(calculateSum('tableCount'), arrSize),
      averageCardSales: calculateAverage(calculateSum('cardSales'), arrSize),
      averageMoneySales: calculateAverage(calculateSum('moneySales'), arrSize),
      averageServiceSales: calculateAverage(calculateSum('serviceSale'), arrSize),
      averageUnitPrice: calculateAverage(calculateSum('unitPrice'), arrSize),
      montlyTotalSales: calculateSum('totalSales'),
    })
  }

  useEffect(() => { 
    fetchSales();
  }, [month]);

  useEffect(() => {
    if(sales != null && init)
      calculate(); setInit(false);
  }, [init]);

  useEffect(() => {
    if(sales != null) 
      calculateAllAvrage(sales.length);
  }, [sales]);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!sales) return null;

  /* sales 배열 추가 */
  const onCreate = () => {
    let lastDate = new Date(sales[sales.length-1].saleDate);
    let today = new Date();

    if(lastDate.getDate() === today.getDate()) {
      alert("오늘 날짜까지만 추가할 수 있습니다.");
      return;
    } 

    lastDate.setDate(lastDate.getDate()+1);

    if(lastDate.getDate() === 1) {
      alert("이 달의 마지막 날입니다.");
      return;
    } 

    const sale = {
      saleDate: lastDate.getFullYear() + "-" + ("0"+(lastDate.getMonth()+1)).slice(-2) + "-" + ("0"+lastDate.getDate()).slice(-2),
      tableCount: "0",
      cardSales: "0",
      moneySales: "0",
      serviceSales: "0",
      totalSales: 0,
      unitPrice: 0,
      modified: true,
    }

    setSales(sales.concat(sale));
  }

  /* 휴지통 아이콘을 클릭 시 선택한 row를 0으로 초기화 */
  const onRemove = (sales) => {
    setSales(
      sales.map(sale => 
        sale.selected ? {
          ...sale, 
          tableCount: 0,
          cardSales: 0,
          moneySales: 0,
          serviceSales: 0,
          totalSales: 0,
          unitPrice: 0,
          modified: true
        } : sale,
      )
    )
  }

  /* Cell Update시 이벤트 설정 */
  const updateCellValue = (key, dataField, value) => {
    setSales(
      sales.map(sale => 
        sale.saleId === key ? {
          ...sale, 
          [dataField]: value, 
          modified: true
        } : sale,
      )
    )
  }

  /* SelectBox 선택시 sales 배열의 특정 원소의 selected 값을 true로 변경 */
  const selectRow = {
    mode: 'checkbox',
    clickToSelect: false,
    clickToEdit: true,

    onSelect: (row, isSelect, rowIndex, e) => {
      if(isSelect) {
        setSales(
          sales.map(sale => 
            sale.saleId === row.saleId ? {
              ...sale, 
              selected: true
            } : sale
          )
        )
      } else {
        setSales(
          sales.map(sale => 
            sale.saleId === row.saleId ? {
              ...sale, 
              selected: false
            } : sale
          )
        )
      }
    }
  };

  /* sales 배열의 원소가 수정된 경우 특정 색으로 변경 */
  const rowStyle = (row, rowIndex) => {
    const style = {};
    if (row.modified) {
      style.backgroundColor = '#c8e6c9';
    } else {
      style.backgroundColor = '#FFFFFF';
    }

    return style;
  }
  
  return (
    <div>
      <div>
        평균 테이블 수: {priceFormatter(average.averageTableCount)} 평균 카드 매출 : {priceFormatter(average.averageCardSales)} 평균 현금 매출 : {priceFormatter(average.averageMoneySales)} 평균 서비스 매출 : {priceFormatter(average.averageServiceSales)} 평균 객 단가 : {priceFormatter(average.averageUnitPrice)} 총 매출액: {priceFormatter(average.montlyTotalSales)} 
      </div>
      <div>
        <BootstrapTable 
          keyField='saleId'
          data={ sales } 
          columns={ columns }  
          selectRow={ selectRow }
          rowStyle={ rowStyle }
          cellEdit={ cellEditFactory({ 
            mode: 'click',
            afterSaveCell: (oldValue, newValue, row, column) => { 
              updateCellValue(row.saleId, column.dataField, newValue, oldValue);
            }
          }) }
        />
      </div>
      <div>
        <MdAddCircleOutline size={30} onClick={onCreate}/>
        <MdRemoveCircleOutline size={30} onClick={() => onRemove(sales)}/>
        <button onClick={saveSales}>저장</button>
      </div>
    </div>
  );
}

export default SalesTable;
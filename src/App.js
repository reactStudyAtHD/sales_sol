import React, { useState } from 'react';
import SalesTable from './SalesTable';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight} from 'react-icons/md';

function App() {
  const [date, setDate] = useState(new Date());

  const prevDate = () => {
    let year = date.getFullYear();
    let month = (date.getMonth()+1)-1;
    
    if ( month === 0 ) {
      year = year-1;
      month = 12;
    }

    setDate(new Date(year, month-1));
  }

  const nextDate = () => {
    let year = date.getFullYear();
    let month = (date.getMonth()+1)+1;
    
    if ( month === 13 ) {
      year = year+1;
      month = 1;
    }

    setDate(new Date(year, month-1));
  }

  return (
    <div>
      <h3>매출을 관리해보즈아~</h3>
      <div>
        <MdKeyboardArrowLeft size={30} onClick={prevDate}/> {date.getMonth()+1} <MdKeyboardArrowRight size={30} onClick={nextDate}/>
      </div>
      <div>
        <SalesTable year={date.getFullYear()} month={date.getMonth()+1}> </SalesTable>
      </div>
    </div>
  );
}

export default React.memo(App);


// TODO 왜 안되는지 찾기!
// let product = products.slice(rowIndex, rowIndex+1)[0];
// product.selected = true;

// setProducts(products => ({
//   ...products,
//   products: [
//     ...products.slice(0, rowIndex),
//     product
//     //...products.slice(rowIndex+1)
//   ]
//  })
// )
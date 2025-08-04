import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { FB_API, Get_sync } from '../../ServiceForBackEnd/FireBaseConfig/FirebaseService';
import Dropdown from '../../Component/Dropdown/Dropdown';
import { useEffect, useState } from 'react';
import LoaderNotificaiton from '../../Component/Notification/LoaderNotification';


const otherSetting = {
  height: 300,
  yAxis: [{ label: 'Money Spent', width: 30 }],
  grid: { horizontal: true },
};



const valueFormatter = (value) => `${value}`;

export default function Chart() {

  const [dataset, setDataSet] = useState([])
  const [Active, setActive] = useState(false)
  const monthDetails = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ]
  const [inputval, setInputVal] =
    useState({ year: '', month: monthDetails[new Date().getMonth()] })


  const firebase_fetch = async (val) => {
    let monthTemp = val==null?inputval.month:val;
    setActive(true)
    var getData = await Get_sync(FB_API.daiilyspendInfo_Address);

    if (getData.exists()) {
      var tempDataD = Object.keys(getData.val()).map(key => ({
        ...getData.val()[key],
      }));

      var temp = Object.keys(tempDataD[0]).map(key => ({
        ...tempDataD[0][key],
      }));

      let filteredData = temp.filter(spend =>
       monthDetails[ new Date(spend.dateOfSpend).getMonth()] === monthTemp
      );

      if (filteredData.length > 0) {
     

        let reducedData = filteredData.reduce((acc, item) => {
          let date = new Date(item.dateOfSpend);
          let year = date.getFullYear();
          let monthName = monthDetails[date.getMonth()];

          if (!acc[year]) {
            acc[year] = { amount: 0, year: year, month: monthName };
          }

          acc[year].amount += Number(item.money);
          return acc;
        }, {});

        // Convert object to array
        let finalData = Object.values(reducedData);

        setTimeout(() => {
          setDataSet(finalData);
          setActive(false)
        }, 1200);
      }



      // setTimeout(() => {
      //   setDataSet(dataTemp)
      //   console.log(dataset)

      // }, 30)

      // setDataSet(Object.values(
      //   temp.filter(spend => new Date(spend.dateOfSpend).getMonth() == monthDetails.indexOf(inputval.month)).reduce((acc, curr) => {
      //     const year = curr.dateOfSpend.slice(0, 4); // '2023' from '2023-01-02'

      //     if (!acc[year]) {
      //       acc[year] = { amount: 0, year: year, month: ' ' };
      //     }

      //     acc[year].amount += Number(curr.money);
      //     acc[year].month = monthDetails[new Date(curr.dateOfSpend).getMonth()]
      //     return acc;
      //   }, {})
      // ))
      // setActive(true)
    }
  }

  // useEffect(() => {
  //   firebase_fetch()
  // },[])


  const refresh = () => {
    setDataSet([])

  }


  //set up input box value at end according to requirement
  const InputHandler = (name, val) => {
    refresh()
    setInputVal((prevState) => ({ [name]: val }))
    firebase_fetch(val)
  }
  //it will set the input type mean name 
  const InputName = () => { return inputval.year !== '' ? 'year' : 'month' }

  //it will set the input value based on ID and null value present
  const InputSelVal = () => { return inputval.year !== '' ? inputval.year : inputval.month }

  return (
    <>


      <div className='char--main' style={{ marginTop: '10px', border: '1px solid gray', padding: '10px', position: 'relative', height: '500px' }}>
     { Active  && <LoaderNotificaiton type={'SC'} text={"Please wait for a second..."}/>}
        <span>
          <h5>Select Month you want to compare!</h5>
        </span>
        <div className='drop--down--Chart' style={{ marginTop: '3px' }}>
          <Dropdown size="medium" label="Select Month you want to compare!" name="month"
            value={inputval.month}
            onClickmeth={InputHandler} dataAry={monthDetails} />
        </div>
        <br />
        {dataset.length > 0 &&
          <>
            <BarChart
              dataset={dataset}
              xAxis={[
                {
                  scaleType: 'band',
                  dataKey: 'year',
                  valueFormatter: (year, context) =>
                    context.location === 'tick'
                      ? `${year}`
                      : `${year}`,
                  height: 40,
                },
              ]}

              series={[{ dataKey: 'amount', label: dataset[0].month, valueFormatter }]}
              {...otherSetting}
            />
          </>
        }

      </div>
    </>

  );
}

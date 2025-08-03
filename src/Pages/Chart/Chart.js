import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { FB_API,Get_sync } from '../../ServiceForBackEnd/FireBaseConfig/FirebaseService';
import Dropdown from '../../Component/Dropdown/Dropdown';


const otherSetting = {
  height: 300,
  yAxis: [{ label: 'Money Spent', width: 30 }],
  grid: { horizontal: true },
};



const valueFormatter = (value) => `${value}`;

export default function Chart() {

    const [dataset,setDataSet] = React.useState([{amount:0,year:0,month:''}])

    const monthDetails = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ]
        const [inputval, setInputVal] =
            React.useState({year:'', month: monthDetails[new Date().getMonth()] })


    const firebase_fetch= async ()=>{
         const getData = await Get_sync(FB_API.daiilyspendInfo_Address);
        
                if (getData.exists()) {
                    const tempDataD = Object.keys(getData.val()).map(key => ({
                        ...getData.val()[key],
                    }));
        
                    const temp = Object.keys(tempDataD[0]).map(key => ({
                        ...tempDataD[0][key],
                    }));

              setDataSet( Object.values(
  temp.filter(spend=> new Date(spend.dateOfSpend).getMonth()== monthDetails.indexOf(inputval.month) ).reduce((acc, curr) => {
    const year = curr.dateOfSpend.slice(0, 4); // '2023' from '2023-01-02'

    if (!acc[year]) {
      acc[year] = { amount: 0,year:year ,month:' ' };
    }

    acc[year].amount += Number(curr.money);
    acc[year].month= monthDetails[new Date(curr.dateOfSpend).getMonth()]
    return acc;
  }, {})
))

 }
               


    }

    React.useEffect(()=>{

        firebase_fetch()
    },[firebase_fetch])


    const refresh = () =>{
        setDataSet({
            amount:0,year:0,month:''
        })
        setInputVal({year:'',month:''})
    }


    //set up input box value at end according to requirement
    const InputHandler = (name, val) => {
      setInputVal((prevState) => ({ [name]: val }))
     
    }
    //it will set the input type mean name 
    const InputName = () => { return inputval.year !== '' ? 'year' : 'month' }

    //it will set the input value based on ID and null value present
    const InputSelVal = () => { return inputval.year !== '' ? inputval.year : inputval.month }

  return (
    <>
    <div className='char--main' style={{marginTop:'10px', border:'1px solid gray', padding:'10px'}}>
        <span>
            <h5>Select Month you want to compare!</h5>
        </span>
    <div className='drop--down--Chart'  style={{marginTop:'3px'}}>
        <Dropdown size="medium" label="Select Month you want to compare!"  name="month"
                            value={inputval.month}
                            onClickmeth={InputHandler} dataAry={monthDetails} />
    </div>

    <br/>
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

    </div>
    </>
    
  );
}

export default Table=({tableHeaderData,tableBodyData})=>{
    return(
        <>
         <div className='dailyspend--display--item'>
                        <h4>View The Data Before Submit</h4>
                        <table>
                            <thead>

                                <th>
                                    Payment Desc
                                </th>
                                <th>
                                    Date Of Spend
                                </th>
                                <th>
                                    Money(RS)
                                </th>

                                <th>
                                    Action
                                </th>
                            </thead>
                            <tbody>
                                {
                                    localDB.map((item, i) => {
                                        return <tr>
                                            <td key={'desc' + item.PayID}>{paymentMenu.filter(itm => itm.paymentID == item.Description)[0].paymentDesc}</td>
                                            <td key={'payment' + item.PayID}>{item.paymentDate}</td>
                                            <td key={'amount' + item.PayID}>{item.Amount}</td>
                                            <td key={item.PayID + i + 'btn'}><button onClick={() => pushToLocalSql(item.PayID)}>P</button>
                                                <button onClick={() => RemoveItemFromFB(item.PayID)}>D</button></td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                        <div className='btn--push--local--db'>
                            <button onClick={() => { }}>PUSH</button>
                        </div>
                    </div>
        </>
    )
}
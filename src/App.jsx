import { useState, useEffect } from 'react'

import transactionHistory from './Imgs/transactionHistory.png'

export default function App() {

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  // Form states
  const [type, setType] = useState('Expense')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState()
  const [date, setDate] = useState('')


  // Filter states
  const [filterType, setFilterType] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStartDate, setFilterStartDate] = useState("")
  const [filterEndDate, setFilterEndDate] = useState("")

  const totalIncome = transactions.filter((t) => t.Type === "Income").reduce((acc, t) => acc + t.Amount, 0)
  const totalExpense = transactions.filter((t) => t.Type === "Expense").reduce((acc, t) => acc + t.Amount, 0)
  const balance = totalIncome - totalExpense

  function AddTransaction() {
    if (category && amount && date) {

      if (amount <= 0) {
        alert("Amount must be greatar than 0")
        return;
      }

      const newTransaction = { id: Date.now(), Type: type, Category: category, Amount: Number(amount), Date: date }
      setTransactions([...transactions, newTransaction])

      setCategory('')
      setAmount('')
      setDate('')
    }
  }

  // unique values for dropdowns
  const types = [...new Set(transactions.map((t) => t.Type))]
  const categories = [...new Set(transactions.map((t) => t.Category))]

  // filteredTransaction
  const filteredTransaction = transactions.filter((t) => {

    const matchType = filterType ? t.Type === filterType : true
    const matchCategory = filterCategory ? t.Category === filterCategory : true
    const matchStartDate = filterStartDate ? new Date(t.Date) >= new Date(filterStartDate) : true
    const matchEndDate = filterEndDate ? new Date(t.Date) <= new Date(filterEndDate) : true

    return matchType && matchCategory && matchStartDate && matchEndDate
  })

  const sortedTransactions = [...filteredTransaction].sort((a, b) => new Date(a.Date) - new Date(b.Date))

  // Delete transition 
  function deletetransition(id) {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  // High Expenses 
  const expenses = filteredTransaction.filter((t) => t.Type === "Expense")

  const sortHighExpenses = [...expenses].sort((a, b) => b.Amount - a.Amount)

  // Expense per day 
  const totalAmount = totalIncome + totalExpense

  let days = 0
  if (expenses.length > 0) {
    // convert transaction dates to Date objects
    const expenseDates = expenses.map(t => new Date(t.Date))

    // get earliest date
    const minDate = new Date(Math.min(...expenseDates))

    // get latest date
    const maxDate = new Date(Math.max(...expenseDates))

    // difference in ms → convert to days
    days = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1
  }

  const averageExpensePerDay = days > 0 ? (totalExpense / days).toFixed(2) : 0


  return (
    <div className='bg-gray-200 min-h-screen p-3'>
      {/* form-Area  */}
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          {/* inputs  */}
          <div className='flex  gap-3'>

            {/* selecte-type  */}
            <select value={type} onChange={(e) => setType(e.target.value)} className='bg-white text-gray-700 text-lg font-medium indent-4 cursor-pointer rounded-lg focus:outline-none w-full py-3'>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>

            {/* Category-input  */}
            <input value={category} onChange={(e) => setCategory(e.target.value)} type="text" className='bg-white text-gray-700 text-lg font-medium indent-4  rounded-lg focus:outline-none w-full py-3' placeholder='Enter your Category' required />

            {/* Amount-input  */}
            <input value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0} type="number" className='bg-white text-gray-700 text-lg font-medium indent-4  rounded-lg focus:outline-none w-full py-3' placeholder='Enter your Amount' required />

            {/* Date-input  */}
            <input value={date} onChange={(e) => setDate(e.target.value)} type="Date" className='bg-white text-gray-700 text-lg font-medium indent-4  rounded-lg focus:outline-none w-full py-3' placeholder='Enter your Category' required />
          </div>

          {/* Add-Transaction-Button  */}
          <button onClick={AddTransaction} className='bg-gray-600 hover:bg-gray-700  hover:scale-101 text-white font-medium text-lg cursor-pointer transition-all duration-200 ease-in-out relative left-1/2 -translate-x-1/2 w-[99%] py-3 rounded-lg mt-3'>
            Add Transaction
          </button>

        </div>
      </form>

      {/* display-Area  */}
      <div className='flex gap-3 mt-8'>
        {/* Total-Income  */}
        <div className='bg-[#6e9265] text-white  white text-lg font-medium flex justify-center items-center rounded-xl w-full py-4'>
          Total Income: $<span className='text-xl  font-bold'>{totalIncome}</span>
        </div>
        {/* Total-Expense  */}
        <div className='bg-[#a27878] text-white text-lg font-medium flex justify-center items-center rounded-xl w-full py-4'>
          Total Expense: $<span className='text-xl  font-bold'>{totalExpense}</span>
        </div>
        {/* Current-Balance  */}
        <div className='bg-[#656565] text-white text-lg font-medium flex justify-center items-center rounded-xl w-full py-4'>
          Current Balance: $<span className='text-xl  font-bold'>{balance}</span>
        </div>

      </div>

      {/* Transactions list */}
      <div className="mt-6">
        <div className='flex items-center justify-between w-full'>
          <div>
            <h2 className="text-xl font-semibold flex items-center  mb-2"><span>Transactions</span> <img className='size-6' src={transactionHistory} alt="" />  :</h2>
          </div>
          <div>

            {/* filters selector  */}
            <div className='flex items-center gap-4'>

              {/* filter Type  */}
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-medium'>Type:</h2>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className='bg-white focus:outline-none rounded-lg h-9 min-w-40 cursor-pointer'>
                  <option value="">All</option>
                  {types.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* filterCategory */}
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className='bg-white focus:outline-none rounded-lg h-9 min-w-40 cursor-pointer'>
                <option value="">All</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>


              {/* filter Date Range */}
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-medium'>From:</h2>
                <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className='bg-white rounded-lg h-9 px-2' />
                <h2 className='text-lg font-medium'>To:</h2>
                <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className='bg-white rounded-lg h-9 px-2' />
              </div>

            </div>

          </div>
        </div>

        <ul className='mt-6'>
          {sortedTransactions.map((t, i) => {
            const monthName = new Date(t.Date + "T00:00:00").toLocaleString('default', { month: 'long' })

            // check if this is the first transaction of the month
            const showMonthHeader = i === 0 || new Date(t.Date).getUTCMonth() !== new Date(sortedTransactions[i - 1].Date).getUTCMonth()

            return (
              <div key={t.id}>
                {showMonthHeader && <h2 className="text-lg font-bold">{monthName}</h2>}

                <li className="bg-white rounded-lg flex justify-between items-center gap-4 my-2 p-2 shadow">
                  <span className='flex items-center gap-4'>
                    <span><span className='text-[17px] font-semibold'>Date:</span> {t.Date}</span>
                    <span><span className='text-[17px] font-semibold'>Type:</span> {t.Type}</span>
                    <span><span className='text-[17px] font-semibold'>Category:</span> {t.Category}</span>
                    <span><span className='text-[17px] font-semibold'>Amount:</span> {t.Amount}</span>
                  </span>
                  <span onClick={() => deletetransition(t.id)} className='cursor-pointer mr-5'>
                    🗑️
                  </span>
                </li>
              </div>
            )
          })}
        </ul>


      </div>

      {/* Analytics Area  */}
      <div className='mt-10'>
        {/* heading */}
        <h2 className="text-xl font-semibold flex items-center  mb-2 gap-1"><span>Analytics </span>
          {/* icon */}
          <span>
            <svg className='size-7' version="1.1" id="ecommerce_1_" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 115 115" enableBackground="new 0 0 115 115" xmlSpace="preserve" >
              <style>{`.st0{fill:#ffeead}.st2{fill:#99734a}`}</style>
              <g id="site_traffic_analitics_1_">
                <path d="M57.501 0v21.157a36.156 36.156 0 0 1 19.589 5.739L88.504 9.065A57.672 57.672 0 0 0 57.501 0z" style={{ fill: "#71a58a" }} />
                <path className="st2" d="M104.03 23.702A57.35 57.35 0 0 0 88.503 9.065L77.09 26.896c7.977 5.117 13.82 13.26 15.907 22.814l20.678-4.538a57.292 57.292 0 0 0-9.645-21.47z" />
                <path className="st0" d="M83.198 83.198C76.622 89.775 67.536 93.843 57.5 93.843V115a57.237 57.237 0 0 0 33.798-10.971 58 58 0 0 0 6.869-5.862L83.198 83.198z" />
                <path className="st0" d="M57.5 93.842a36.164 36.164 0 0 1-19.589-5.738l-11.413 17.83A57.67 57.67 0 0 0 57.501 115L57.5 93.842z" />
                <path d="M23.703 10.971a58 58 0 0 0-6.869 5.862C2.762 30.871-2.793 51.003 1.327 69.827a57.29 57.29 0 0 0 9.645 21.471 57.334 57.334 0 0 0 15.527 14.637l11.413-17.83C27.839 81.643 21.158 70.355 21.158 57.5c0-20.071 16.271-36.343 36.342-36.343h.001V0a57.23 57.23 0 0 0-33.798 10.971z" style={{ fill: "#96ceb4" }} />
                <path d="M87.475 78.046a36.605 36.605 0 0 1-4.276 5.152l14.969 14.969a57.087 57.087 0 0 0 6.767-8.154l-17.46-11.967z" style={{ fill: "#ffcc5c" }} />
                <path d="m113.675 45.173-20.678 4.538c.548 2.51.846 5.115.846 7.789 0 7.626-2.354 14.7-6.368 20.546l17.459 11.967c8.985-13.11 12.118-29.412 8.741-44.84z" style={{ fill: "#ff6f69" }} />
                <g>
                  <path className="st2" d="M38.642 47.703h-.298a3.05 3.05 0 0 0-3.041 3.041v25.808a3.05 3.05 0 0 0 3.041 3.041h.298a3.05 3.05 0 0 0 3.041-3.041V50.744a3.05 3.05 0 0 0-3.041-3.041z" />
                </g>
                <g>
                  <path className="st2" d="M50.87 57.367h-.298a3.05 3.05 0 0 0-3.041 3.041v16.145a3.05 3.05 0 0 0 3.041 3.041h.298a3.05 3.05 0 0 0 3.041-3.041V60.408a3.05 3.05 0 0 0-3.041-3.041z" />
                </g>
                <g>
                  <path className="st2" d="M63.097 28.376H62.8a3.05 3.05 0 0 0-3.041 3.041v45.136a3.05 3.05 0 0 0 3.041 3.041h.298a3.05 3.05 0 0 0 3.041-3.041V31.417a3.05 3.05 0 0 0-3.042-3.041z" />
                </g>
                <g>
                  <path className="st2" d="M75.325 38.039h-.298a3.05 3.05 0 0 0-3.041 3.041v35.472a3.05 3.05 0 0 0 3.041 3.041h.298a3.05 3.05 0 0 0 3.041-3.041V41.08a3.05 3.05 0 0 0-3.041-3.041z" />
                </g>
              </g>
            </svg>
          </span>
          :
        </h2>

        <div className='bg-white rounded-xl w-full p-4'>
          <div className='flex flex-col gap-2 text-gray-700 text-lg font-medium'>
            <div>
              <h3>Highest Expense Category:-</h3>
              <div className='bg-gray-700 rounded-lg mt-5'>
                {sortHighExpenses.length === 0 ? (
                  <p className="text-white p-2">No expenses found</p>
                ) : (
                  sortHighExpenses.map((t) => (
                    <li
                      key={t.id}
                      className="bg-gray-800 border border-gray-600 rounded-lg flex justify-between items-center gap-4 my-2 p-2 shadow"
                    >
                      <span className="flex flex-col">
                        <span>
                          <span className="text-[17px] text-white font-semibold">Date: </span>
                          <span className="text-red-400">{t.Date}</span>
                        </span>
                        <span>
                          <span className="text-[17px] text-white font-semibold">Category: </span>
                          <span className="text-red-400">{t.Category}</span>
                        </span>
                        <span>
                          <span className="text-[17px] text-white font-semibold">Amount: </span>
                          <span className="text-red-400">{t.Amount}</span>
                        </span>
                      </span>
                    </li>
                  ))
                )}
              </div>
            </div>

            <h3 className='flex items-center gap-1'>Average expense per day: <span className="text-gray-900 font-bold">${averageExpensePerDay}</span></h3>
            <p className="text-sm text-gray-500">({days} days counted)</p>
          </div>
        </div>
      </div>

    </div >
  )
}

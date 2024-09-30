'use client'
import { useState, useEffect } from 'react';

interface Record {
  amount: string;
  duedate: string;
  select: 'income' | 'expense';
  description: string;
}

const IncomeExpenseForm = () => {
  const [amount, setAmount] = useState<string>('');
  const [duedate, setDuedate] = useState<string>('');
  const [select, setSelect] = useState<'income' | 'expense'>('income');
  const [description, setDescription] = useState<string>('');
  const [records, setRecords] = useState<Record[]>([]); // Ensure records is always an array
  const [total, setTotal] = useState<number>(0);

  // Fetch existing records and set initial total
  useEffect(() => {
    const fetchRecords = async () => {
      const response = await fetch('/api/records');
      const data = await response.json();

      // Ensure records is an array
      if (data.records && Array.isArray(data.records)) {
        setRecords(data.records);
        calculateTotal(data.records);
      } else {
        setRecords([]); // Default to an empty array if data.records is undefined or not an array
      }
    };

    fetchRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newRecord: Record = { amount, duedate, select, description };

    // Save to backend (MongoDB)
    const response = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    });

    const savedRecord = await response.json();
    setRecords([...records, savedRecord]);
    calculateTotal([...records, savedRecord]);

    // Reset form
    setAmount('');
    setDuedate('');
    setDescription('');
  };

  const calculateTotal = (records: Record[]) => {
    const totalAmount = records.reduce((acc, record) => {
      const recordAmount = parseFloat(record.amount); // Convert amount to a number for calculation
      return record.select === 'income' ? acc + recordAmount : acc - recordAmount;
    }, 0);
    setTotal(totalAmount);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)} // Now using string
        />
        <input
          type="date"
          value={duedate}
          onChange={(e) => setDuedate(e.target.value)} // Using 'duedate' now
        />
        <select value={select} onChange={(e) => setSelect(e.target.value as 'income' | 'expense')}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Using 'description'
        />
        <button type="submit">Add Record</button>
      </form>

      <h2>Records</h2>
      <ul>
        {records.length > 0 ? (
          records.map((record, index) => (
            <li key={index}>
              {record.duedate} - {record.select} of {record.amount} - {record.description}
            </li>
          ))
        ) : (
          <p>No records found.</p>
        )}
      </ul>

      <h3>Total: {total}</h3>
    </div>
  );
};

export default IncomeExpenseForm;

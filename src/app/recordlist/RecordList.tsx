import { useEffect, useState } from 'react';

const RecordList = ({ userId }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const response = await fetch(`/api/records?userId=${userId}`);
      const data = await response.json();
      setRecords(data.data); // สมมติว่าคุณได้ส่งข้อมูลในรูปแบบนี้
    };

    fetchRecords();
  }, [userId]);

  return (
    <div>
      <h2>Your Records</h2>
      <ul>
        {records.map(record => (
          <li key={record._id}>
            {record.description} - {record.amount} - {record.select}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordList;

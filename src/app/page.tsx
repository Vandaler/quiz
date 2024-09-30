import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Income & Expense Tracker</h1>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
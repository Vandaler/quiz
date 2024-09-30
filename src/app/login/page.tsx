'use client';
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // ใช้สำหรับเปลี่ยนเส้นทาง

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    const result = await signIn("credentials", {
      redirect: false, // ไม่ให้ redirect อัตโนมัติ
      username,
      password,
    });

    if (result?.error) {
      setError(result.error);  // แสดงข้อผิดพลาด
    } else {
      // ไปยังหน้า dashboard เมื่อ login สำเร็จ
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* แสดงข้อความผิดพลาด */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/app/models/User'; // โมเดลผู้ใช้
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/app/lib/mongodb'; // ฟังก์ชันเชื่อมต่อฐานข้อมูล

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password) {
          throw new Error('Missing credentials'); // ถ้าขาด username หรือ password
        }

        // เชื่อมต่อกับฐานข้อมูล
        await connectToDatabase();

        // ค้นหาผู้ใช้ในฐานข้อมูล
        const user = await User.findOne({ username: credentials.username });
        if (!user) {
          console.error('User not found');
          throw new Error('Invalid credentials'); // ถ้าไม่มีผู้ใช้
        }

        // ตรวจสอบรหัสผ่าน
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          console.error('Invalid password');
          throw new Error('Invalid credentials'); // ถ้ารหัสผ่านไม่ถูกต้อง
        }

        // หากตรวจสอบผ่าน ให้คืนค่าข้อมูลผู้ใช้
        return { id: user._id, username: user.username };
      },
    }),
  ],
  pages: {
    signIn: '/auth', // เส้นทางสำหรับหน้า login
  },
  session: {
    strategy: 'jwt', // ใช้ JWT สำหรับ session
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

// สร้าง handler สำหรับ NextAuth
const handler = NextAuth(authOptions);

// Export handler สำหรับ GET และ POST
export { handler as GET, handler as POST };

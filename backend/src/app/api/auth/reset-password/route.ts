import { NextResponse } from 'next/server';
import { AppDataSource, ensureDbConnected } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { User } from '@/entities/User';

/* =========================================================
   POST: Reset / Update user password using email
   ========================================================= */
export async function POST(req: Request) {
    try {
        await ensureDbConnected();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        await userRepository.save(user);

        return NextResponse.json({
            message: 'Password updated successfully'
        });

    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

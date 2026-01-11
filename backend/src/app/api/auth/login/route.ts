import { NextResponse } from 'next/server';
import { AppDataSource, ensureDbConnected } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';
import { User } from '@/entities/User';

/* =========================================================
   POST: User Login
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
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = generateToken({
            userId: user.id,
            email: user.email
        });

        return NextResponse.json(
            {
                token,
                user: {
                    id: user.id,
                    email: user.email
                }
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

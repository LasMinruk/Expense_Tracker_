import { NextResponse } from 'next/server';
import { AppDataSource, ensureDbConnected } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { User } from '@/entities/User';

/* =========================================================
   POST: Register a new user
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
        const existingUser = await userRepository.findOne({ where: { email } });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);
        const newUser = userRepository.create({
            email,
            password: hashedPassword
        });

        await userRepository.save(newUser);

        const token = generateToken({
            userId: newUser.id,
            email: newUser.email
        });

        return NextResponse.json(
            {
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email
                }
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

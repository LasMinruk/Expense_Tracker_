import { NextResponse } from 'next/server';
import { AppDataSource, ensureDbConnected } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { Income } from '@/entities/Income';

/* =========================================================
   GET: Fetch the latest income amount of the logged-in user
   ========================================================= */
export async function GET(req: Request) {
    try {
        await ensureDbConnected();
        const authHeader = req.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const incomeRepository = AppDataSource.getRepository(Income);
        const income = await incomeRepository.findOne({
            where: { userId: payload.userId },
            order: { createdAt: 'DESC' }
        });

        const amount = income ? Number(income.amount) : 0;

        return NextResponse.json({ amount });

    } catch (error: any) {
        console.error('Fetch income error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

/* =========================================================
   POST: Insert / Update income amount for the logged-in user
   ========================================================= */
export async function POST(req: Request) {
    try {
        await ensureDbConnected();
        const authHeader = req.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { amount } = await req.json();

        if (amount === undefined) {
            return NextResponse.json(
                { error: 'Amount is required' },
                { status: 400 }
            );
        }

        const incomeRepository = AppDataSource.getRepository(Income);

        // Strategy: Just insert a new record for history tracking, 
        // similar to original logic which was INSERT
        const newIncome = incomeRepository.create({
            userId: payload.userId,
            amount
        });

        await incomeRepository.save(newIncome);

        return NextResponse.json(newIncome);

    } catch (error: any) {
        console.error('Update income error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { AppDataSource, ensureDbConnected } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { Expense } from '@/entities/Expense';

/* =========================================================
   GET: Fetch all expenses of the logged-in user
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

        const expenseRepository = AppDataSource.getRepository(Expense);
        const expenses = await expenseRepository.find({
            where: { userId: payload.userId },
            order: { createdAt: 'DESC' }
        });

        return NextResponse.json(expenses);

    } catch (error: any) {
        console.error('Fetch expenses error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/* =========================================================
   POST: Create a new expense for the logged-in user
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

        const { name, cost, isIncome } = await req.json();

        if (!name || cost === undefined) {
            return NextResponse.json(
                { error: 'Name and cost are required' },
                { status: 400 }
            );
        }

        const expenseRepository = AppDataSource.getRepository(Expense);
        const newExpense = expenseRepository.create({
            userId: payload.userId,
            name,
            cost,
            isIncome: isIncome || false
        });

        await expenseRepository.save(newExpense);

        return NextResponse.json(newExpense, { status: 201 });

    } catch (error: any) {
        console.error('Create expense error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/* =========================================================
   DELETE: Delete an expense that belongs to the logged-in user
   ========================================================= */
export async function DELETE(req: Request) {
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

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const expenseRepository = AppDataSource.getRepository(Expense);
        const result = await expenseRepository.delete({ id, userId: payload.userId });

        if (result.affected === 0) {
            return NextResponse.json({ error: 'Expense not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Expense deleted' });

    } catch (error: any) {
        console.error('Delete expense error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

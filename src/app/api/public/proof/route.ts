import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Proof from '@/models/Proof';

export async function GET() {
  try {
    await connectToDatabase();
    const proofs = await Proof.find().sort({ createdAt: -1 });
    return NextResponse.json(proofs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch proofs' }, { status: 500 });
  }
}

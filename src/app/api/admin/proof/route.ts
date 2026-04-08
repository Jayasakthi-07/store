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

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    if (!body.imageUrl) {
      return NextResponse.json({ error: 'Missing imageUrl' }, { status: 400 });
    }

    const proof = await Proof.create({ imageUrl: body.imageUrl });
    return NextResponse.json(proof, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create proof' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await Proof.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete proof' }, { status: 500 });
  }
}

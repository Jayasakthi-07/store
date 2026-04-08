import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Settings from '@/models/Settings';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Check if we want settings or products based on the URL
    if (request.url.includes('/api/public/settings')) {
       const settings = await Settings.findOne();
       return NextResponse.json(settings || { telegramLink: '', instagramLink: '' });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const filter = url.searchParams.get('filter') || 'all'; // all, available, sold, featured
    
    let query: any = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    if (filter === 'available') query.status = 'available';
    if (filter === 'sold') query.status = 'sold';
    if (filter === 'featured') query.isFeatured = true;

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch external data' }, { status: 500 });
  }
}

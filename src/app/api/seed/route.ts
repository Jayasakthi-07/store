import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import Settings from '@/models/Settings';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Check if admin already exists
    const adminExists = await Admin.findOne({ username: 'gamea8x' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Sakthi@1962', 10);
      await Admin.create({
        username: 'gamea8x',
        passwordHash: hashedPassword,
      });
    }

    // Seed empty settings if none exist
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({
        telegramLink: 'https://t.me/yourtelegram',
        instagramLink: 'https://instagram.com/yourinstagram',
      });
    }

    return NextResponse.json({ message: 'Seed successful' }, { status: 200 });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
  }
}

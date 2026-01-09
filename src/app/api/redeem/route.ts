import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fungsi validasi kode redeem
function validateRedeemCode(code: string): boolean {
  // Format: XXXX-XXXX-XXXX (12 karakter alphanumerik + 2 dash)
  const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return regex.test(code);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, redeemCode, server, systemVersion, cloudType, duration } = body;

    // Validasi input
    if (!email || !password || !redeemCode || !server || !systemVersion || !cloudType || !duration) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Validasi format redeem code
    if (!validateRedeemCode(redeemCode)) {
      return NextResponse.json(
        { error: 'Format kode redeem tidak valid! Gunakan format: XXXX-XXXX-XXXX (contoh: APY3-GP9Z-KVC4)' },
        { status: 400 }
      );
    }

    // Cek apakah kode sudah pernah digunakan
    const existingRedeem = await prisma.redeem.findFirst({
      where: { redeemCode }
    });

    if (existingRedeem) {
      return NextResponse.json(
        { error: 'Kode redeem ini sudah pernah digunakan!' },
        { status: 400 }
      );
    }

    // Simpan ke database
    const redeem = await prisma.redeem.create({
      data: {
        email,
        password,
        redeemCode: redeemCode.toUpperCase(), // Simpan dalam uppercase
        server,
        systemVersion,
        cloudType,
        duration,
        status: 'processing'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Kode redeem berhasil disubmit dan sedang diproses!',
      data: redeem 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// GET - Untuk lihat history redeem
export async function GET() {
  try {
    const redeems = await prisma.redeem.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        email: true,
        redeemCode: true,
        server: true,
        systemVersion: true,
        cloudType: true,
        duration: true,
        status: true,
        createdAt: true
        // password tidak diinclude untuk keamanan
      }
    });

    return NextResponse.json({ redeems });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

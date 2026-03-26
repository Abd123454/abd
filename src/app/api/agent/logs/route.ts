import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default-user'
}

export async function GET() {
  try {
    // Return empty logs since we don't use AgentLog model
    return NextResponse.json([])
  } catch (error) {
    console.error('Get logs error:', error)
    return NextResponse.json([])
  }
}

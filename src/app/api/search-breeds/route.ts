import { NextResponse } from 'next/server';
import { getBreeds } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const breeds = await getBreeds({ name: query });
    // Filter to get unique names
    const uniqueSuggestions = Array.from(new Set(breeds.map(breed => breed.name)));
    return NextResponse.json(uniqueSuggestions);
  } catch (error) {
    console.error('Error in search-breeds API:', error);
    return NextResponse.json({ error: 'Failed to fetch breeds' }, { status: 500 });
  }
}

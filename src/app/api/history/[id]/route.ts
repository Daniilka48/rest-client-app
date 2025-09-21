import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data, error } = await supabase
      .from('rest')
      .select('*')
      .eq('id', resolvedParams.id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return new NextResponse('Request not found', { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    throw new Error(`Failed to fetch request history: ${err}`);
  }
}

// FILE: app/api/scripts/[id]/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: script, error: scriptError } = await supabase
    .from('scripts')
    .select('*')
    .eq('id', id)
    .single();

  if (scriptError) return NextResponse.json({ error: scriptError.message }, { status: 404 });

  const [nodes, edges, blocks] = await Promise.all([
    supabase.from('nodes').select('*').eq('script_id', id),
    supabase.from('edges').select('*').eq('script_id', id),
    supabase.from('blocks').select('*').in('node_id', (await supabase.from('nodes').select('id').eq('script_id', id)).data?.map((n: { id: string }) => n.id) || [])
  ]);

  return NextResponse.json({
    ...script,
    nodes: nodes.data || [],
    edges: edges.data || [],
    blocks: blocks.data || []
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from('scripts')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase
    .from('scripts')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

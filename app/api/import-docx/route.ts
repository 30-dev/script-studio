// FILE: app/api/import-docx/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { parseDocx } from '@/lib/docx-parser';

export async function POST(request: Request) {
  const supabase = await createClient();
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const scriptId = formData.get('scriptId') as string;

  if (!file || !scriptId) {
    return NextResponse.json({ error: 'Missing file or scriptId' }, { status:400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const scenes = await parseDocx(buffer);

  // Create nodes and blocks
  const nodes = [];
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const { data: node, error: nodeError } = await supabase
      .from('nodes')
      .insert([{
        script_id: scriptId,
        title: scene.title,
        position_x: i * 350,
        position_y: 100
      }])
      .select()
      .single();

    if (nodeError) continue;

    const { error: blockError } = await supabase
      .from('blocks')
      .insert([{
        node_id: node.id,
        type: 'script',
        content: scene.content,
        position: 0
      }]);
    
    if (!blockError) {
      nodes.push(node);
    }
  }

  return NextResponse.json({ nodes });
}

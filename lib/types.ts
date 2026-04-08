// FILE: lib/types.ts

export type BlockType = 'script' | 'prompt' | 'note' | 'code' | 'asset';

export interface Profile {
  id: string;
  email: string;
  created_at: string;
}

export interface Script {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Node {
  id: string;
  script_id: string;
  title: string;
  position_x: number;
  position_y: number;
  created_at: string;
}

export interface Block {
  id: string;
  node_id: string;
  type: BlockType;
  content: string;
  asset_url?: string;
  position: number;
  created_at: string;
}

export interface Edge {
  id: string;
  script_id: string;
  from_node: string;
  to_node: string;
}

export interface ScriptWithDetails extends Script {
  nodes: Node[];
  edges: Edge[];
  blocks: Block[];
}

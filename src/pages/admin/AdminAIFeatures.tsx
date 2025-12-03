import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AIFeature } from '@/types/adminTypes';
import { ContentFormModal } from '@/components/admin/ContentFormModal';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Pencil, Trash2, Loader2, Brain } from 'lucide-react';

const AdminAIFeatures: React.FC = () => {
  const [items, setItems] = useState<AIFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AIFeature | null>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('ai_features').select('*').order('display_order');
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (form: any) => {
    const payload = { title: form.title, description: form.description, icon: form.icon, image_url: form.image_url, display_order: form.display_order, is_active: form.is_active };
    if (selected) {
      const { error } = await supabase.from('ai_features').update(payload).eq('id', selected.id);
      if (error) throw error;
      toast({ title: 'Updated', description: 'AI Feature updated successfully' });
    } else {
      const { error } = await supabase.from('ai_features').insert([payload]);
      if (error) throw error;
      toast({ title: 'Created', description: 'AI Feature created successfully' });
    }
    setSelected(null);
    fetchItems();
  };

  const handleDelete = async () => {
    if (!selected) return;
    const { error } = await supabase.from('ai_features').delete().eq('id', selected.id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Deleted', description: 'AI Feature deleted' }); fetchItems(); }
    setSelected(null);
  };

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3"><Brain className="w-8 h-8 text-[#00C2D1]" /><h1 className="text-2xl font-bold text-gray-900">AI for Government</h1></div>
        <Button onClick={() => { setSelected(null); setModalOpen(true); }} className="bg-[#003B8E]"><Plus className="w-4 h-4 mr-2" />Add AI Feature</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4"><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-10" /></div></div>
        {loading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#003B8E]" /></div> : (
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b"><th className="text-left py-3 px-4">Title</th><th className="text-left py-3 px-4">Icon</th><th className="text-left py-3 px-4">Order</th><th className="text-left py-3 px-4">Status</th><th className="text-right py-3 px-4">Actions</th></tr></thead><tbody>
            {filtered.map(item => (<tr key={item.id} className="border-b hover:bg-gray-50"><td className="py-3 px-4 font-medium">{item.title}</td><td className="py-3 px-4"><span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.icon || '-'}</span></td><td className="py-3 px-4">{item.display_order}</td><td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.is_active ? 'Active' : 'Inactive'}</span></td><td className="py-3 px-4 text-right"><Button variant="ghost" size="sm" onClick={() => { setSelected(item); setModalOpen(true); }}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => { setSelected(item); setDeleteOpen(true); }}><Trash2 className="w-4 h-4 text-red-500" /></Button></td></tr>))}
          </tbody></table></div>
        )}
      </div>
      <ContentFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={selected} title="AI Feature" showIcon showImage imageFolder="ai-features" />
      <DeleteConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete AI Feature" description={`Delete "${selected?.title}"?`} />
    </div>
  );
};

export default AdminAIFeatures;

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Building, Clock, CheckCircle, Eye, Trash2, Archive, Loader2, MessageSquare } from 'lucide-react';

interface Submission {
  id: string;
  name: string;
  organization: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

const AdminSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => { fetchSubmissions(); }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else setSubmissions(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Updated', description: `Status changed to ${status}` }); fetchSubmissions(); }
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const handleDelete = async () => {
    if (!selected) return;
    const { error } = await supabase.from('contact_submissions').delete().eq('id', selected.id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Deleted', description: 'Submission deleted' }); setSelected(null); fetchSubmissions(); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'read': return 'bg-yellow-100 text-yellow-700';
      case 'replied': return 'bg-green-100 text-green-700';
      case 'archived': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);
  const counts = { all: submissions.length, new: submissions.filter(s => s.status === 'new').length, read: submissions.filter(s => s.status === 'read').length, replied: submissions.filter(s => s.status === 'replied').length };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3"><MessageSquare className="w-8 h-8 text-[#00C2D1]" /><h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1></div>
        <div className="flex gap-2">
          {['all', 'new', 'read', 'replied'].map(f => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className={filter === f ? 'bg-[#003B8E]' : ''}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f as keyof typeof counts]})
            </Button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#003B8E]" /></div> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filtered.map((sub) => (
                <div key={sub.id} onClick={() => { setSelected(sub); if (sub.status === 'new') updateStatus(sub.id, 'read'); }} className={`p-4 cursor-pointer hover:bg-gray-50 transition ${selected?.id === sub.id ? 'bg-blue-50' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div><h3 className="font-semibold text-gray-800">{sub.name}</h3><p className="text-sm text-gray-500 flex items-center gap-1"><Building className="w-3 h-3" /> {sub.organization || 'N/A'}</p></div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(sub.status)}`}>{sub.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{sub.message}</p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(sub.created_at)}</p>
                </div>
              ))}
              {filtered.length === 0 && <div className="p-8 text-center text-gray-500">No submissions</div>}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            {selected ? (
              <div>
                <h2 className="font-bold text-lg mb-4">Details</h2>
                <div className="space-y-4">
                  <div><label className="text-sm text-gray-500">Name</label><p className="font-medium">{selected.name}</p></div>
                  <div><label className="text-sm text-gray-500">Organization</label><p className="font-medium">{selected.organization || 'N/A'}</p></div>
                  <div><label className="text-sm text-gray-500">Email</label><p className="font-medium flex items-center gap-2"><Mail className="w-4 h-4" /><a href={`mailto:${selected.email}`} className="text-[#003B8E] hover:underline">{selected.email}</a></p></div>
                  <div><label className="text-sm text-gray-500">Message</label><p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">{selected.message}</p></div>
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <Button variant="outline" onClick={() => updateStatus(selected.id, 'read')}><Eye className="w-4 h-4 mr-1" />Read</Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(selected.id, 'replied')}><CheckCircle className="w-4 h-4 mr-1" />Replied</Button>
                    <Button variant="outline" onClick={() => updateStatus(selected.id, 'archived')}><Archive className="w-4 h-4 mr-1" />Archive</Button>
                    <Button variant="destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12"><MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>Select a submission</p></div>
            )}
          </div>
        </div>
      )}
      <DeleteConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Submission" description={`Delete submission from "${selected?.name}"?`} />
    </div>
  );
};

export default AdminSubmissions;

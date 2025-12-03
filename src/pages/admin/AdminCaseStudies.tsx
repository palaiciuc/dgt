import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Eye, Search, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CaseStudy, CaseStudyFormData } from '@/types/caseStudy';
import { caseStudiesData } from '@/data/caseStudiesData';
import CaseStudyFormModal from '@/components/admin/CaseStudyFormModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

const AdminCaseStudies: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => { fetchCaseStudies(); }, []);

  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('case_studies').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCaseStudies(data?.length ? data : caseStudiesData.map((cs, i) => ({ ...cs, id: String(i), short_desc: cs.shortDesc, architecture_image: cs.architectureImage } as CaseStudy)));
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load case studies', variant: 'destructive' });
      setCaseStudies(caseStudiesData.map((cs, i) => ({ ...cs, id: String(i), short_desc: cs.shortDesc, architecture_image: cs.architectureImage } as CaseStudy)));
    } finally { setLoading(false); }
  };

  const handleSubmit = async (formData: CaseStudyFormData) => {
    setIsSubmitting(true);
    try {
      if (editingStudy) {
        const { error } = await supabase.from('case_studies').update(formData).eq('id', editingStudy.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Case study updated successfully' });
      } else {
        const { error } = await supabase.from('case_studies').insert([formData]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Case study created successfully' });
      }
      setShowModal(false);
      setEditingStudy(null);
      fetchCaseStudies();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Operation failed', variant: 'destructive' });
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('case_studies').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Case study deleted successfully' });
      setDeleteTarget(null);
      fetchCaseStudies();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Delete failed', variant: 'destructive' });
    } finally { setIsSubmitting(false); }
  };

  const filtered = caseStudies.filter(cs => 
    cs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cs.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cs.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Case Studies</h1>
        <button onClick={() => { setEditingStudy(null); setShowModal(true); }} className="flex items-center gap-2 bg-[#003B8E] text-white px-4 py-2 rounded-lg hover:bg-[#002d6e] transition-colors">
          <Plus className="w-5 h-5" /> Add New
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-4 p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search case studies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
        <button onClick={fetchCaseStudies} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Refresh">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-[#003B8E] border-t-transparent rounded-full mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No case studies found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Tag</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Client</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cs) => (
                  <tr key={cs.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4"><div className="font-medium text-gray-900">{cs.title}</div><div className="text-sm text-gray-500 truncate max-w-xs">{cs.description}</div></td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-[#00C2D1]/10 text-[#00C2D1] rounded text-sm font-medium">{cs.tag}</span></td>
                    <td className="px-6 py-4 text-gray-600">{cs.client}</td>
                    <td className="px-6 py-4 text-right">
                      <a href={`/case-study/${cs.slug}`} target="_blank" className="inline-flex p-2 text-gray-600 hover:bg-gray-100 rounded"><Eye className="w-4 h-4" /></a>
                      <button onClick={() => { setEditingStudy(cs); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(cs)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CaseStudyFormModal isOpen={showModal} editingStudy={editingStudy} onClose={() => { setShowModal(false); setEditingStudy(null); }} onSubmit={handleSubmit} isLoading={isSubmitting} />
      <DeleteConfirmDialog isOpen={!!deleteTarget} title="Delete Case Study" message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} isLoading={isSubmitting} />
    </div>
  );
};

export default AdminCaseStudies;

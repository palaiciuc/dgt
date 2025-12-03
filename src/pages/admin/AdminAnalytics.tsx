import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, TrendingDown, Eye, Users, FileText, MessageSquare } from 'lucide-react';

interface AnalyticsData {
  date: string;
  page_views: number;
  unique_visitors: number;
  contact_forms: number;
  case_study_views: number;
}

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [totals, setTotals] = useState({ views: 0, visitors: 0, forms: 0, caseViews: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const { data } = await supabase
      .from('analytics')
      .select('*')
      .order('date', { ascending: true })
      .limit(7);
    
    if (data && data.length > 0) {
      setAnalytics(data);
      setTotals({
        views: data.reduce((sum, d) => sum + d.page_views, 0),
        visitors: data.reduce((sum, d) => sum + d.unique_visitors, 0),
        forms: data.reduce((sum, d) => sum + d.contact_forms, 0),
        caseViews: data.reduce((sum, d) => sum + d.case_study_views, 0),
      });
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const getMaxValue = (key: keyof AnalyticsData) => Math.max(...analytics.map(a => Number(a[key]) || 0));

  const stats = [
    { label: 'Total Page Views', value: totals.views, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12%' },
    { label: 'Unique Visitors', value: totals.visitors, icon: Users, color: 'text-green-600', bg: 'bg-green-100', trend: '+8%' },
    { label: 'Contact Forms', value: totals.forms, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-100', trend: '+24%' },
    { label: 'Case Study Views', value: totals.caseViews, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+15%' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Website Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" /> {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Page Views (Last 7 Days)</h2>
        <div className="flex items-end gap-2 h-48">
          {analytics.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-[#003B8E] rounded-t-lg transition-all hover:bg-[#00C2D1]"
                style={{ height: `${(day.page_views / getMaxValue('page_views')) * 100}%`, minHeight: '8px' }}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">{formatDate(day.date).split(' ')[0]}</p>
              <p className="text-xs font-medium">{day.page_views}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold">Daily Breakdown</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Page Views</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Visitors</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Forms</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Case Studies</th>
            </tr>
          </thead>
          <tbody>
            {analytics.slice().reverse().map((day) => (
              <tr key={day.date} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{formatDate(day.date)}</td>
                <td className="px-6 py-4 text-right">{day.page_views.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">{day.unique_visitors.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">{day.contact_forms}</td>
                <td className="px-6 py-4 text-right">{day.case_study_views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAnalytics;

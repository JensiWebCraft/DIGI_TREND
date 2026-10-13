import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Users, 
  Phone, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  FolderKanban,
  Edit3
} from 'lucide-react';
import api from '../services/api';

export default function ClientsView() {
  const [clients, setClients] = useState([
    { id: 1, name: 'Jagdamba Agro Polymers', contact: '+91 98765 43210', email: 'info@jagdambapolymers.com', projects: 3, status: 'Active', retainer: 75000 },
    { id: 2, name: 'ABC Corp', contact: '+91 91234 56789', email: 'marketing@abccorp.in', projects: 2, status: 'Active', retainer: 45000 },
    { id: 3, name: 'GreenLife', contact: '+91 99887 76655', email: 'connect@greenlife.org', projects: 2, status: 'Active', retainer: 35000 },
    { id: 4, name: 'Trendy Mart', contact: '+91 97654 32109', email: 'sales@trendymart.com', projects: 1, status: 'Active', retainer: 25000 },
    { id: 5, name: 'SkyTech', contact: '+91 96543 21098', email: 'contact@skytech.io', projects: 3, status: 'Active', retainer: 50000 },
    { id: 6, name: 'Fusion Foods', contact: '+91 95210 98765', email: 'orders@fusionfoods.in', projects: 1, status: 'Active', retainer: 28000 },
    { id: 7, name: 'TechNova', contact: '+91 94765 12345', email: 'ops@technova.com', projects: 2, status: 'Active', retainer: 40000 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    contact: '+91 98000 00000',
    email: '',
    projects: 1,
    retainer: 35000
  });

  useEffect(() => {
    // Load live clients from Axios
    const loadClients = async () => {
      try {
        const res = await api.getClients();
        if (res?.data && res.data.length > 0) {
          setClients(res.data);
        }
      } catch (err) {
        console.warn('Using client initial state:', err.message);
      }
    };
    loadClients();
  }, []);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Client name is required');

    const newClient = {
      ...formData,
      id: Date.now(),
      status: 'Active'
    };

    try {
      await api.createClient(newClient);
    } catch (err) {
      console.warn('Axios notice:', err.message);
    }

    setClients([...clients, newClient]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      contact: '+91 98000 00000',
      email: '',
      projects: 1,
      retainer: 35000
    });
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contact.includes(searchQuery)
  );

  return (
    <div className="flex-1 bg-[#f8fafc] text-slate-800 min-h-screen p-6 lg:p-8 space-y-6">
      
      {/* Top Header Bar matching reference Page 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">Clients</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your agency client accounts, monthly retainer billing, and active projects.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase shadow-md flex items-center gap-2 transition-colors w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Search Input Bar matching Page 6 */}
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm max-w-md">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Clients Table matching Page 6 */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] text-slate-500 font-semibold">
                <th className="py-3.5 px-5 font-medium">Client Name</th>
                <th className="py-3.5 px-5 font-medium">Contact</th>
                <th className="py-3.5 px-5 font-medium">Projects</th>
                <th className="py-3.5 px-5 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id || client._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block text-xs">{client.name}</span>
                        <span className="text-[10px] text-slate-400">Monthly Retainer: ₹{(client.retainer || 45000).toLocaleString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-slate-600 font-mono text-[11px]">{client.contact}</td>
                  <td className="py-4 px-5 font-bold text-slate-800">{client.projects || 1}</td>
                  <td className="py-4 px-5 text-right">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-[10px]">
                      {client.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Add New Retainer Client</h3>
            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Client Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Maruti Technocast"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+91 98000 00000"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  placeholder="client@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Active Projects</label>
                  <input
                    type="number"
                    value={formData.projects}
                    onChange={(e) => setFormData({ ...formData, projects: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Monthly Retainer (₹)</label>
                  <input
                    type="number"
                    value={formData.retainer}
                    onChange={(e) => setFormData({ ...formData, retainer: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white font-bold"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

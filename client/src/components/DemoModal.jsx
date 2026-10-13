import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Building, Mail, User, Phone, Sparkles, Loader2 } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    agency: '',
    phone: '',
    date: '',
    teamSize: '5-15 members'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return alert('Name and email required');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0b0f1a] text-white border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-['Outfit']">Demo Scheduled!</h3>
            <p className="text-xs text-slate-300">
              We've emailed details to <span className="text-purple-400">{formData.email}</span>. Our team looks forward to showing you DiGi Trend!
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block">DiGi Trend Platform</span>
              <h3 className="text-2xl font-black font-['Outfit']">Schedule a Live Demo</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaurav K."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#101626] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="gaurav@agency.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#101626] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Agency Name</label>
                  <input
                    type="text"
                    placeholder="DiGi Trend"
                    value={formData.agency}
                    onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                    className="w-full bg-[#101626] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 94281 63116"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#101626] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#101626] border border-slate-700 rounded-xl p-2 text-white focus:outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase shadow-lg shadow-purple-600/30"
                >
                  {isSubmitting ? 'Scheduling...' : 'Confirm Demo'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

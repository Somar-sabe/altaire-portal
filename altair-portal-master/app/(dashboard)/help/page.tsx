export default function HelpPage() {
  return (
    <div className="flex-1 h-full w-full bg-white md:rounded-[10px] md:border border-slate-200/50 p-8 shadow-sm flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-[20px] flex items-center justify-center mb-6">
        <span className="text-2xl font-black text-slate-800">?</span>
      </div>
      <h2 className="text-xl font-black text-slate-900 mb-2">Help & Support</h2>
      <p className="text-slate-500 font-medium text-sm max-w-sm leading-relaxed mb-8">
        Get assistance with the Enterprise Unified Administration portal. View guides, contact administration, or browse FAQs.
      </p>
      <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-[10px] text-xs font-bold transition-all shadow-sm">
        Contact Support
      </button>
    </div>
  );
}

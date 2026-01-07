
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadForm from './components/LeadForm';
import LeadTable from './components/LeadTable';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';
import Login from './components/Login';
import LeadDetails from './components/LeadDetails';
import { Lead, View, LeadStatus, User, AppSettings, HistoryEntry } from './types';
import { analyzeLead } from './services/geminiService';
import { syncCloudTeam } from './services/cloudService';
import { METAL_GROUPS, PRODUCT_CATEGORIES, SOURCES } from './constants';
import { BrainCircuit, Cloud, CloudOff, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jewelflow_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<View>('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('jewelflow_users');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'admin-1', name: 'System Admin', email: 'admin@jewelflow.com', role: 'Admin', createdAt: new Date().toISOString() }
    ];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('jewelflow_settings');
    if (saved) return JSON.parse(saved);
    return {
      metalGroups: Array.from(METAL_GROUPS),
      productCategories: PRODUCT_CATEGORIES,
      sources: SOURCES
    };
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('jewelflow_leads');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // --- CLOUD SYNC LOGIC ---
  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const cloudUsers = await syncCloudTeam();
      setUsers(prev => {
        // Keep local admin if it exists, but prioritize cloud data
        const localAdmin = prev.find(u => u.id === 'admin-1');
        const uniqueCloudUsers = cloudUsers.filter(cu => cu.email !== localAdmin?.email);
        return localAdmin ? [localAdmin, ...uniqueCloudUsers] : cloudUsers;
      });
    } catch (err: any) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    handleSync();
  }, [handleSync]);

  useEffect(() => {
    localStorage.setItem('jewelflow_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('jewelflow_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('jewelflow_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('jewelflow_leads', JSON.stringify(leads));
  }, [leads]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser?.id) return alert("You cannot delete yourself.");
    setUsers(users.filter(u => u.id !== id));
  };

  const handleAddLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'status' | 'history'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'New',
      history: [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'note',
        content: `Lead created and assigned to ${leadData.leadGeneratorName}.`,
        user: currentUser?.name || 'System',
        createdAt: new Date().toISOString()
      }]
    };
    setLeads([newLead, ...leads]);
    setView('leads');
  };

  const handleUpdateStatus = (id: string, status: LeadStatus) => {
    setLeads(leads.map(l => {
      if (l.id === id) {
        const historyEntry: HistoryEntry = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'status_change',
          content: `Status changed from ${l.status} to ${status}.`,
          user: currentUser?.name || 'System',
          createdAt: new Date().toISOString()
        };
        return { ...l, status, history: [...l.history, historyEntry] };
      }
      return l;
    }));
  };

  const handleAnalyzeLead = async (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const analysis = await analyzeLead(lead);
    setLeads(leads.map(l => {
      if (l.id === id) {
        const historyEntry: HistoryEntry = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'ai_update',
          content: `AI Analysis completed. Quality Score: ${analysis.score}%. Summary: ${analysis.summary}`,
          user: 'JewelFlow AI',
          createdAt: new Date().toISOString()
        };
        return { 
          ...l, 
          aiScore: analysis.score, 
          aiSummary: analysis.summary,
          aiFollowUp: analysis.followUpSuggestion,
          history: [...l.history, historyEntry]
        };
      }
      return l;
    }));
  };

  const handleAddManualNote = (id: string, note: string) => {
    setLeads(leads.map(l => {
      if (l.id === id) {
        const historyEntry: HistoryEntry = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'note',
          content: note,
          user: currentUser?.name || 'System',
          createdAt: new Date().toISOString()
        };
        return { ...l, history: [...l.history, historyEntry] };
      }
      return l;
    }));
  };

  const handleViewDetails = (id: string) => {
    setSelectedLeadId(id);
    setView('lead-details');
  };

  const filteredLeads = leads.filter(lead => {
    if (currentUser?.role === 'Admin' || currentUser?.role === 'Manager') return true;
    return lead.leadGeneratorId === currentUser?.id;
  });

  if (!currentUser) {
    return <Login onLogin={handleLogin} syncStatus={{ isSyncing, syncError }} onRetrySync={handleSync} />;
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard leads={filteredLeads} />;
      case 'leads':
        return <LeadTable 
          leads={filteredLeads} 
          onUpdateStatus={handleUpdateStatus} 
          onAnalyze={handleAnalyzeLead} 
          onViewDetails={handleViewDetails}
        />;
      case 'add-lead':
        return <LeadForm 
          onSave={handleAddLead} 
          onCancel={() => setView('leads')} 
          settings={settings}
          users={users}
          currentUser={currentUser}
        />;
      case 'lead-details':
        const lead = leads.find(l => l.id === selectedLeadId);
        if (!lead) return <Dashboard leads={filteredLeads} />;
        return <LeadDetails 
          lead={lead} 
          currentUser={currentUser} 
          onBack={() => setView('leads')}
          onAddNote={handleAddManualNote}
        />;
      case 'user-mgmt':
        return <UserManagement users={users} onAddUser={handleAddUser} onDeleteUser={handleDeleteUser} onRefresh={handleSync} isSyncing={isSyncing} />;
      case 'settings':
        return <Settings settings={settings} onUpdateSettings={setSettings} />;
      case 'analytics':
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] p-8">
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center max-w-lg">
              <div className="bg-amber-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BrainCircuit className="text-amber-600 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">Performance Analytics</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Aggregated staff performance reporting and deep-funnel conversion tracking for the {currentUser.role} office.
              </p>
              <button onClick={() => setView('dashboard')} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all">Back to Dashboard</button>
            </div>
          </div>
        );
      default:
        return <Dashboard leads={filteredLeads} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={view} setView={setView} currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-1 bg-slate-50 overflow-y-auto max-h-screen">
        <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md px-8 py-4 border-b border-slate-200/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">JewelFlow</span>
            <span className="text-xs font-bold text-slate-900">/</span>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{view.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${syncError ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                {isSyncing ? <RefreshCcw size={10} className="animate-spin" /> : (syncError ? <CloudOff size={10} /> : <Cloud size={10} />)}
                {isSyncing ? 'Syncing...' : (syncError ? 'Cloud Error' : 'Cloud Active')}
              </div>
             {view !== 'add-lead' && view !== 'lead-details' && (
               <button onClick={() => setView('add-lead')} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all">+ New Lead</button>
             )}
             <div className="h-8 w-px bg-slate-200"></div>
             <div className="flex items-center gap-3">
               <div className="text-right">
                 <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                 <p className="text-[10px] text-slate-500 font-medium">{currentUser.email}</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black">{currentUser.role.charAt(0)}</div>
             </div>
          </div>
        </div>
        {renderView()}
      </main>
    </div>
  );
};

export default App;

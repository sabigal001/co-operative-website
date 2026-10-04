import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { adminService } from '../../services/api/adminService';
import type { SystemMetrics } from '../../types';
import { AdminHeader } from './AdminHeader';
import { MasterAdminView } from './MasterAdminView';
import { TreasurerView } from './TreasurerView';
import { PaOfficerView } from './PaOfficerView';

export const AdminPortalView: React.FC = () => {
  const { activeAdminRole, dataVersion } = useApp();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);

  useEffect(() => {
    adminService.getSystemMetrics().then((res) => {
      if (res.success) setMetrics(res.data);
    });
  }, [dataVersion]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300">
      {/* Admin Identity & Metrics Header */}
      <AdminHeader metrics={metrics} />

      {/* Main Dynamic Workspace by Role */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="animate-slide-up">
          {activeAdminRole === 'master_admin' && <MasterAdminView metrics={metrics} />}
          {activeAdminRole === 'treasurer' && <TreasurerView />}
          {activeAdminRole === 'pa_officer' && <PaOfficerView />}
        </div>
      </div>
    </div>
  );
};

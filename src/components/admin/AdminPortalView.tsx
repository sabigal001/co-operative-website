import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { adminService } from '../../services/api/adminService';
import type { SystemMetrics } from '../../types';
import { AdminHeader } from './AdminHeader';
import { MasterAdminView } from './MasterAdminView';
import { TreasurerView } from './TreasurerView';
import { PaOfficerView } from './PaOfficerView';
import { AdminLoginView } from './AdminLoginView';

export const AdminPortalView: React.FC = () => {
  const { activeAdminRole, dataVersion, isAdminLoggedIn } = useApp();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn) return;
    adminService.getSystemMetrics().then((res) => {
      if (res.success) setMetrics(res.data);
    });
  }, [dataVersion, isAdminLoggedIn]);

  // Gate: Show login if not authenticated
  if (!isAdminLoggedIn) {
    return <AdminLoginView />;
  }

  // Safely render workspace by role, with MasterAdminView as the robust default
  const renderRoleWorkspace = () => {
    if (activeAdminRole === 'treasurer') {
      return <TreasurerView />;
    }
    if (activeAdminRole === 'pa_officer') {
      return <PaOfficerView />;
    }
    // Default for master_admin, secretary, super_admin, staff, or fallback
    return <MasterAdminView metrics={metrics} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300">
      {/* Admin Identity & Metrics Header */}
      <AdminHeader metrics={metrics} />

      {/* Main Dynamic Workspace by Role */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="animate-slide-up">
          {renderRoleWorkspace()}
        </div>
      </div>
    </div>
  );
};

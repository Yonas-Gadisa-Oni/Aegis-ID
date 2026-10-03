import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom';

import {
  LayoutDashboard,
  IdCard,
  FileText,
  Users,
  ScanLine,
  Activity,
  ShieldAlert,
  LogOut,
  Bell,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const groups = {
  STUDENT: [
    ['/student', LayoutDashboard, 'Dashboard'],
    ['/student/id', IdCard, 'Digital ID'],
    ['/student/permissions', FileText, 'Permissions'],
  ],

  ADMIN: [
    ['/admin', LayoutDashboard, 'Dashboard'],
    ['/admin/permissions', FileText, 'Permissions'],
    ['/admin/students', Users, 'Students'],
    ['/admin/monitoring', Activity, 'Monitoring'],
    ['/admin/access', ClipboardList, 'Access Records'],
    ['/admin/alerts', ShieldAlert, 'Alerts'],
  ],

  REGISTRAR: [
    ['/registrar', LayoutDashboard, 'Dashboard'],
    ['/registrar/student-id', IdCard, 'Student ID'],
  ],

  GATEWAY: [
    ['/gateway', ScanLine, 'Gateway Scanner'],
    ['/gateway/activity', Activity, 'Recent Activity'],
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [pendingPermissions, setPendingPermissions] =
    useState(0);

  const [openAlerts, setOpenAlerts] = useState(0);

  const [toast, setToast] = useState(null);

  const previousPending = useRef(null);

  useEffect(() => {
    if (user?.user?.role !== 'ADMIN') {
      return;
    }

    const loadCounts = async () => {
      try {
        const [
          permissionsResponse,
          alertsResponse,
        ] = await Promise.all([
          api.get('/permissions?status=PENDING'),
          api.get('/admin/alerts'),
        ]);

        const newPending =
          permissionsResponse.data.length;

        const newAlerts =
          alertsResponse.data.length;

        /*
         * Detect a newly submitted permission request.
         */
        if (
          previousPending.current !== null &&
          newPending > previousPending.current
        ) {
          const newestPermission =
            permissionsResponse.data[0];

          setToast({
            type: 'permission',
            title: 'New Permission Request',
            message: newestPermission
              ? `${newestPermission.full_name} has submitted a campus permission request.`
              : 'A new campus permission request has been submitted.',
          });
        }

        previousPending.current = newPending;

        setPendingPermissions(newPending);
        setOpenAlerts(newAlerts);
      } catch (error) {
        console.error(
          'Failed to load notification counts:',
          error
        );
      }
    };

    loadCounts();

    const interval = setInterval(
      loadCounts,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  /*
   * Automatically remove the toast after 4 seconds.
   */
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast]);

  return (
    <div className="app">

      <aside>

        <div className="brand">
          <div className="brand-mark">
            A
          </div>

          <div>
            <b>AEGIS ID</b>
            <small>EDU ACCESS SYSTEM</small>
          </div>
        </div>

        <div className="profile">
          <div className="avatar">
            {user?.user?.email?.[0]?.toUpperCase()}
          </div>

          <div>
            <b>
              {user?.student?.full_name ||
                user?.user?.role}
            </b>

            <small>
              {user?.user?.email}
            </small>
          </div>
        </div>

        <nav>

          {(groups[user?.user?.role] || []).map(
            ([to, I, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to.split('/').length === 2}
              >
                <I size={18} />

                <span>{label}</span>

                {user?.user?.role === 'ADMIN' &&
                  label === 'Permissions' &&
                  pendingPermissions > 0 && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        minWidth: '22px',
                        height: '22px',
                        padding: '0 6px',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '700',
                        background: '#d64545',
                        color: '#fff',
                      }}
                    >
                      {pendingPermissions}
                    </span>
                  )}

                {user?.user?.role === 'ADMIN' &&
                  label === 'Alerts' &&
                  openAlerts > 0 && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        minWidth: '22px',
                        height: '22px',
                        padding: '0 6px',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '700',
                        background: '#d64545',
                        color: '#fff',
                      }}
                    >
                      {openAlerts}
                    </span>
                  )}
              </NavLink>
            )
          )}

          <NavLink to="/notifications">
            <Bell size={18} />
            <span>Notifications</span>
          </NavLink>

        </nav>

        <button
          className="logout"
          onClick={() => {
            logout();
            nav('/login');
          }}
        >
          <LogOut size={18} />
          Sign out
        </button>

      </aside>

      <main>

        <header>
          <div>
            <span className="eyebrow">
              ETHIOPIAN DEFENCE UNIVERSITY
            </span>

            <h1>Aegis ID</h1>
          </div>

          <div className="header-pill">
            <span className="dot" />
            System operational
          </div>
        </header>

        <section className="content">
          <Outlet />
        </section>

      </main>

      {/* NEW PERMISSION TOAST */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            width: '360px',
            maxWidth: 'calc(100vw - 48px)',
            background: '#ffffff',
            border: '1px solid #dfe5ec',
            borderRadius: '14px',
            boxShadow:
              '0 12px 35px rgba(0, 0, 0, 0.16)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '13px',
            zIndex: 9999,
            animation:
              'aegisToastIn 0.25s ease-out',
          }}
        >

          <div
            style={{
              width: '38px',
              height: '38px',
              minWidth: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#eef5ff',
              color: '#2463eb',
            }}
          >
            <CheckCircle2 size={21} />
          </div>

          <div style={{ flex: 1 }}>

            <div
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#182230',
                marginBottom: '5px',
              }}
            >
              {toast.title}
            </div>

            <div
              style={{
                fontSize: '13px',
                lineHeight: '1.5',
                color: '#596575',
              }}
            >
              {toast.message}
            </div>

            <div
              style={{
                marginTop: '8px',
                fontSize: '11px',
                color: '#8993a1',
              }}
            >
              Aegis ID • Just now
            </div>

          </div>

        </div>
      )}

      <style>
        {`
          @keyframes aegisToastIn {
            from {
              opacity: 0;
              transform: translateY(15px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}
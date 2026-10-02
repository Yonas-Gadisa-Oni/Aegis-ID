import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function Permissions() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    try {
      const response = await api.get('/permissions');
      setRows(response.data);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (permission, approved) => {
    let hours = 24;
    let note = '';

    if (approved) {
      hours = Number(
        prompt(
          'Approved duration in hours',
          permission.category === 'MILITARY' ? 24 : 48
        )
      );

      if (!hours) {
        return;
      }
    } else {
      note =
        prompt(
          'Reason for denial',
          'Request does not meet current authorization requirements.'
        ) || '';
    }

    try {
      await api.post(
        `/permissions/${permission.id}/${approved ? 'approve' : 'deny'}`,
        approved
          ? {
              durationHours: hours,
              adminNote: note,
            }
          : {
              adminNote: note,
            }
      );

      await load();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Action failed'
      );
    }
  };

  return (
    <>
      <div className="page-title">
        <div>
          <span className="eyebrow">REVIEW QUEUE</span>

          <h2>Permission requests</h2>

          <p>
            Review, authorize and document campus absence requests.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Category</th>
                <th>Requested return</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((permission) => (
                <tr key={permission.id}>
                  <td>
                    <b>{permission.full_name}</b>
                    <small>{permission.student_id}</small>
                  </td>

                  <td>{permission.category}</td>

                  <td>
                    {new Date(
                      permission.requested_return
                    ).toLocaleString()}
                  </td>

                  <td>{permission.reason}</td>

                  <td>
                    <StatusBadge value={permission.status} />
                  </td>

                  <td>
                    {permission.status === 'PENDING' && (
                      <div className="actions">
                        <button
                          className="success-btn"
                          onClick={() =>
                            decide(permission, true)
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="danger-btn"
                          onClick={() =>
                            decide(permission, false)
                          }
                        >
                          Deny
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
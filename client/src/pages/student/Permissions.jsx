import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function Permissions() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    departure: '',
    returnTime: '',
    reason: '',
  });
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const response = await api.get('/permissions');
      setRows(response.data);
    } catch (error) {
      setMsg(
        error.response?.data?.message ||
          'Unable to load permission requests.'
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/permissions', form);

      setMsg('Permission request submitted.');

      setForm({
        departure: '',
        returnTime: '',
        reason: '',
      });

      await load();
    } catch (error) {
      setMsg(
        error.response?.data?.message ||
          'Request failed'
      );
    }
  };

  return (
    <>
      <div className="page-title">
        <div>
          <span className="eyebrow">PERMISSION MANAGEMENT</span>
          <h2>Campus permissions</h2>
          <p>
            Request and track authorization to leave and return to campus.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <h3>New permission request</h3>
          </div>

          <form className="stack" onSubmit={submit}>
            <label>
              Departure
              <input
                type="datetime-local"
                value={form.departure}
                onChange={(e) =>
                  setForm({
                    ...form,
                    departure: e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Expected return
              <input
                type="datetime-local"
                value={form.returnTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    returnTime: e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Reason
              <textarea
                value={form.reason}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reason: e.target.value,
                  })
                }
                rows="4"
                placeholder="Explain the reason for your request"
                required
              />
            </label>

            {msg && <div className="notice">{msg}</div>}

            <button className="primary" type="submit">
              Submit request
            </button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Request history</h3>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Requested return</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((permission) => (
                  <tr key={permission.id}>
                    <td>
                      {new Date(
                        permission.requested_return
                      ).toLocaleString()}
                    </td>

                    <td>{permission.reason}</td>

                    <td>
                      <StatusBadge value={permission.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
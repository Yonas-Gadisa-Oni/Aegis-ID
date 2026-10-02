import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Gateway() {
  const [qr, setQr] = useState('');
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState([]);
  const [countdown, setCountdown] = useState(5);

  const load = async () => {
    try {
      const response = await api.get('/gateway/recent');
      setRecent(response.data);
    } catch (error) {
      console.error(
        'Failed to load recent gate activity:',
        error
      );
    }
  };

  const verify = async (text) => {
    if (!text) {
      return;
    }

    try {
      const response = await api.post('/gateway/verify', {
        qr: text,
      });

      setResult({
        ...response.data,
        qr: text,
      });

      setQr(text);
      setCountdown(5);
    } catch (error) {
      setResult({
        allowed: false,
        reason:
          error.response?.data?.reason ||
          error.response?.data?.message ||
          'Verification failed',
        qr: text,
      });

      setQr(text);
      setCountdown(5);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: {
          width: 240,
          height: 240,
        },
      },
      false
    );

    scanner.render(
      (text) => {
        verify(text);
      },
      () => {}
    );

    load();

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  // Visible 5-second countdown
  useEffect(() => {
    if (!result) {
      return;
    }

    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(interval);
          setResult(null);
          setQr('');
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [result]);

  const act = async (action) => {
    try {
      const response = await api.post(
        `/gateway/${action}`,
        {
          qr,
        }
      );

      alert(response.data.message);

      setResult(null);
      setQr('');
      setCountdown(5);

      await load();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Action failed'
      );
    }
  };

  const isInside =
    result?.student?.campusStatus === 'INSIDE';

  const isOutside =
    result?.student?.campusStatus === 'OUTSIDE';

  return (
    <>
      <div className="page-title">
        <div>
          <span className="eyebrow">
            GATEWAY OPERATIONS
          </span>

          <h2>QR verification</h2>

          <p>
            Scan a student identity to verify and record
            campus movement.
          </p>
        </div>
      </div>

      <div className="gateway-grid">
        <div className="panel scanner">
          <div id="qr-reader"></div>

          <div className="manual">
            <input
              placeholder="Paste QR identifier for testing"
              value={qr}
              onChange={(e) =>
                setQr(e.target.value)
              }
            />

            <button
              className="secondary"
              onClick={() => verify(qr)}
            >
              Verify
            </button>
          </div>
        </div>

        <div className="panel result-panel">
          {result ? (
            <>
              <div
                className={
                  result.allowed
                    ? 'access granted'
                    : 'access denied'
                }
              >
                <div className="result-icon">
                  {result.allowed ? '✓' : '!'}
                </div>

                <span>
                  {result.allowed
                    ? 'ACCESS GRANTED'
                    : 'ACCESS DENIED'}
                </span>

                <h3>
                  {result.student?.fullName ||
                    'Verification failed'}
                </h3>

                <p>{result.reason}</p>

                <div
                  style={{
                    marginTop: '15px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  Next scan in {countdown} seconds
                </div>
              </div>

              {result.student && (
                <div className="actions big">
                  {isInside &&
                    result.allowed && (
                      <button
                        className="success-btn"
                        onClick={() =>
                          act('exit')
                        }
                      >
                        Record Exit
                      </button>
                    )}

                  {isOutside && (
                    <button
                      className="secondary"
                      onClick={() =>
                        act('entry')
                      }
                    >
                      Record Entry
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="empty tall">
              Scan a QR code to begin verification.
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Recent gate activity</h3>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Student</th>
                <th>Action</th>
                <th>Gate</th>
              </tr>
            </thead>

            <tbody>
              {recent.map((record) => (
                <tr key={record.id}>
                  <td>
                    {new Date(
                      record.timestamp
                    ).toLocaleString()}
                  </td>

                  <td>
                    {record.full_name}
                    <small>
                      {record.student_id}
                    </small>
                  </td>

                  <td>
                    <span
                      className={`action ${record.action.toLowerCase()}`}
                    >
                      {record.action}
                    </span>
                  </td>

                  <td>{record.gate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
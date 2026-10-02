import { useState } from 'react';
import { api } from '../../services/api';

export default function RegistrarDashboard() {
  const [form, setForm] = useState({
    studentId: '',
    fullName: '',
    category: 'MILITARY',
    email: '',
    phone: '',
    department: '',
    yearLevel: '',
    photoUrl: '',
  });

  const [student, setStudent] = useState(null);
  const [qr, setQr] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const createStudent = async (e) => {
    e.preventDefault();

    setError('');
    setStudent(null);
    setQr(null);
    setAccount(null);
    setSaving(true);

    try {
      const response = await api.post('/students', form);

      setStudent(response.data.student);
      setQr(response.data.qr);
      setAccount(response.data.account);

      setForm({
        studentId: '',
        fullName: '',
        category: 'MILITARY',
        email: '',
        phone: '',
        department: '',
        yearLevel: '',
        photoUrl: '',
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Failed to create student'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-title">
        <div>
          <span className="eyebrow">
            REGISTRAR OPERATIONS
          </span>

          <h2>Student Registration</h2>

          <p>
            Register a student and prepare their
            digital identification.
          </p>
        </div>
      </div>

      <div className="gateway-grid">

        {/* REGISTRATION FORM */}
        <div className="panel">
          <div className="panel-head">
            <h3>Add New Student</h3>
          </div>

          <form onSubmit={createStudent}>

            <div className="form-grid">

              <div>
                <label>Student ID</label>

                <input
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  placeholder="EDU-2026-0002"
                  required
                />
              </div>

              <div>
                <label>Full Name</label>

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full student name"
                  required
                />
              </div>

              <div>
                <label>Category</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="MILITARY">
                    Military
                  </option>

                  <option value="CIVILIAN">
                    Civilian
                  </option>
                </select>
              </div>

              <div>
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  required
                />
              </div>

              <div>
                <label>Phone</label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+251..."
                />
              </div>

              <div>
                <label>Department</label>

                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Department"
                />
              </div>

              <div>
                <label>Year Level</label>

                <input
                  name="yearLevel"
                  value={form.yearLevel}
                  onChange={handleChange}
                  placeholder="Year 1"
                />
              </div>

              <div>
                <label>Photo URL</label>

                <input
                  name="photoUrl"
                  value={form.photoUrl}
                  onChange={handleChange}
                  placeholder="Optional photo URL"
                />
              </div>

            </div>

            {error && (
              <div className="access denied">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="success-btn"
              disabled={saving}
              style={{
                marginTop: '20px',
              }}
            >
              {saving
                ? 'Creating Student...'
                : 'Create Student'}
            </button>

          </form>
        </div>

        {/* STUDENT RESULT */}
        <div className="panel">
          <div className="panel-head">
            <h3>Student ID Preparation</h3>
          </div>

          {!student ? (
            <div className="empty tall">
              Create a student to prepare their
              identification.
            </div>
          ) : (
            <div>

              <h3>{student.full_name}</h3>

              <p>
                <strong>Student ID:</strong>{' '}
                {student.student_id}
              </p>

              <p>
                <strong>Category:</strong>{' '}
                {student.category}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {student.status}
              </p>

              {/* LOGIN ACCOUNT */}
              {account && (
                <div
                  className="panel"
                  style={{
                    marginTop: '20px',
                    padding: '18px',
                  }}
                >
                  <h3>
                    Student Login Credentials
                  </h3>

                  <p>
                    <strong>Email:</strong>{' '}
                    {account.email}
                  </p>

                  <p>
                    <strong>Role:</strong>{' '}
                    {account.role}
                  </p>

                  <p>
                    <strong>Temporary Password:</strong>{' '}
                    <span
                      style={{
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                      }}
                    >
                      {account.temporaryPassword}
                    </span>
                  </p>

                  <p
                    style={{
                      marginTop: '12px',
                      fontSize: '13px',
                      opacity: 0.8,
                    }}
                  >
                    Give these login credentials to
                    the student. The password was
                    generated automatically.
                  </p>
                </div>
              )}

              {/* QR CODE */}
              {qr?.dataUrl && (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '20px',
                  }}
                >
                  <img
                    src={qr.dataUrl}
                    alt="Student QR Code"
                    style={{
                      width: '280px',
                      maxWidth: '100%',
                    }}
                  />

                  <p>
                    <strong>
                      QR ID ready
                    </strong>
                  </p>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
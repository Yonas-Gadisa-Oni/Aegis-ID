import { useEffect, useMemo, useState } from 'react';

import {
  Search,
  Pencil,
  Trash2,
  Eye,
  IdCard,
  Users,
  Loader2,
  X,
  Save,
  AlertTriangle,
} from 'lucide-react';

import { api } from '../../services/api';
import StudentIDCard from '../../components/StudentIDCard';


/* =========================================================
   HELPERS
========================================================= */

function normalizeStudent(student) {
  return {
    ...student,

    id:
      student.id ||
      student.student_id,

    student_id:
      student.student_id ||
      student.studentId ||
      '',

    full_name:
      student.full_name ||
      student.full_name_en ||
      student.fullName ||
      'Unknown Student',

    full_name_en:
      student.full_name_en ||
      student.full_name ||
      '',

    full_name_am:
      student.full_name_am ||
      '',

    category:
      student.category ||
      student.category_en ||
      '',

    category_en:
      student.category_en ||
      student.category ||
      '',

    category_am:
      student.category_am ||
      '',

    department:
      student.department ||
      '',

    year_level:
      student.year_level ||
      '',

    gender:
      student.gender ||
      student.gender_en ||
      '',

    gender_en:
      student.gender_en ||
      student.gender ||
      '',

    gender_am:
      student.gender_am ||
      '',

    blood_group:
      student.blood_group ||
      student.blood_group_en ||
      '',

    blood_group_en:
      student.blood_group_en ||
      student.blood_group ||
      '',

    blood_group_am:
      student.blood_group_am ||
      '',

    resident_address:
      student.resident_address ||
      student.residence ||
      student.resident_address_en ||
      '',

    resident_address_en:
      student.resident_address_en ||
      student.residence ||
      '',

    resident_address_am:
      student.resident_address_am ||
      '',

    phone:
      student.phone ||
      '',

    emergency_contact_name:
      student.emergency_contact_name ||
      student.emergency_contact_name_en ||
      '',

    emergency_contact_name_en:
      student.emergency_contact_name_en ||
      student.emergency_contact_name ||
      '',

    emergency_contact_name_am:
      student.emergency_contact_name_am ||
      '',

    emergency_contact_phone:
      student.emergency_contact_phone ||
      student.emergency_contact_phone_en ||
      '',

    emergency_contact_phone_en:
      student.emergency_contact_phone_en ||
      student.emergency_contact_phone ||
      '',

    emergency_contact_phone_am:
      student.emergency_contact_phone_am ||
      '',

    photo_url:
      student.photo_url ||
      '',

    date_of_birth_gregorian:
      student.date_of_birth_gregorian ||
      student.date_of_birth ||
      '',

    issue_date:
      student.issue_date ||
      '',

    expiry_date:
      student.expiry_date ||
      '',

    status:
      student.status ||
      'ACTIVE',
  };
}


function formatDate(value) {
  if (!value) {
    return 'Not provided';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}


function inputDate(value) {
  if (!value) {
    return '';
  }

  const text = String(value);

  if (text.length >= 10) {
    return text.slice(0, 10);
  }

  return text;
}


function studentToEditForm(student) {
  const s = normalizeStudent(student);

  return {
    studentId:
      s.student_id || '',

    fullNameEn:
      s.full_name_en || '',

    fullNameAm:
      s.full_name_am || '',

    genderEn:
      s.gender_en || '',

    genderAm:
      s.gender_am || '',

    bloodGroupEn:
      s.blood_group_en || '',

    bloodGroupAm:
      s.blood_group_am || '',

    categoryEn:
      s.category_en || s.category || '',

    categoryAm:
      s.category_am || '',

    residentAddressEn:
      s.resident_address_en ||
      s.resident_address ||
      '',

    residentAddressAm:
      s.resident_address_am || '',

    emergencyContactNameEn:
      s.emergency_contact_name_en ||
      s.emergency_contact_name ||
      '',

    emergencyContactNameAm:
      s.emergency_contact_name_am || '',

    emergencyContactPhoneEn:
      s.emergency_contact_phone_en ||
      s.emergency_contact_phone ||
      '',

    emergencyContactPhoneAm:
      s.emergency_contact_phone_am || '',

    email:
      s.account_email ||
      s.email ||
      '',

    newPassword: '',

    confirmPassword: '',

    phone:
      s.phone || '',

    department:
      s.department || '',

    yearLevel:
      s.year_level || '',

    photoUrl:
      s.photo_url || '',

    dateOfBirthGregorian:
      inputDate(
        s.date_of_birth_gregorian ||
        s.date_of_birth
      ),

    dateOfBirthEthiopianYear:
      s.date_of_birth_ethiopian_year ||
      '',

    dateOfBirthEthiopianMonth:
      s.date_of_birth_ethiopian_month ||
      '',

    dateOfBirthEthiopianDay:
      s.date_of_birth_ethiopian_day ||
      '',

    issueDateGregorian:
      inputDate(s.issue_date),

    issueDateEthiopianYear:
      s.issue_date_ethiopian_year ||
      '',

    issueDateEthiopianMonth:
      s.issue_date_ethiopian_month ||
      '',

    issueDateEthiopianDay:
      s.issue_date_ethiopian_day ||
      '',

    expiryDateGregorian:
      inputDate(s.expiry_date),

    expiryDateEthiopianYear:
      s.expiry_date_ethiopian_year ||
      '',

    expiryDateEthiopianMonth:
      s.expiry_date_ethiopian_month ||
      '',

    expiryDateEthiopianDay:
      s.expiry_date_ethiopian_day ||
      '',
  };
}


/* =========================================================
   COMPONENT
========================================================= */

export default function StudentID() {

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [selectedStudentQr, setSelectedStudentQr] =
    useState('');

  const [qrLoading, setQrLoading] =
    useState(false);

  const [showView, setShowView] =
    useState(false);

  const [editingStudent, setEditingStudent] =
    useState(null);

  const [editForm, setEditForm] =
    useState(null);

  const [editPhoto, setEditPhoto] =
    useState('');

  const [passwordError, setPasswordError] =
    useState('');

  const [saving, setSaving] =
    useState(false);

  const [deleteStudent, setDeleteStudent] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [message, setMessage] =
    useState('');


  /* =========================================================
     LOAD STUDENTS
  ========================================================= */

  const loadStudents = async () => {

    setLoading(true);
    setError('');

    try {

      const response =
        await api.get('/students');

      const data =
        response.data;

      const list =
        Array.isArray(data)
          ? data
          : data?.students ||
            data?.data ||
            data?.rows ||
            [];

      setStudents(
        list.map(normalizeStudent)
      );

    } catch (requestError) {

      console.error(
        'Failed to load students:',
        requestError
      );

      setError(
        requestError?.response?.data?.message ||
        'Failed to load registered students.'
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {
    loadStudents();
  }, []);


  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredStudents =
    useMemo(() => {

      const value =
        search.trim().toLowerCase();

      if (!value) {
        return students;
      }

      return students.filter((student) => {

        const name =
          String(
            student.full_name ||
            student.full_name_en ||
            ''
          ).toLowerCase();

        const studentId =
          String(
            student.student_id ||
            ''
          ).toLowerCase();

        const department =
          String(
            student.department ||
            ''
          ).toLowerCase();

        return (
          name.includes(value) ||
          studentId.includes(value) ||
          department.includes(value)
        );
      });

    }, [students, search]);


  /* =========================================================
     VIEW DIGITAL ID
  ========================================================= */

  const openStudent = async (student) => {

    setSelectedStudent(
      normalizeStudent(student)
    );

    setSelectedStudentQr('');

    setShowView(true);

    setQrLoading(true);

    try {

      const response =
        await api.get(
          `/students/${student.id}/qr`
        );

      setSelectedStudentQr(
        response.data?.value || ''
      );

    } catch (requestError) {

      console.error(
        'Failed to load student QR:',
        requestError
      );

      setSelectedStudentQr('');

    } finally {

      setQrLoading(false);
    }
  };


  /* =========================================================
     OPEN EDIT
  ========================================================= */

  const openEdit = (student) => {

    const normalized =
      normalizeStudent(student);

    setEditingStudent(
      normalized
    );

    setEditForm(
      studentToEditForm(normalized)
    );

    setEditPhoto(
      normalized.photo_url || ''
    );

    setPasswordError('');
  };


  /* =========================================================
     EDIT FIELD
  ========================================================= */

  const updateEditField = (
    field,
    value
  ) => {

    setEditForm((current) => ({
      ...current,
      [field]: value,
    }));
  };


  /* =========================================================
     PHOTO
  ========================================================= */

  const handlePhotoChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith('image/')
    ) {

      alert(
        'Please select an image file.'
      );

      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {

      alert(
        'Photo must be smaller than 2 MB.'
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {

      const result =
        reader.result;

      setEditPhoto(
        result
      );
    };

    reader.readAsDataURL(file);
  };


  /* =========================================================
     SAVE EDIT
  ========================================================= */

  const saveEdit = async (
    event
  ) => {

    event.preventDefault();

    if (!editingStudent || !editForm) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');
    setPasswordError('');

    const newPassword =
      String(editForm.newPassword || '');

    const confirmPassword =
      String(editForm.confirmPassword || '');

    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        setPasswordError(
          'New password must be at least 8 characters long.'
        );
        setSaving(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError(
          'New password and confirmation password do not match.'
        );
        setSaving(false);
        return;
      }
    }

    try {

      const response =
        await api.patch(
          `/students/${editingStudent.id}`,
          {
            studentIdNumber:
              editForm.studentId,

            fullName:
              editForm.fullNameEn,

            fullNameEn:
              editForm.fullNameEn,

            fullNameAm:
              editForm.fullNameAm,

            genderEn:
              editForm.genderEn,

            genderAm:
              editForm.genderAm,

            bloodGroupEn:
              editForm.bloodGroupEn,

            bloodGroupAm:
              editForm.bloodGroupAm,

            category:
              editForm.categoryEn,

            categoryEn:
              editForm.categoryEn,

            categoryAm:
              editForm.categoryAm,

            residentAddressEn:
              editForm.residentAddressEn,

            residentAddressAm:
              editForm.residentAddressAm,

            emergencyContactNameEn:
              editForm.emergencyContactNameEn,

            emergencyContactNameAm:
              editForm.emergencyContactNameAm,

            emergencyContactPhoneEn:
              editForm.emergencyContactPhoneEn,

            emergencyContactPhoneAm:
              editForm.emergencyContactPhoneAm,

            email:
              editForm.email,

            newPassword:
              newPassword,

            phone:
              editForm.phone,

            department:
              editForm.department,

            yearLevel:
              editForm.yearLevel,

            photoUrl:
              editPhoto,

            dateOfBirthGregorian:
              editForm.dateOfBirthGregorian,

            dateOfBirthEthiopianYear:
              editForm.dateOfBirthEthiopianYear,

            dateOfBirthEthiopianMonth:
              editForm.dateOfBirthEthiopianMonth,

            dateOfBirthEthiopianDay:
              editForm.dateOfBirthEthiopianDay,

            issueDateGregorian:
              editForm.issueDateGregorian,

            issueDateEthiopianYear:
              editForm.issueDateEthiopianYear,

            issueDateEthiopianMonth:
              editForm.issueDateEthiopianMonth,

            issueDateEthiopianDay:
              editForm.issueDateEthiopianDay,

            expiryDateGregorian:
              editForm.expiryDateGregorian,

            expiryDateEthiopianYear:
              editForm.expiryDateEthiopianYear,

            expiryDateEthiopianMonth:
              editForm.expiryDateEthiopianMonth,

            expiryDateEthiopianDay:
              editForm.expiryDateEthiopianDay,
          }
        );

      const updated =
        response.data?.student ||
        response.data;

      const normalizedUpdated =
        normalizeStudent(updated);

      setStudents((current) =>
        current.map((student) =>
          student.id ===
          editingStudent.id
            ? normalizedUpdated
            : student
        )
      );

      setMessage(
        response.data?.passwordChanged
          ? 'Student information and login password updated successfully.'
          : 'Student information updated successfully.'
      );

      setEditingStudent(null);
      setEditForm(null);
      setEditPhoto('');

      await loadStudents();

    } catch (requestError) {

      console.error(
        'Failed to update student:',
        requestError
      );

      setError(
        requestError?.response?.data?.message ||
        'Failed to update student.'
      );

    } finally {

      setSaving(false);
    }
  };


  /* =========================================================
     DELETE
  ========================================================= */

  const confirmDelete = async () => {

    if (!deleteStudent) {
      return;
    }

    setDeleting(true);
    setError('');
    setMessage('');

    try {

      await api.delete(
        `/students/${deleteStudent.id}`
      );

      setStudents((current) =>
        current.filter(
          (student) =>
            student.id !==
            deleteStudent.id
        )
      );

      setMessage(
        'Student ID and associated account were permanently deleted.'
      );

      setDeleteStudent(null);

    } catch (requestError) {

      console.error(
        'Failed to delete student:',
        requestError
      );

      setError(
        requestError?.response?.data?.message ||
        'Failed to delete student.'
      );

    } finally {

      setDeleting(false);
    }
  };


  /* =========================================================
     CARD DATA
  ========================================================= */

  const cardStudent =
    selectedStudent
      ? {
          ...selectedStudent,

          full_name:
            selectedStudent.full_name_en ||
            selectedStudent.full_name,

          full_name_en:
            selectedStudent.full_name_en ||
            selectedStudent.full_name,

          category:
            selectedStudent.category_en ||
            selectedStudent.category,

          category_en:
            selectedStudent.category_en ||
            selectedStudent.category,

          gender:
            selectedStudent.gender_en ||
            selectedStudent.gender,

          blood_group:
            selectedStudent.blood_group_en ||
            selectedStudent.blood_group,

          resident_address:
            selectedStudent.resident_address_en ||
            selectedStudent.resident_address,

          emergency_contact_name:
            selectedStudent.emergency_contact_name_en ||
            selectedStudent.emergency_contact_name,

          emergency_contact_phone:
            selectedStudent.emergency_contact_phone_en ||
            selectedStudent.emergency_contact_phone,

          qr_value:
            selectedStudentQr,

          qr:
            selectedStudentQr,
        }
      : null;


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >

        <div>

          <span className="eyebrow">
            IDENTITY MANAGEMENT
          </span>

          <h2
            style={{
              margin: '5px 0 6px',
              fontSize: '26px',
              color: '#182230',
            }}
          >
            Student ID Management
          </h2>

          <p
            style={{
              margin: 0,
              color: '#697586',
              fontSize: '14px',
            }}
          >
            View, edit, and permanently manage
            registered student identification cards.
          </p>

        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            padding: '10px 15px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1px solid #dfe5ec',
          }}
        >

          <Users
            size={18}
            color="#2463eb"
          />

          <strong
            style={{
              color: '#182230',
              fontSize: '14px',
            }}
          >
            {students.length}
          </strong>

          <span
            style={{
              color: '#697586',
              fontSize: '13px',
            }}
          >
            Registered Students
          </span>

        </div>

      </div>


      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {message && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 14px',
            borderRadius: '10px',
            background: '#eef9f1',
            border: '1px solid #ccebd4',
            color: '#23733b',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 14px',
            borderRadius: '10px',
            background: '#fff1f1',
            border: '1px solid #f0cccc',
            color: '#b42318',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          {error}
        </div>
      )}


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #dfe5ec',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '18px',
        }}
      >

        <div
          style={{
            position: 'relative',
            maxWidth: '520px',
          }}
        >

          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '13px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8993a1',
            }}
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by student name, ID, or department..."
            style={{
              width: '100%',
              height: '44px',
              padding:
                '0 14px 0 40px',
              border:
                '1px solid #d7dde5',
              borderRadius: '10px',
              outline: 'none',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />

        </div>

      </div>


      {/* =====================================================
          STUDENT TABLE
      ===================================================== */}

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #dfe5ec',
          borderRadius: '14px',
          overflow: 'hidden',
        }}
      >

        <div
          style={{
            padding: '18px 20px',
            borderBottom:
              '1px solid #e7ebf0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >

          <div>

            <h3
              style={{
                margin: 0,
                color: '#182230',
                fontSize: '16px',
              }}
            >
              Registered Student IDs
            </h3>

            <p
              style={{
                margin:
                  '4px 0 0',
                color: '#8993a1',
                fontSize: '12px',
              }}
            >
              {filteredStudents.length}
              {' '}
              student
              {filteredStudents.length === 1
                ? ''
                : 's'}
              {' '}
              shown
            </p>

          </div>

        </div>


        {loading ? (

          <div
            style={{
              minHeight: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '10px',
              color: '#697586',
            }}
          >

            <Loader2
              size={28}
              className="registrar-spin"
            />

            <span>
              Loading registered students...
            </span>

          </div>

        ) : filteredStudents.length === 0 ? (

          <div
            style={{
              minHeight: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '10px',
              color: '#697586',
              padding: '30px',
              textAlign: 'center',
            }}
          >

            <IdCard
              size={42}
              color="#9aa4b2"
            />

            <strong
              style={{
                color: '#4b5563',
              }}
            >
              No registered students found
            </strong>

            <span
              style={{
                fontSize: '13px',
              }}
            >
              {search
                ? 'Try a different search term.'
                : 'Students registered through the Registrar page will appear here.'}
            </span>

          </div>

        ) : (

          <div
            style={{
              overflowX: 'auto',
            }}
          >

            <table
              style={{
                width: '100%',
                borderCollapse:
                  'collapse',
              }}
            >

              <thead>

                <tr
                  style={{
                    background: '#f7f9fc',
                    borderBottom:
                      '1px solid #e7ebf0',
                  }}
                >

                  <th
                    style={{
                      padding:
                        '13px 18px',
                      textAlign: 'left',
                      fontSize: '12px',
                      color: '#697586',
                      fontWeight: '700',
                    }}
                  >
                    STUDENT
                  </th>

                  <th
                    style={{
                      padding:
                        '13px 18px',
                      textAlign: 'left',
                      fontSize: '12px',
                      color: '#697586',
                      fontWeight: '700',
                    }}
                  >
                    STUDENT ID
                  </th>

                  <th
                    style={{
                      padding:
                        '13px 18px',
                      textAlign: 'left',
                      fontSize: '12px',
                      color: '#697586',
                      fontWeight: '700',
                    }}
                  >
                    CATEGORY
                  </th>

                  <th
                    style={{
                      padding:
                        '13px 18px',
                      textAlign: 'left',
                      fontSize: '12px',
                      color: '#697586',
                      fontWeight: '700',
                    }}
                  >
                    DEPARTMENT
                  </th>

                  <th
                    style={{
                      padding:
                        '13px 18px',
                      textAlign: 'right',
                      fontSize: '12px',
                      color: '#697586',
                      fontWeight: '700',
                    }}
                  >
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredStudents.map(
                  (student) => (

                    <tr
                      key={student.id}
                      style={{
                        borderBottom:
                          '1px solid #edf0f4',
                      }}
                    >

                      <td
                        style={{
                          padding:
                            '15px 18px',
                        }}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            openStudent(
                              student
                            )
                          }
                          style={{
                            border: 'none',
                            background:
                              'transparent',
                            padding: 0,
                            cursor:
                              'pointer',
                            textAlign:
                              'left',
                            color:
                              '#2463eb',
                            fontWeight:
                              '700',
                            fontSize:
                              '14px',
                          }}
                        >
                          {student.full_name}
                        </button>

                      </td>

                      <td
                        style={{
                          padding:
                            '15px 18px',
                          color:
                            '#394454',
                          fontWeight:
                            '600',
                          fontSize:
                            '13px',
                        }}
                      >
                        {student.student_id}
                      </td>

                      <td
                        style={{
                          padding:
                            '15px 18px',
                          color:
                            '#596575',
                          fontSize:
                            '13px',
                        }}
                      >
                        {student.category ||
                          'Not provided'}
                      </td>

                      <td
                        style={{
                          padding:
                            '15px 18px',
                          color:
                            '#596575',
                          fontSize:
                            '13px',
                        }}
                      >
                        {student.department ||
                          'Not provided'}
                      </td>

                      <td
                        style={{
                          padding:
                            '15px 18px',
                        }}
                      >

                        <div
                          style={{
                            display: 'flex',
                            justifyContent:
                              'flex-end',
                            gap: '7px',
                          }}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              openStudent(
                                student
                              )
                            }
                            title="View Digital ID"
                            style={{
                              display:
                                'inline-flex',
                              alignItems:
                                'center',
                              gap: '6px',
                              border:
                                '1px solid #cdd9eb',
                              background:
                                '#f5f8ff',
                              color:
                                '#2463eb',
                              borderRadius:
                                '8px',
                              padding:
                                '8px 10px',
                              cursor:
                                'pointer',
                              fontSize:
                                '12px',
                              fontWeight:
                                '700',
                            }}
                          >
                            <Eye size={15} />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEdit(
                                student
                              )
                            }
                            title="Edit Student ID"
                            style={{
                              display:
                                'inline-flex',
                              alignItems:
                                'center',
                              gap: '6px',
                              border:
                                '1px solid #d8dee8',
                              background:
                                '#ffffff',
                              color:
                                '#394454',
                              borderRadius:
                                '8px',
                              padding:
                                '8px 10px',
                              cursor:
                                'pointer',
                              fontSize:
                                '12px',
                              fontWeight:
                                '700',
                            }}
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteStudent(
                                student
                              )
                            }
                            title="Permanently Delete"
                            style={{
                              display:
                                'inline-flex',
                              alignItems:
                                'center',
                              gap: '6px',
                              border:
                                '1px solid #f0caca',
                              background:
                                '#fff6f6',
                              color:
                                '#c62828',
                              borderRadius:
                                '8px',
                              padding:
                                '8px 10px',
                              cursor:
                                'pointer',
                              fontSize:
                                '12px',
                              fontWeight:
                                '700',
                            }}
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================================
          VIEW DIGITAL ID MODAL
      ===================================================== */}

      {showView &&
        selectedStudent && (
          <div
            onMouseDown={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {
                setShowView(false);
              }

            }}
            style={{
              position: 'fixed',
              inset: 0,
              background:
                'rgba(15, 23, 42, 0.58)',
              zIndex: 5000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >

            <div
              style={{
                width: 'min(1180px, 96vw)',
                maxHeight: '92vh',
                overflowY: 'auto',
                background:
                  '#f7f9fc',
                borderRadius: '16px',
                position:
                  'relative',
                padding: '20px',
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setShowView(false)
                }
                style={{
                  position: 'sticky',
                  top: 0,
                  marginLeft: 'auto',
                  zIndex: 10,
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  width: '38px',
                  height: '38px',
                  borderRadius:
                    '10px',
                  border:
                    '1px solid #d8dee8',
                  background:
                    '#ffffff',
                  color:
                    '#394454',
                  cursor:
                    'pointer',
                  boxShadow:
                    '0 4px 14px rgba(0,0,0,0.08)',
                }}
              >
                <X size={19} />
              </button>

              <div
                style={{
                  marginBottom:
                    '14px',
                }}
              >

                <span className="eyebrow">
                  STUDENT ID
                </span>

                <h3
                  style={{
                    margin:
                      '4px 0',
                    color:
                      '#182230',
                  }}
                >
                  {selectedStudent.full_name}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color:
                      '#697586',
                    fontSize:
                      '13px',
                  }}
                >
                  {selectedStudent.student_id}
                </p>

              </div>

              {qrLoading ? (

                <div
                  style={{
                    padding:
                      '60px',
                    textAlign:
                      'center',
                    color:
                      '#697586',
                  }}
                >
                  <Loader2
                    size={30}
                    className="registrar-spin"
                  />

                  <div
                    style={{
                      marginTop:
                        '10px',
                    }}
                  >
                    Loading Digital ID...
                  </div>
                </div>

              ) : (

                <StudentIDCard
                  student={
                    cardStudent
                  }
                  qr={
                    selectedStudentQr
                  }
                />

              )}

            </div>

          </div>
        )}


      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editingStudent &&
        editForm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background:
                'rgba(15, 23, 42, 0.58)',
              zIndex: 5100,
              display: 'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              padding: '24px',
            }}
          >

            <div
              style={{
                width:
                  'min(1000px, 96vw)',
                maxHeight:
                  '92vh',
                overflowY:
                  'auto',
                background:
                  '#ffffff',
                borderRadius:
                  '16px',
                padding:
                  '24px',
                boxSizing:
                  'border-box',
              }}
            >

              <div
                style={{
                  display:
                    'flex',
                  alignItems:
                    'flex-start',
                  justifyContent:
                    'space-between',
                  gap: '20px',
                  marginBottom:
                    '22px',
                }}
              >

                <div>

                  <span className="eyebrow">
                    EDIT STUDENT
                  </span>

                  <h3
                    style={{
                      margin:
                        '5px 0',
                      fontSize:
                        '22px',
                      color:
                        '#182230',
                    }}
                  >
                    Edit Student ID
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color:
                        '#697586',
                      fontSize:
                        '13px',
                    }}
                  >
                    Update the student's
                    identification information.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingStudent(null);
                    setEditForm(null);
                    setEditPhoto('');
                  }}
                  style={{
                    width:
                      '38px',
                    height:
                      '38px',
                    display:
                      'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'center',
                    border:
                      '1px solid #d8dee8',
                    background:
                      '#ffffff',
                    borderRadius:
                      '9px',
                    cursor:
                      'pointer',
                    color:
                      '#596575',
                  }}
                >
                  <X size={19} />
                </button>

              </div>


              <form
                onSubmit={
                  saveEdit
                }
              >

                {/* AEGIS LOGIN ACCOUNT */}

                <div
                  style={{
                    marginBottom: '22px',
                    padding: '18px',
                    border: '1px solid #dbe4f0',
                    borderRadius: '12px',
                    background: '#f7faff',
                  }}
                >

                  <h4
                    style={{
                      margin: '0 0 6px',
                      color: '#182230',
                      fontSize: '15px',
                    }}
                  >
                    Aegis ID Login Account
                  </h4>

                  <p
                    style={{
                      margin: '0 0 16px',
                      color: '#697586',
                      fontSize: '12px',
                      lineHeight: '1.5',
                    }}
                  >
                    The email below is the student's Aegis ID login email.
                    Leave the password fields empty to keep the current password.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(2, minmax(0, 1fr))',
                      gap: '16px',
                    }}
                  >

                    <EditField
                      label="Aegis ID Login Email"
                      type="email"
                      value={editForm.email}
                      onChange={(value) =>
                        updateEditField('email', value)
                      }
                    />

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        minHeight: '42px',
                        border: '1px solid #dbe4f0',
                        borderRadius: '9px',
                        background: '#ffffff',
                        color: '#697586',
                        fontSize: '12px',
                        lineHeight: '1.45',
                      }}
                    >
                      Existing password is never displayed.
                      Enter a new password below only when you want to change it.
                    </div>

                    <EditField
                      label="New Password"
                      type="password"
                      value={editForm.newPassword}
                      onChange={(value) =>
                        updateEditField('newPassword', value)
                      }
                    />

                    <EditField
                      label="Confirm New Password"
                      type="password"
                      value={editForm.confirmPassword}
                      onChange={(value) =>
                        updateEditField('confirmPassword', value)
                      }
                    />

                  </div>

                  {passwordError && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: '#fff1f1',
                        border: '1px solid #f0cccc',
                        color: '#b42318',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {passwordError}
                    </div>
                  )}

                </div>


                {/* BASIC INFORMATION */}

                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      'repeat(2, minmax(0, 1fr))',
                    gap: '16px',
                  }}
                >

                  <EditField
                    label="Student ID"
                    required
                    value={
                      editForm.studentId
                    }
                    onChange={(value) =>
                      updateEditField(
                        'studentId',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Full Name (English)"
                    required
                    value={
                      editForm.fullNameEn
                    }
                    onChange={(value) =>
                      updateEditField(
                        'fullNameEn',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Full Name (Amharic)"
                    value={
                      editForm.fullNameAm
                    }
                    onChange={(value) =>
                      updateEditField(
                        'fullNameAm',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Gender (English)"
                    value={
                      editForm.genderEn
                    }
                    onChange={(value) =>
                      updateEditField(
                        'genderEn',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Gender (Amharic)"
                    value={
                      editForm.genderAm
                    }
                    onChange={(value) =>
                      updateEditField(
                        'genderAm',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Blood Group (English)"
                    value={
                      editForm.bloodGroupEn
                    }
                    onChange={(value) =>
                      updateEditField(
                        'bloodGroupEn',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Blood Group (Amharic)"
                    value={
                      editForm.bloodGroupAm
                    }
                    onChange={(value) =>
                      updateEditField(
                        'bloodGroupAm',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Category"
                    required
                    type="select"
                    value={
                      editForm.categoryEn
                    }
                    options={[
                      {
                        value:
                          'MILITARY',
                        label:
                          'Military',
                      },
                      {
                        value:
                          'CIVILIAN',
                        label:
                          'Civilian',
                      },
                    ]}
                    onChange={(value) =>
                      updateEditField(
                        'categoryEn',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Category (Amharic)"
                    value={
                      editForm.categoryAm
                    }
                    onChange={(value) =>
                      updateEditField(
                        'categoryAm',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Department"
                    value={
                      editForm.department
                    }
                    onChange={(value) =>
                      updateEditField(
                        'department',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Year Level"
                    value={
                      editForm.yearLevel
                    }
                    onChange={(value) =>
                      updateEditField(
                        'yearLevel',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Student Phone"
                    value={
                      editForm.phone
                    }
                    onChange={(value) =>
                      updateEditField(
                        'phone',
                        value
                      )
                    }
                  />
                  <EditField
                    label="Resident Address (English)"
                    value={
                      editForm.residentAddressEn
                    }
                    onChange={(value) =>
                      updateEditField(
                        'residentAddressEn',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Resident Address (Amharic)"
                    value={
                      editForm.residentAddressAm
                    }
                    onChange={(value) =>
                      updateEditField(
                        'residentAddressAm',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Emergency Contact Name (English)"
                    value={
                      editForm.emergencyContactNameEn
                    }
                    onChange={(value) =>
                      updateEditField(
                        'emergencyContactNameEn',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Emergency Contact Name (Amharic)"
                    value={
                      editForm.emergencyContactNameAm
                    }
                    onChange={(value) =>
                      updateEditField(
                        'emergencyContactNameAm',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Emergency Contact Phone (English)"
                    value={
                      editForm.emergencyContactPhoneEn
                    }
                    onChange={(value) =>
                      updateEditField(
                        'emergencyContactPhoneEn',
                        value
                      )
                    }
                  />

                  <EditField
                    label="Emergency Contact Phone (Amharic)"
                    value={
                      editForm.emergencyContactPhoneAm
                    }
                    onChange={(value) =>
                      updateEditField(
                        'emergencyContactPhoneAm',
                        value
                      )
                    }
                  />

                </div>


                {/* DATES */}

                <div
                  style={{
                    marginTop:
                      '22px',
                    paddingTop:
                      '20px',
                    borderTop:
                      '1px solid #e7ebf0',
                  }}
                >

                  <h4
                    style={{
                      margin:
                        '0 0 14px',
                      color:
                        '#182230',
                    }}
                  >
                    Dates
                  </h4>

                  <div
                    style={{
                      display:
                        'grid',
                      gridTemplateColumns:
                        'repeat(3, minmax(0, 1fr))',
                      gap: '16px',
                    }}
                  >

                    <EditField
                      label="Date of Birth"
                      type="date"
                      value={
                        editForm.dateOfBirthGregorian
                      }
                      onChange={(value) =>
                        updateEditField(
                          'dateOfBirthGregorian',
                          value
                        )
                      }
                    />

                    <EditField
                      label="Issue Date"
                      type="date"
                      value={
                        editForm.issueDateGregorian
                      }
                      onChange={(value) =>
                        updateEditField(
                          'issueDateGregorian',
                          value
                        )
                      }
                    />

                    <EditField
                      label="Expiry Date"
                      type="date"
                      value={
                        editForm.expiryDateGregorian
                      }
                      onChange={(value) =>
                        updateEditField(
                          'expiryDateGregorian',
                          value
                        )
                      }
                    />

                  </div>

                </div>


                {/* PHOTO */}

                <div
                  style={{
                    marginTop:
                      '22px',
                    paddingTop:
                      '20px',
                    borderTop:
                      '1px solid #e7ebf0',
                  }}
                >

                  <h4
                    style={{
                      margin:
                        '0 0 14px',
                      color:
                        '#182230',
                    }}
                  >
                    Student Photo
                  </h4>

                  <div
                    style={{
                      display:
                        'flex',
                      alignItems:
                        'center',
                      gap: '18px',
                      flexWrap:
                        'wrap',
                    }}
                  >

                    <div
                      style={{
                        width:
                          '100px',
                        height:
                          '120px',
                        borderRadius:
                          '10px',
                        border:
                          '1px solid #dfe5ec',
                        overflow:
                          'hidden',
                        background:
                          '#f4f6f8',
                        display:
                          'flex',
                        alignItems:
                          'center',
                        justifyContent:
                          'center',
                      }}
                    >

                      {editPhoto ? (

                        <img
                          src={editPhoto}
                          alt="Student"
                          style={{
                            width:
                              '100%',
                            height:
                              '100%',
                            objectFit:
                              'cover',
                          }}
                        />

                      ) : (

                        <IdCard
                          size={30}
                          color="#9aa4b2"
                        />

                      )}

                    </div>

                    <div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          handlePhotoChange
                        }
                      />

                      <p
                        style={{
                          margin:
                            '7px 0 0',
                          fontSize:
                            '12px',
                          color:
                            '#8993a1',
                        }}
                      >
                        Maximum 2 MB.
                      </p>

                    </div>

                  </div>

                </div>


                {/* ACTIONS */}

                <div
                  style={{
                    marginTop:
                      '24px',
                    paddingTop:
                      '18px',
                    borderTop:
                      '1px solid #e7ebf0',
                    display:
                      'flex',
                    justifyContent:
                      'flex-end',
                    gap: '10px',
                  }}
                >

                  <button
                    type="button"
                    onClick={() => {
                      setEditingStudent(null);
                      setEditForm(null);
                      setEditPhoto('');
                    }}
                    style={{
                      padding:
                        '10px 16px',
                      border:
                        '1px solid #d8dee8',
                      background:
                        '#ffffff',
                      color:
                        '#394454',
                      borderRadius:
                        '9px',
                      cursor:
                        'pointer',
                      fontWeight:
                        '700',
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving
                    }
                    style={{
                      display:
                        'inline-flex',
                      alignItems:
                        'center',
                      gap: '7px',
                      padding:
                        '10px 17px',
                      border:
                        'none',
                      background:
                        '#2463eb',
                      color:
                        '#ffffff',
                      borderRadius:
                        '9px',
                      cursor:
                        saving
                          ? 'not-allowed'
                          : 'pointer',
                      fontWeight:
                        '700',
                      opacity:
                        saving
                          ? 0.7
                          : 1,
                    }}
                  >

                    {saving ? (
                      <Loader2
                        size={16}
                        className="registrar-spin"
                      />
                    ) : (
                      <Save size={16} />
                    )}

                    {saving
                      ? 'Saving...'
                      : 'Save Changes'}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}


      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      {deleteStudent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'rgba(15, 23, 42, 0.58)',
            zIndex: 5200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >

          <div
            style={{
              width:
                'min(470px, 94vw)',
              background:
                '#ffffff',
              borderRadius:
                '16px',
              padding:
                '26px',
              boxShadow:
                '0 20px 60px rgba(0,0,0,0.22)',
            }}
          >

            <div
              style={{
                width:
                  '46px',
                height:
                  '46px',
                borderRadius:
                  '12px',
                display:
                  'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                background:
                  '#fff0f0',
                color:
                  '#c62828',
                marginBottom:
                  '14px',
              }}
            >
              <AlertTriangle
                size={24}
              />
            </div>

            <h3
              style={{
                margin:
                  '0 0 8px',
                color:
                  '#182230',
              }}
            >
              Permanently Delete Student ID?
            </h3>

            <p
              style={{
                margin:
                  '0 0 8px',
                color:
                  '#596575',
                fontSize:
                  '14px',
                lineHeight:
                  '1.55',
              }}
            >
              You are about to permanently delete:
            </p>

            <div
              style={{
                padding:
                  '12px 14px',
                background:
                  '#f7f9fc',
                borderRadius:
                  '10px',
                marginBottom:
                  '14px',
              }}
            >

              <strong
                style={{
                  display:
                    'block',
                  color:
                    '#182230',
                }}
              >
                {deleteStudent.full_name}
              </strong>

              <span
                style={{
                  color:
                    '#697586',
                  fontSize:
                    '13px',
                }}
              >
                {deleteStudent.student_id}
              </span>

            </div>

            <p
              style={{
                margin:
                  '0 0 20px',
                color:
                  '#b42318',
                fontSize:
                  '13px',
                fontWeight:
                  '600',
                lineHeight:
                  '1.5',
              }}
            >
              This removes the student's ID record
              and associated login account from the
              database. This action cannot be undone.
            </p>

            <div
              style={{
                display:
                  'flex',
                justifyContent:
                  'flex-end',
                gap: '10px',
              }}
            >

              <button
                type="button"
                disabled={
                  deleting
                }
                onClick={() =>
                  setDeleteStudent(
                    null
                  )
                }
                style={{
                  padding:
                    '10px 16px',
                  border:
                    '1px solid #d8dee8',
                  background:
                    '#ffffff',
                  color:
                    '#394454',
                  borderRadius:
                    '9px',
                  cursor:
                    deleting
                      ? 'not-allowed'
                      : 'pointer',
                  fontWeight:
                    '700',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  deleting
                }
                onClick={
                  confirmDelete
                }
                style={{
                  display:
                    'inline-flex',
                  alignItems:
                    'center',
                  gap: '7px',
                  padding:
                    '10px 16px',
                  border:
                    'none',
                  background:
                    '#c62828',
                  color:
                    '#ffffff',
                  borderRadius:
                    '9px',
                  cursor:
                    deleting
                      ? 'not-allowed'
                      : 'pointer',
                  fontWeight:
                    '700',
                  opacity:
                    deleting
                      ? 0.7
                      : 1,
                }}
              >

                {deleting && (
                  <Loader2
                    size={16}
                    className="registrar-spin"
                  />
                )}

                {deleting
                  ? 'Deleting...'
                  : 'Permanently Delete'}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


/* =========================================================
   EDIT FIELD COMPONENT
========================================================= */

function EditField({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
  options = [],
}) {

  const inputStyle = {
    width: '100%',
    minHeight: '42px',
    boxSizing: 'border-box',
    padding: '9px 11px',
    border: '1px solid #d7dde5',
    borderRadius: '9px',
    background: '#ffffff',
    color: '#182230',
    fontSize: '13px',
    outline: 'none',
  };

  return (
    <label
      style={{
        display: 'block',
      }}
    >

      <span
        style={{
          display: 'block',
          marginBottom: '6px',
          color: '#596575',
          fontSize: '12px',
          fontWeight: '700',
        }}
      >
        {label}
        {required && (
          <span
            style={{
              color: '#c62828',
            }}
          >
            {' '}*
          </span>
        )}
      </span>

      {type === 'select' ? (

        <select
          required={required}
          value={value || ''}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          style={inputStyle}
        >

          <option value="">
            Select...
          </option>

          {options.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}

        </select>

      ) : (

        <input
          required={required}
          type={type}
          value={value || ''}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          style={inputStyle}
        />

      )}

    </label>
  );
}
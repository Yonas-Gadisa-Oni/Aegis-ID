import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  Phone,
  ScanLine,
  Building2,
  CalendarDays,
  MapPin,
  Droplets,
  UserRound,
  GraduationCap,
} from 'lucide-react';

function getStudentValue(student, ...keys) {
  for (const key of keys) {
    if (
      student &&
      student[key] !== undefined &&
      student[key] !== null &&
      String(student[key]).trim() !== ''
    ) {
      return student[key];
    }
  }

  return '';
}

function formatDate(value) {
  if (!value) return 'Not provided';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateWithEthiopian(
  gregorian,
  year,
  month,
  day
) {
  const gregorianText = formatDate(gregorian);

  const hasEthiopianDate =
    year &&
    month &&
    day;

  if (!hasEthiopianDate) {
    return gregorianText;
  }

  return `${gregorianText} • ${year}/${month}/${day} E.C.`;
}

export default function StudentIDCard({
  student = {},
  qr = null,
  qrLoading = false,
}) {
  /*
   * ============================================================
   * IDENTITY
   * ============================================================
   */

  const fullNameEn =
    getStudentValue(
      student,
      'full_name_en',
      'full_name',
      'fullName'
    ) || 'Student Name';

  const fullNameAm =
    getStudentValue(
      student,
      'full_name_am'
    );

  const studentId =
    getStudentValue(
      student,
      'student_id',
      'studentId'
    ) || 'Not provided';

  const categoryEn =
    getStudentValue(
      student,
      'category_en',
      'category'
    ) || 'Not provided';

  const categoryAm =
    getStudentValue(
      student,
      'category_am'
    );

  const department =
    getStudentValue(
      student,
      'department'
    ) || 'Not provided';

  const yearLevel =
    getStudentValue(
      student,
      'year_level',
      'yearLevel'
    ) || 'Not provided';

  const genderEn =
    getStudentValue(
      student,
      'gender_en',
      'gender'
    ) || 'Not provided';

  const genderAm =
    getStudentValue(
      student,
      'gender_am'
    );

  const bloodGroupEn =
    getStudentValue(
      student,
      'blood_group_en',
      'blood_group'
    ) || 'Not provided';

  const bloodGroupAm =
    getStudentValue(
      student,
      'blood_group_am'
    );

  /*
   * ============================================================
   * ADDRESS / CONTACT
   * ============================================================
   */

  const residentAddressEn =
    getStudentValue(
      student,
      'resident_address_en',
      'resident_address',
      'residence'
    ) || 'Not provided';

  const residentAddressAm =
    getStudentValue(
      student,
      'resident_address_am'
    );

  const phone =
    getStudentValue(
      student,
      'phone',
      'phone_number',
      'phoneNumber'
    ) || 'Not provided';

  /*
   * ============================================================
   * EMERGENCY CONTACT
   * ============================================================
   */

  const emergencyNameEn =
    getStudentValue(
      student,
      'emergency_contact_name_en',
      'emergency_contact_name',
      'emergencyContactName'
    ) || 'Not provided';

  const emergencyNameAm =
    getStudentValue(
      student,
      'emergency_contact_name_am'
    );

  const emergencyPhone =
    getStudentValue(
      student,
      'emergency_contact_phone_en',
      'emergency_contact_phone',
      'emergencyContactPhone'
    ) || 'Not provided';

  /*
   * ============================================================
   * PHOTO
   * ============================================================
   */

  const photoUrl =
    getStudentValue(
      student,
      'photo_url',
      'photoUrl'
    );

  /*
   * ============================================================
   * DATES
   * ============================================================
   */

  const dateOfBirthGregorian =
    getStudentValue(
      student,
      'date_of_birth_gregorian',
      'date_of_birth',
      'dateOfBirthGregorian'
    );

  const dateOfBirthEthiopianYear =
    getStudentValue(
      student,
      'date_of_birth_ethiopian_year',
      'dateOfBirthEthiopianYear'
    );

  const dateOfBirthEthiopianMonth =
    getStudentValue(
      student,
      'date_of_birth_ethiopian_month',
      'dateOfBirthEthiopianMonth'
    );

  const dateOfBirthEthiopianDay =
    getStudentValue(
      student,
      'date_of_birth_ethiopian_day',
      'dateOfBirthEthiopianDay'
    );

  const issueDateGregorian =
    getStudentValue(
      student,
      'issue_date_gregorian',
      'issue_date',
      'issueDate',
      'created_at',
      'createdAt'
    );

  const issueDateEthiopianYear =
    getStudentValue(
      student,
      'issue_date_ethiopian_year',
      'issueDateEthiopianYear'
    );

  const issueDateEthiopianMonth =
    getStudentValue(
      student,
      'issue_date_ethiopian_month',
      'issueDateEthiopianMonth'
    );

  const issueDateEthiopianDay =
    getStudentValue(
      student,
      'issue_date_ethiopian_day',
      'issueDateEthiopianDay'
    );

  const expiryDateGregorian =
    getStudentValue(
      student,
      'expiry_date_gregorian',
      'expiry_date',
      'expiryDate'
    );

  const expiryDateEthiopianYear =
    getStudentValue(
      student,
      'expiry_date_ethiopian_year',
      'expiryDateEthiopianYear'
    );

  const expiryDateEthiopianMonth =
    getStudentValue(
      student,
      'expiry_date_ethiopian_month',
      'expiryDateEthiopianMonth'
    );

  const expiryDateEthiopianDay =
    getStudentValue(
      student,
      'expiry_date_ethiopian_day',
      'expiryDateEthiopianDay'
    );

  /*
   * ============================================================
   * QR
   * ============================================================
   */

  const qrValue =
    typeof qr === 'string'
      ? qr
      : qr?.value ||
        qr?.qrValue ||
        qr?.token ||
        '';

  /*
   * ============================================================
   * DISPLAY HELPERS
   * ============================================================
   */

  const initials = fullNameEn
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join('');

  const dobDisplay = formatDateWithEthiopian(
    dateOfBirthGregorian,
    dateOfBirthEthiopianYear,
    dateOfBirthEthiopianMonth,
    dateOfBirthEthiopianDay
  );

  const issueDisplay = formatDateWithEthiopian(
    issueDateGregorian,
    issueDateEthiopianYear,
    issueDateEthiopianMonth,
    issueDateEthiopianDay
  );

  const expiryDisplay = formatDateWithEthiopian(
    expiryDateGregorian,
    expiryDateEthiopianYear,
    expiryDateEthiopianMonth,
    expiryDateEthiopianDay
  );

  return (
    <div className="digital-id-page">
      <div className="digital-id-container">

        {/* =====================================================
            FRONT OF CARD
            ===================================================== */}

        <div className="aegis-print-card aegis-front-card">

          <div className="aegis-front-top">

            <div className="aegis-card-brand">

              <div className="aegis-card-logo">
                A
              </div>

              <div>
                <div className="aegis-card-brand-name">
                  AEGIS ID
                </div>

                <div className="aegis-card-brand-subtitle">
                  DIGITAL CAMPUS ACCESS
                </div>
              </div>

            </div>

            <div className="aegis-edu-heading">

              <strong>
                ETHIOPIAN DEFENCE UNIVERSITY
              </strong>

              <span>
                STUDENT IDENTIFICATION CARD
              </span>

            </div>

          </div>


          <div className="aegis-front-main">

            {/* PHOTO */}

            <div className="aegis-photo-column">

              <div className="aegis-photo-large">

                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={`${fullNameEn} student`}
                  />
                ) : (
                  <div className="aegis-photo-letter">
                    {initials || 'S'}
                  </div>
                )}

                <div className="aegis-photo-strip">
                  EDU STUDENT
                </div>

              </div>

            </div>


            {/* IDENTITY */}

            <div className="aegis-identity-column">

              {/* NAME */}

              <div className="aegis-primary-name">

                <span>
                  FULL NAME / ሙሉ ስም
                </span>

                <strong title={fullNameEn}>
                  {fullNameEn}
                </strong>

                {fullNameAm && (
                  <small>
                    {fullNameAm}
                  </small>
                )}

              </div>


              {/* STUDENT ID */}

              <div className="aegis-student-number">

                <span>
                  STUDENT ID NUMBER
                </span>

                <strong>
                  {studentId}
                </strong>

              </div>


              {/* FIELDS */}

              <div className="aegis-front-fields">

                <div className="aegis-front-field">

                  <span>
                    CATEGORY / ምድብ
                  </span>

                  <strong title={categoryEn}>
                    {categoryEn}
                  </strong>

                  {categoryAm && (
                    <small>
                      {categoryAm}
                    </small>
                  )}

                </div>


                <div className="aegis-front-field">

                  <span>
                    DEPARTMENT
                  </span>

                  <strong title={department}>
                    {department}
                  </strong>

                </div>


                <div className="aegis-front-field">

                  <span>
                    YEAR LEVEL
                  </span>

                  <strong>
                    {yearLevel}
                  </strong>

                </div>


                <div className="aegis-front-field">

                  <span>
                    GENDER / ጾታ
                  </span>

                  <strong>
                    {genderEn}
                  </strong>

                  {genderAm && (
                    <small>
                      {genderAm}
                    </small>
                  )}

                </div>


                <div className="aegis-front-field">

                  <span>
                    BLOOD GROUP / የደም አይነት
                  </span>

                  <strong>
                    {bloodGroupEn}
                  </strong>

                  {bloodGroupAm && (
                    <small>
                      {bloodGroupAm}
                    </small>
                  )}

                </div>


                <div className="aegis-front-field">

                  <span>
                    DATE OF BIRTH
                  </span>

                  <strong>
                    {dobDisplay}
                  </strong>

                </div>


                <div className="aegis-front-field">

                  <span>
                    RESIDENT ADDRESS
                  </span>

                  <strong title={residentAddressEn}>
                    {residentAddressEn}
                  </strong>

                  {residentAddressAm && (
                    <small title={residentAddressAm}>
                      {residentAddressAm}
                    </small>
                  )}

                </div>

              </div>


              {/* ISSUE / EXPIRY */}

              <div className="aegis-date-row">

                <div>

                  <span>
                    ISSUE DATE
                  </span>

                  <strong>
                    {issueDisplay}
                  </strong>

                </div>


                <div>

                  <span>
                    EXPIRY DATE
                  </span>

                  <strong>
                    {expiryDisplay}
                  </strong>

                </div>

              </div>

            </div>

          </div>


          <div className="aegis-front-bottom">

            <div className="aegis-security-mark">

              <ShieldCheck size={13} />

              <span>
                AUTHORIZED CAMPUS IDENTIFICATION
              </span>

            </div>

            <div className="aegis-card-validity">
              AEGIS ID • EDU
            </div>

          </div>


          <div className="aegis-watermark">
            A
          </div>

        </div>


        {/* =====================================================
            BACK OF CARD
            ===================================================== */}

        <div className="aegis-print-card aegis-back-card">

          <div className="aegis-back-top">

            <div className="aegis-back-brand">

              <div className="aegis-back-logo">
                A
              </div>

              <div>

                <strong>
                  AEGIS ID
                </strong>

                <span>
                  ETHIOPIAN DEFENCE UNIVERSITY
                </span>

              </div>

            </div>


            <div className="aegis-back-card-type">
              STUDENT ACCESS CARD
            </div>

          </div>


          <div className="aegis-back-main">

            <div className="aegis-back-details">

              {/* STUDENT CONTACT */}

              <div className="aegis-back-section">

                <div className="aegis-back-section-heading">

                  <Phone size={12} />

                  STUDENT CONTACT

                </div>


                <div className="aegis-back-contact-grid">

                  <div>

                    <span>
                      PHONE NUMBER
                    </span>

                    <strong>
                      {phone}
                    </strong>

                  </div>


                  <div>

                    <span>
                      STUDENT ID
                    </span>

                    <strong>
                      {studentId}
                    </strong>

                  </div>

                </div>

              </div>


              {/* PERSONAL DETAILS */}

              <div className="aegis-back-section">

                <div className="aegis-back-section-heading">

                  <UserRound size={12} />

                  PERSONAL DETAILS

                </div>


                <div className="aegis-back-contact-grid">

                  <div>

                    <span>
                      GENDER
                    </span>

                    <strong>
                      {genderEn}
                    </strong>

                  </div>


                  <div>

                    <span>
                      BLOOD GROUP
                    </span>

                    <strong>
                      {bloodGroupEn}
                    </strong>

                  </div>

                </div>

              </div>


              {/* EMERGENCY CONTACT */}

              <div className="aegis-emergency">

                <div className="aegis-back-section-heading">

                  <Phone size={12} />

                  EMERGENCY CONTACT

                </div>


                <div className="aegis-emergency-grid">

                  <div>

                    <span>
                      NAME
                    </span>

                    <strong title={emergencyNameEn}>
                      {emergencyNameEn}
                    </strong>

                    {emergencyNameAm && (
                      <small>
                        {emergencyNameAm}
                      </small>
                    )}

                  </div>


                  <div>

                    <span>
                      PHONE
                    </span>

                    <strong>
                      {emergencyPhone}
                    </strong>

                  </div>

                </div>

              </div>


              {/* UNIVERSITY INFORMATION */}

              <div className="aegis-university-info">

                <div className="aegis-back-section-heading">

                  <Building2 size={12} />

                  UNIVERSITY INFORMATION

                </div>


                <strong>
                  Ethiopian Defence University
                </strong>

                <span>
                  Aegis ID Campus Access System
                </span>

                <span>
                  Student identification and
                  campus access management
                </span>

              </div>

            </div>


            {/* QR CODE */}

            <div className="aegis-back-qr">

              <div className="aegis-qr-label">
                SCAN FOR CAMPUS ACCESS
              </div>


              <div className="aegis-qr-box aegis-qr-box-large">

                {qrLoading ? (
                  <div className="aegis-qr-loading">
                    Loading QR...
                  </div>
                ) : qrValue ? (
                  <QRCodeSVG
                    value={qrValue}
                    size={190}
                    level="H"
                    includeMargin={true}
                  />
                ) : (
                  <div className="aegis-qr-loading">
                    QR unavailable
                  </div>
                )}

              </div>


              <strong>
                AUTHORIZED SCANNER
              </strong>

              <span>
                Present this QR code at an authorized
                campus gateway.
              </span>

            </div>

          </div>


          {/* BACK FOOTER */}

          <div className="aegis-back-bottom">

            <div className="aegis-back-instruction">

              <ScanLine size={16} />

              <div>

                <strong>
                  SCANNING INSTRUCTIONS
                </strong>

                <span>
                  Keep the QR code visible when presenting
                  your student card at a campus gateway.
                </span>

              </div>

            </div>


            <div className="aegis-back-validity">

              <div>

                <CalendarDays size={11} />

                <span>
                  CARD VALIDITY
                </span>

              </div>

              <strong>
                {expiryDisplay}
              </strong>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
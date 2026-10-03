import { QRCodeSVG } from 'qrcode.react';

import {
  ShieldCheck,
  Phone,
  ScanLine,
  Building2,
  CalendarDays,
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
  if (!value) {
    return 'Not provided';
  }

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
   * BASIC STUDENT INFORMATION
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
      'full_name_am',
      'fullNameAm'
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
      'category_am',
      'categoryAm'
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
      'gender_am',
      'genderAm'
    );


  const bloodGroupEn =
    getStudentValue(
      student,
      'blood_group_en',
      'blood_group',
      'bloodGroup'
    ) || 'Not provided';


  const bloodGroupAm =
    getStudentValue(
      student,
      'blood_group_am',
      'bloodGroupAm'
    );


  /*
   * ============================================================
   * CONTACT INFORMATION
   * ============================================================
   */

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
      'emergency_contact_name_am',
      'emergencyContactNameAm'
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
   * DATE OF BIRTH
   * ============================================================
   */

  const dateOfBirthGregorian =
    getStudentValue(
      student,
      'date_of_birth_gregorian',
      'date_of_birth',
      'dateOfBirthGregorian'
    );


  /*
   * ============================================================
   * ISSUE DATE
   * ============================================================
   */

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


  /*
   * ============================================================
   * EXPIRY DATE
   * ============================================================
   */

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
   * QR CODE
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
   * DISPLAY VALUES
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


  const dobDisplay =
    formatDate(
      dateOfBirthGregorian
    );


  const issueDisplay =
    formatDateWithEthiopian(
      issueDateGregorian,
      issueDateEthiopianYear,
      issueDateEthiopianMonth,
      issueDateEthiopianDay
    );


  const expiryDisplay =
    formatDateWithEthiopian(
      expiryDateGregorian,
      expiryDateEthiopianYear,
      expiryDateEthiopianMonth,
      expiryDateEthiopianDay
    );


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="digital-id-page">

      <div className="digital-id-container">


        {/* =====================================================
            FRONT OF CARD
            ===================================================== */}

        <div className="aegis-print-card aegis-front-card">


          {/* HEADER */}

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
                  DIGITAL CAMPUS ACCESS / ዲጂታል የካምፓስ መታወቂያ
                </div>

              </div>

            </div>


            <div className="aegis-edu-heading">

              <strong>
                ETHIOPIAN DEFENCE UNIVERSITY
              </strong>

              <span>
                የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
              </span>

              <small>
                STUDENT IDENTIFICATION CARD / የተማሪ መታወቂያ
              </small>

            </div>

          </div>


          {/* MAIN FRONT AREA */}

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
                  EDU STUDENT / የኢዲዩ ተማሪ
                </div>

              </div>

            </div>


            {/* INFORMATION */}

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
                  STUDENT ID / የተማሪ መታወቂያ
                </span>

                <strong>
                  {studentId}
                </strong>

              </div>


              {/* FRONT INFORMATION GRID */}

              <div className="aegis-front-fields">


                {/* GENDER */}

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


                {/* BLOOD GROUP */}

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


                {/* DATE OF BIRTH */}

                <div className="aegis-front-field">

                  <span>
                    DATE OF BIRTH / የትውልድ ቀን
                  </span>

                  <strong>
                    {dobDisplay}
                  </strong>

                </div>


                {/* CATEGORY */}

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


                {/* DEPARTMENT */}

                <div className="aegis-front-field">

                  <span>
                    DEPARTMENT / የትምህርት ክፍል
                  </span>

                  <strong title={department}>
                    {department}
                  </strong>

                </div>


                {/* YEAR LEVEL */}

                <div className="aegis-front-field">

                  <span>
                    YEAR LEVEL / የትምህርት ደረጃ
                  </span>

                  <strong>
                    {yearLevel}
                  </strong>

                </div>


              </div>


              {/* ISSUE / EXPIRY */}

              <div className="aegis-date-row">


                <div>

                  <span>
                    ISSUE DATE / የተሰጠበት ቀን
                  </span>

                  <strong>
                    {issueDisplay}
                  </strong>

                </div>


                <div>

                  <span>
                    EXPIRY DATE / የሚያበቃበት ቀን
                  </span>

                  <strong>
                    {expiryDisplay}
                  </strong>

                </div>


              </div>


            </div>

          </div>


          {/* FRONT FOOTER */}

          <div className="aegis-front-bottom">

            <div className="aegis-security-mark">

              <ShieldCheck size={13} />

              <span>
                AUTHORIZED CAMPUS IDENTIFICATION /
                ህጋዊ የካምፓስ መታወቂያ
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


          {/* BACK HEADER */}

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
                  ETHIOPIAN DEFENCE UNIVERSITY /
                  የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
                </span>

              </div>

            </div>


            <div className="aegis-back-card-type">
              STUDENT ACCESS CARD / የተማሪ መግቢያ ካርድ
            </div>

          </div>


          {/* BACK MAIN */}

          <div className="aegis-back-main">


            {/* LEFT SIDE */}

            <div className="aegis-back-details">


              {/* STUDENT CONTACT */}

              <div className="aegis-back-section">

                <div className="aegis-back-section-heading">

                  <Phone size={12} />

                  STUDENT CONTACT / የተማሪ ግንኙነት

                </div>


                <div className="aegis-back-contact-grid">


                  <div>

                    <span>
                      PHONE NUMBER / ስልክ ቁጥር
                    </span>

                    <strong>
                      {phone}
                    </strong>

                  </div>


                  <div>

                    <span>
                      STUDENT ID / የተማሪ መታወቂያ
                    </span>

                    <strong>
                      {studentId}
                    </strong>

                  </div>


                </div>

              </div>


              {/* EMERGENCY CONTACT */}

              <div className="aegis-emergency">

                <div className="aegis-back-section-heading">

                  <Phone size={12} />

                  EMERGENCY CONTACT / የአደጋ ጊዜ ግንኙነት

                </div>


                <div className="aegis-emergency-grid">


                  <div>

                    <span>
                      CONTACT NAME / የግንኙነት ስም
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
                      PHONE / ስልክ
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

                  UNIVERSITY INFORMATION / የዩኒቨርሲቲ መረጃ

                </div>


                <strong>
                  Ethiopian Defence University
                </strong>


                <span>
                  የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
                </span>


                <span>
                  Aegis ID Campus Access System /
                  የካምፓስ መታወቂያ ስርዓት
                </span>

              </div>

            </div>


            {/* RIGHT SIDE QR */}

            <div className="aegis-back-qr">


              <div className="aegis-qr-label">
                SCAN FOR CAMPUS ACCESS / ለካምፓስ መግቢያ ይቃኙ
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
                AUTHORIZED SCANNER / የተፈቀደ ስካነር
              </strong>


              <span>
                Present this QR code at an authorized
                campus gateway.
              </span>


              <span>
                በተፈቀደ የካምፓስ መግቢያ ላይ
                ይህንን QR ኮድ ያቅርቡ።
              </span>

            </div>

          </div>


          {/* BACK FOOTER */}

          <div className="aegis-back-bottom">


            <div className="aegis-back-instruction">

              <ScanLine size={16} />

              <div>

                <strong>
                  SCANNING INSTRUCTIONS / የመቃኘት መመሪያ
                </strong>

                <span>
                  Keep the QR code visible when presenting
                  your student card at a campus gateway.
                </span>

                <span>
                  በካምፓስ መግቢያ ላይ የተማሪ ካርድዎን
                  ሲያቀርቡ QR ኮዱ በግልጽ እንዲታይ ያድርጉ።
                </span>

              </div>

            </div>


            <div className="aegis-back-validity">

              <div>

                <CalendarDays size={11} />

                <span>
                  CARD VALIDITY / የካርድ ትክክለኛነት
                </span>

              </div>


              <strong>
                {issueDisplay} — {expiryDisplay}
              </strong>

            </div>


          </div>

        </div>

      </div>
    </div>
  );
}
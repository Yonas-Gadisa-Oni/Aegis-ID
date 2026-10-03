import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  Phone,
  ScanLine,
  Building2,
  CalendarDays,
  AlertCircle,
} from 'lucide-react';

export default function DigitalID() {
  const { user } = useAuth();

  const [qr, setQr] = useState('');
  const [qrLoading, setQrLoading] = useState(true);

  const s = user?.student || {};

  useEffect(() => {
    const loadQR = async () => {
      if (!user?.student?.id) {
        setQrLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/students/${user.student.id}/qr`
        );

        setQr(response.data?.value || '');
      } catch (error) {
        console.error('Failed to load student QR:', error);
        setQr('');
      } finally {
        setQrLoading(false);
      }
    };

    loadQR();
  }, [user]);

  /* =========================================================
     STUDENT DATA
     ========================================================= */

  const fullName =
    s.full_name_en ||
    s.full_name ||
    'STUDENT NAME';

  const studentId =
    s.student_id ||
    'EDU-000000';

  const category =
    s.category_en ||
    s.category ||
    'Not provided';

  const department =
    s.department ||
    'Not provided';

  const yearLevel =
    s.year_level ||
    'Not provided';

  const status =
    s.status ||
    'ACTIVE';

  const gender =
    s.gender_en ||
    s.gender ||
    'Not provided';

  const bloodGroup =
    s.blood_group_en ||
    s.blood_group ||
    'Not provided';

  const residentAddress =
    s.resident_address_en ||
    s.residence ||
    s.resident_address ||
    'Not provided';

  const phone =
    s.phone ||
    'Not provided';

  const emergencyContactName =
    s.emergency_contact_name_en ||
    s.emergency_contact_name ||
    'Not provided';

  const emergencyContactPhone =
    s.emergency_contact_phone_en ||
    s.emergency_contact_phone ||
    'Not provided';

  const photoUrl =
    s.photo_url ||
    '';

  /* =========================================================
     INITIALS
     ========================================================= */

  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join('');

  /* =========================================================
     DATE FORMAT
     ========================================================= */

  const formatDate = (value) => {
    if (!value) return 'Not provided';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const issueDate =
    formatDate(s.issue_date);

  const expiryDate =
    s.expiry_date
      ? formatDate(s.expiry_date)
      : 'WHILE ENROLLED';

  const formattedBirthDate =
    s.date_of_birth_gregorian
      ? formatDate(s.date_of_birth_gregorian)
      : s.date_of_birth
        ? formatDate(s.date_of_birth)
        : 'Not provided';

  return (
    <div className="digital-id-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="page-title">

        <div>

          <span className="eyebrow">
            IDENTITY MANAGEMENT
          </span>

          <h2>
            Digital Student ID
          </h2>

          <p>
            University identification and campus
            access credential.
          </p>

        </div>

      </div>

      <div className="digital-id-container">

        {/* =====================================================
            FRONT LABEL
            ===================================================== */}

        <div className="digital-id-label">
          FRONT OF CARD / የካርዱ ፊት
        </div>

        {/* =====================================================
            FRONT CARD
            ===================================================== */}

        <div className="aegis-print-card aegis-front-card">

          {/* ---------------------------------------------------
              FRONT HEADER
              --------------------------------------------------- */}

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
                  DIGITAL CAMPUS ACCESS /
                  የዲጂታል ካምፓስ መዳረሻ
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
                STUDENT IDENTIFICATION CARD /
                የተማሪ መታወቂያ ካርድ
              </small>

            </div>

          </div>

          {/* ---------------------------------------------------
              FRONT MAIN
              --------------------------------------------------- */}

          <div className="aegis-front-main">

            {/* PHOTO */}

            <div className="aegis-photo-column">

              <div className="aegis-photo-large">

                {photoUrl ? (

                  <img
                    src={photoUrl}
                    alt={fullName}
                  />

                ) : (

                  <div className="aegis-photo-letter">
                    {initials || 'S'}
                  </div>

                )}

                <div className="aegis-photo-strip">
                  EDU STUDENT /
                  የዩኒቨርሲቲ ተማሪ
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

                <strong title={fullName}>
                  {fullName}
                </strong>

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

              <div className="aegis-front-divider" />

              {/* PERSONAL INFORMATION */}

              <div className="aegis-front-fields">

                {/* GENDER */}

                <div className="aegis-front-field">

                  <span>
                    GENDER / ጾታ
                  </span>

                  <strong>
                    {gender}
                  </strong>

                </div>

                {/* BLOOD GROUP */}

                <div className="aegis-front-field">

                  <span>
                    BLOOD GROUP / የደም አይነት
                  </span>

                  <strong>
                    {bloodGroup}
                  </strong>

                </div>

                {/* DATE OF BIRTH */}

                <div className="aegis-front-field">

                  <span>
                    DATE OF BIRTH / የትውልድ ቀን
                  </span>

                  <strong>
                    {formattedBirthDate}
                  </strong>

                </div>

                {/* CATEGORY */}

                <div className="aegis-front-field">

                  <span>
                    CATEGORY / ምድብ
                  </span>

                  <strong>
                    {category}
                  </strong>

                </div>

                {/* DEPARTMENT */}

                <div className="aegis-front-field">

                  <span>
                    DEPARTMENT / የትምህርት ክፍል
                  </span>

                  <strong
                    title={department}
                  >
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

                {/* RESIDENT ADDRESS */}

                <div className="aegis-front-field aegis-address-field">

                  <span>
                    RESIDENT ADDRESS /
                    የመኖሪያ አድራሻ
                  </span>

                  <strong
                    title={residentAddress}
                  >
                    {residentAddress}
                  </strong>

                </div>

              </div>

              {/* DATES */}

              <div className="aegis-date-row">

                <div>

                  <span>
                    ISSUE DATE /
                    የተሰጠበት ቀን
                  </span>

                  <strong>
                    {issueDate}
                  </strong>

                </div>

                <div>

                  <span>
                    EXPIRY DATE /
                    የሚያበቃበት ቀን
                  </span>

                  <strong>
                    {expiryDate}
                  </strong>

                </div>

              </div>

            </div>

          </div>

          {/* ---------------------------------------------------
              FRONT FOOTER
              --------------------------------------------------- */}

          <div className="aegis-front-bottom">

            <div className="aegis-security-mark">

              <ShieldCheck size={14} />

              <span>
                AUTHORIZED CAMPUS IDENTIFICATION /
                ሕጋዊ የካምፓስ መታወቂያ
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
            BACK LABEL
            ===================================================== */}

        <div className="digital-id-label">
          BACK OF CARD / የካርዱ ጀርባ
        </div>

        {/* =====================================================
            BACK CARD
            ===================================================== */}

        <div className="aegis-print-card aegis-back-card">

          {/* ---------------------------------------------------
              BACK HEADER
              --------------------------------------------------- */}

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
              STUDENT ACCESS CARD /
              የተማሪ መግቢያ ካርድ
            </div>

          </div>

          {/* ---------------------------------------------------
              BACK MAIN
              --------------------------------------------------- */}

          <div className="aegis-back-main">

            {/* DETAILS */}

            <div className="aegis-back-details">

              {/* STUDENT CONTACT */}

              <div className="aegis-back-section">

                <div className="aegis-back-section-heading">

                  <Phone size={13} />

                  <span>
                    STUDENT CONTACT /
                    የተማሪ የመገኛ መረጃ
                  </span>

                </div>

                <div className="aegis-back-contact-grid">

                  <div>

                    <span>
                      PHONE NUMBER /
                      ስልክ ቁጥር
                    </span>

                    <strong>
                      {phone}
                    </strong>

                  </div>

                  <div>

                    <span>
                      STUDENT ID /
                      የተማሪ መታወቂያ
                    </span>

                    <strong>
                      {studentId}
                    </strong>

                  </div>

                </div>

              </div>

              {/* EMERGENCY */}

              <div className="aegis-emergency">

                <div className="aegis-back-section-heading">

                  <Phone size={13} />

                  <span>
                    EMERGENCY CONTACT /
                    የአደጋ ጊዜ ተጠሪ
                  </span>

                </div>

                <div className="aegis-emergency-grid">

                  <div>

                    <span>
                      CONTACT NAME /
                      የተጠሪ ስም
                    </span>

                    <strong>
                      {emergencyContactName} /
                      {s.emergency_contact_name_am || 'አልተሰጠም'}
                    </strong>

                  </div>

                  <div>

                    <span>
                      PHONE / ስልክ
                    </span>

                    <strong>
                      {emergencyContactPhone} /
                      {s.emergency_contact_phone_am || 'አልተሰጠም'}
                    </strong>

                  </div>

                </div>

              </div>

              {/* UNIVERSITY */}

              <div className="aegis-university-info">

                <div className="aegis-back-section-heading">

                  <Building2 size={13} />

                  <span>
                    UNIVERSITY INFORMATION /
                    የዩኒቨርሲቲ መረጃ
                  </span>

                </div>

                <strong>
                  Ethiopian Defence University
                </strong>

                <span>
                  የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
                </span>

                <span>
                  Aegis ID Campus Access System /
                  የኤጊስ ካምፓስ መዳረሻ ስርዓት
                </span>

              </div>

            </div>

            {/* QR */}

            <div className="aegis-back-qr">

              <div className="aegis-qr-label">

                SCAN FOR CAMPUS ACCESS /
                ለካምፓስ መግቢያ ይስካን

              </div>

              <div className="aegis-qr-box aegis-qr-box-large">

                {qrLoading ? (

                  <span className="aegis-qr-loading">
                    Loading QR... /
                    በመጫን ላይ...
                  </span>

                ) : qr ? (

                  <QRCodeSVG
                    value={qr}
                    size={190}
                    level="H"
                    includeMargin={true}
                  />

                ) : (

                  <div className="aegis-qr-loading">
                    QR unavailable /
                    የQR ኮድ አይገኝም
                  </div>

                )}

              </div>

              <strong>
                AUTHORIZED SCANNER /
                ስልጣን ያለው ስካነር
              </strong>

              <span>
                Present this QR code at an authorized
                campus gateway. /
                ይህንን QR ኮድ በስልጣን ባለው
                የካምፓስ መግቢያ ያቅርቡ።
              </span>

            </div>

          </div>

          {/* ---------------------------------------------------
              BACK FOOTER
              --------------------------------------------------- */}

          <div className="aegis-back-bottom">

            <div className="aegis-back-instruction">

              <ScanLine size={16} />

              <div>

                <strong>
                  SCANNING INSTRUCTIONS /
                  የስካን መመሪያ
                </strong>

                <span>
                  Keep the QR code visible when presenting
                  your student card at a campus gateway. /
                  የተማሪ ካርድዎን በካምፓስ መግቢያ
                  ሲያቀርቡ QR ኮዱ እንዲታይ ያድርጉ።
                </span>

              </div>

            </div>

            <div className="aegis-back-validity">

              <div>

                <CalendarDays size={13} />

                <span>
                  CARD VALIDITY /
                  የካርድ ትክክለኛነት
                </span>

              </div>

              <strong>
                {issueDate} — {expiryDate}
              </strong>

            </div>

          </div>

        </div>

        {/* =====================================================
            IDENTITY DETAILS
            ===================================================== */}

        <div className="panel aegis-identity-panel">

          <div className="panel-head">

            <h3>
              Identity Details /
              የመታወቂያ ዝርዝሮች
            </h3>

          </div>

          <div className="aegis-details-grid">

            <div>
              <span>
                FULL NAME / ሙሉ ስም
              </span>

              <strong>
                {fullName}
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

            <div>
              <span>
                GENDER / ጾታ
              </span>

              <strong>
                {gender}
              </strong>
            </div>

            <div>
              <span>
                DATE OF BIRTH / የትውልድ ቀን
              </span>

              <strong>
                {formattedBirthDate}
              </strong>
            </div>

            <div>
              <span>
                BLOOD GROUP / የደም አይነት
              </span>

              <strong>
                {bloodGroup}
              </strong>
            </div>

            <div>
              <span>
                CATEGORY / ምድብ
              </span>

              <strong>
                {category}
              </strong>
            </div>

            <div>
              <span>
                DEPARTMENT / የትምህርት ክፍል
              </span>

              <strong>
                {department}
              </strong>
            </div>

            <div>
              <span>
                YEAR LEVEL / የትምህርት ደረጃ
              </span>

              <strong>
                {yearLevel}
              </strong>
            </div>

            <div>
              <span>
                PHONE / ስልክ
              </span>

              <strong>
                {phone}
              </strong>
            </div>

            <div>
              <span>
                RESIDENT ADDRESS / የመኖሪያ አድራሻ
              </span>

              <strong>
                {residentAddress}
              </strong>
            </div>

            <div>
              <span>
                EMERGENCY CONTACT / የአደጋ ጊዜ ተጠሪ
              </span>

              <strong>
                {emergencyContactName}
              </strong>
            </div>

            <div>
              <span>
                EMERGENCY PHONE / የአደጋ ጊዜ ስልክ
              </span>

              <strong>
                {emergencyContactPhone}
              </strong>
            </div>

            <div>
              <span>
                STATUS / ሁኔታ
              </span>

              <strong>
                {status}
              </strong>
            </div>

          </div>

          <div className="aegis-info-note">

            <AlertCircle size={16} />

            <span>
              Emergency-contact details are displayed
              from the student's Aegis ID profile. /
              የአደጋ ጊዜ ተጠሪ መረጃ ከተማሪው
              የኤጊስ መታወቂያ መገለጫ ይታያል።
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}
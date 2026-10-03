import { useMemo, useRef, useState } from 'react';
import * as ethiopianDate from 'ethiopian-date';
import { api } from '../../services/api';
import StudentIDCard from '../../components/StudentIDCard';
import '../../styles/registrar.css';

import {
  UserPlus,
  Printer,
  CheckCircle2,
  Copy,
  CalendarDays,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  ImagePlus,
  Upload,
  X,
} from 'lucide-react';

const GENDER_OPTIONS = [
  { en: 'Male', am: 'ወንድ' },
  { en: 'Female', am: 'ሴት' },
];

const BLOOD_GROUP_OPTIONS = [
  { en: 'A+', am: 'A+' },
  { en: 'A−', am: 'A−' },
  { en: 'B+', am: 'B+' },
  { en: 'B−', am: 'B−' },
  { en: 'AB+', am: 'AB+' },
  { en: 'AB−', am: 'AB−' },
  { en: 'O+', am: 'O+' },
  { en: 'O−', am: 'O−' },
];

/*
 * IMPORTANT:
 *
 * The screen still displays:
 * Military — ወታደራዊ
 * Civilian — ሲቪል
 *
 * But the actual value sent to the backend is:
 * MILITARY
 * CIVILIAN
 *
 * This fixes:
 * "Category must be MILITARY or CIVILIAN"
 */
const CATEGORY_OPTIONS = [
  {
    value: 'MILITARY',
    en: 'Military',
    am: 'ወታደራዊ',
  },
  {
    value: 'CIVILIAN',
    en: 'Civilian',
    am: 'ሲቪል',
  },
];

const DEPARTMENT_OPTIONS = [
  { en: 'Freshman', am: 'ፍሬሽማን' },
  { en: 'Computer Science', am: 'ኮምፒዩተር ሳይንስ' },
  { en: 'Civil Engineering', am: 'ሲቪል ኢንጂነሪንግ' },
  { en: 'Production Engineering', am: 'ፕሮዳክሽን ኢንጂነሪንግ' },
  { en: 'Aerospace Engineering', am: 'ኤሮስፔስ ኢንጂነሪንግ' },
  { en: 'Mechanical Engineering', am: 'ሜካኒካል ኢንጂነሪንግ' },
  { en: 'Electrical Engineering', am: 'ኤሌክትሪካል ኢንጂነሪንግ' },
  { en: 'Information Technology', am: 'ኢንፎርሜሽን ቴክኖሎጂ' },
  { en: 'Other', am: 'ሌላ' },
];

const YEAR_OPTIONS = [
  { en: 'Year 1', am: '1ኛ ዓመት' },
  { en: 'Year 2', am: '2ኛ ዓመት' },
  { en: 'Year 3', am: '3ኛ ዓመት' },
  { en: 'Year 4', am: '4ኛ ዓመት' },
  { en: 'Year 5', am: '5ኛ ዓመት' },
];

/*
 * PHOTO REQUIREMENTS
 *
 * The photo does NOT need to be exactly 600 × 708.
 *
 * Accepted:
 * Minimum:     300 × 354 px
 * Maximum:    1200 × 1416 px
 * Recommended: 600 × 708 px
 *
 * Maximum file size: 5 MB
 */
const PHOTO_REQUIREMENTS = {
  minWidth: 300,
  minHeight: 354,
  maxWidth: 1200,
  maxHeight: 1416,
  recommendedWidth: 600,
  recommendedHeight: 708,
  maxSize: 5 * 1024 * 1024,

  minAspectRatio: 0.78,
  maxAspectRatio: 0.92,
};

function getTodayGregorian() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}

function getEthiopianFromGregorian(dateString) {
  if (!dateString) {
    return {
      year: '',
      month: '',
      day: '',
    };
  }

  const [year, month, day] =
    dateString.split('-').map(Number);

  try {
    const result = ethiopianDate.toEthiopian(
      year,
      month,
      day
    );

    return {
      year: result[0],
      month: result[1],
      day: result[2],
    };
  } catch {
    return {
      year: '',
      month: '',
      day: '',
    };
  }
}

function getGregorianFromEthiopian(
  year,
  month,
  day
) {
  if (!year || !month || !day) {
    return '';
  }

  try {
    const result = ethiopianDate.toGregorian(
      Number(year),
      Number(month),
      Number(day)
    );

    const [gYear, gMonth, gDay] = result;

    return [
      String(gYear),
      String(gMonth).padStart(2, '0'),
      String(gDay).padStart(2, '0'),
    ].join('-');
  } catch {
    return '';
  }
}

function SectionHeader({
  number,
  title,
  subtitle,
}) {
  return (
    <div className="registrar-section-header">
      <div className="registrar-section-number">
        {number}
      </div>

      <div>
        <h2>{title}</h2>

        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

function BilingualInput({
  labelEn,
  labelAm,
  valueEn,
  valueAm,
  onChangeEn,
  onChangeAm,
  required = false,
  type = 'text',
  placeholderEn = '',
  placeholderAm = '',
  textarea = false,
}) {
  const commonClass = 'registrar-input';

  return (
    <div className="registrar-field registrar-bilingual-field">
      <div className="registrar-field-label">
        <span>{labelEn}</span>

        <span className="registrar-amharic-label">
          {labelAm}
        </span>

        {required && (
          <span className="registrar-required">
            *
          </span>
        )}
      </div>

      <div className="registrar-bilingual-inputs">
        <div>
          <span className="registrar-language-tag">
            EN
          </span>

          {textarea ? (
            <textarea
              className={commonClass}
              value={valueEn}
              onChange={(e) =>
                onChangeEn(e.target.value)
              }
              placeholder={placeholderEn}
              required={required}
              rows={3}
            />
          ) : (
            <input
              className={commonClass}
              type={type}
              value={valueEn}
              onChange={(e) =>
                onChangeEn(e.target.value)
              }
              placeholder={placeholderEn}
              required={required}
            />
          )}
        </div>

        <div>
          <span className="registrar-language-tag">
            አማ
          </span>

          {textarea ? (
            <textarea
              className={commonClass}
              value={valueAm}
              onChange={(e) =>
                onChangeAm(e.target.value)
              }
              placeholder={placeholderAm}
              required={required}
              rows={3}
            />
          ) : (
            <input
              className={commonClass}
              type={type}
              value={valueAm}
              onChange={(e) =>
                onChangeAm(e.target.value)
              }
              placeholder={placeholderAm}
              required={required}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function BilingualSelect({
  labelEn,
  labelAm,
  value,
  onChange,
  options,
  required = false,
  getValue,
}) {
  return (
    <div className="registrar-field">
      <div className="registrar-field-label">
        <span>{labelEn}</span>

        <span className="registrar-amharic-label">
          {labelAm}
        </span>

        {required && (
          <span className="registrar-required">
            *
          </span>
        )}
      </div>

      <div className="registrar-select-wrapper">
        <select
          className="registrar-input registrar-select"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          required={required}
        >
          <option value="">
            Select / ይምረጡ
          </option>

          {options.map((option) => (
            <option
              key={option.value || option.en}
              value={
                getValue
                  ? getValue(option)
                  : option.en
              }
            >
              {option.en} — {option.am}
            </option>
          ))}
        </select>

        <ChevronDown size={18} />
      </div>
    </div>
  );
}

function DatePair({
  labelEn,
  labelAm,
  gregorian,
  setGregorian,
  ethYear,
  ethMonth,
  ethDay,
  setEthYear,
  setEthMonth,
  setEthDay,
  required = false,
}) {
  const updateGregorian = (value) => {
    setGregorian(value);

    const converted =
      getEthiopianFromGregorian(value);

    setEthYear(converted.year);
    setEthMonth(converted.month);
    setEthDay(converted.day);
  };

  const updateEthiopian = (
    field,
    value
  ) => {
    let nextYear = ethYear;
    let nextMonth = ethMonth;
    let nextDay = ethDay;

    if (field === 'year') {
      nextYear = value;
      setEthYear(value);
    }

    if (field === 'month') {
      nextMonth = value;
      setEthMonth(value);
    }

    if (field === 'day') {
      nextDay = value;
      setEthDay(value);
    }

    const converted =
      getGregorianFromEthiopian(
        nextYear,
        nextMonth,
        nextDay
      );

    if (converted) {
      setGregorian(converted);
    }
  };

  return (
    <div className="registrar-date-card">
      <div className="registrar-date-title">
        <CalendarDays size={18} />

        <div>
          <strong>{labelEn}</strong>
          <span>{labelAm}</span>
        </div>

        {required && (
          <span className="registrar-required">
            *
          </span>
        )}
      </div>

      <div className="registrar-date-grid">
        <div>
          <label>
            Gregorian Calendar / ግሪጎሪያን ዘመን
          </label>

          <input
            className="registrar-input"
            type="date"
            value={gregorian}
            onChange={(e) =>
              updateGregorian(
                e.target.value
              )
            }
            required={required}
          />
        </div>

        <div className="registrar-ethiopian-date">
          <label>
            Ethiopian Calendar / የኢትዮጵያ ዘመን
          </label>

          <div className="registrar-eth-date-inputs">
            <input
              className="registrar-input"
              type="number"
              placeholder="Year / ዓመት"
              value={ethYear}
              onChange={(e) =>
                updateEthiopian(
                  'year',
                  e.target.value
                )
              }
              min="1900"
              max="2200"
              required={required}
            />

            <input
              className="registrar-input"
              type="number"
              placeholder="Month / ወር"
              value={ethMonth}
              onChange={(e) =>
                updateEthiopian(
                  'month',
                  e.target.value
                )
              }
              min="1"
              max="13"
              required={required}
            />

            <input
              className="registrar-input"
              type="number"
              placeholder="Day / ቀን"
              value={ethDay}
              onChange={(e) =>
                updateEthiopian(
                  'day',
                  e.target.value
                )
              }
              min="1"
              max="30"
              required={required}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegistrarDashboard() {
  const fileInputRef = useRef(null);

  /*
   * FIX:
   * Calculate today's Ethiopian date once before
   * initializing the form.
   */
  const initialGregorianDate =
    getTodayGregorian();

  const initialEthiopianDate =
    getEthiopianFromGregorian(
      initialGregorianDate
    );

  const [form, setForm] = useState({
    studentId: '',

    fullNameEn: '',
    fullNameAm: '',

    genderEn: '',
    genderAm: '',

    bloodGroupEn: '',
    bloodGroupAm: '',

    categoryEn: '',
    categoryAm: '',

    residentAddressEn: '',
    residentAddressAm: '',

    emergencyContactNameEn: '',
    emergencyContactNameAm: '',

    emergencyContactPhoneEn: '',
    emergencyContactPhoneAm: '',

    email: '',
    phone: '',
    department: '',
    yearLevel: '',

    photoUrl: '',

    dateOfBirthGregorian: '',
    dateOfBirthEthiopianYear: '',
    dateOfBirthEthiopianMonth: '',
    dateOfBirthEthiopianDay: '',

    issueDateGregorian:
      initialGregorianDate,

    issueDateEthiopianYear:
      initialEthiopianDate.year,

    issueDateEthiopianMonth:
      initialEthiopianDate.month,

    issueDateEthiopianDay:
      initialEthiopianDate.day,

    expiryDateGregorian: '',
    expiryDateEthiopianYear: '',
    expiryDateEthiopianMonth: '',
    expiryDateEthiopianDay: '',
  });

  const [photoFile, setPhotoFile] =
    useState(null);

  const [photoPreview, setPhotoPreview] =
    useState('');

  const [photoError, setPhotoError] =
    useState('');

  const [photoInfo, setPhotoInfo] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [qrLoading, setQrLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [student, setStudent] =
    useState(null);

  const [qr, setQr] =
    useState(null);

  const todayEthiopian = useMemo(
    () =>
      getEthiopianFromGregorian(
        form.issueDateGregorian
      ),
    [form.issueDateGregorian]
  );

  const setField = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const selectGender = (value) => {
    const option =
      GENDER_OPTIONS.find(
        (item) => item.en === value
      );

    setForm((current) => ({
      ...current,
      genderEn: option?.en || '',
      genderAm: option?.am || '',
    }));
  };

  const selectBloodGroup = (
    value
  ) => {
    const option =
      BLOOD_GROUP_OPTIONS.find(
        (item) => item.en === value
      );

    setForm((current) => ({
      ...current,
      bloodGroupEn: option?.en || '',
      bloodGroupAm: option?.am || '',
    }));
  };

  /*
   * CATEGORY FIX
   *
   * value is MILITARY or CIVILIAN.
   * The displayed English/Amharic text
   * remains exactly the same.
   */
  const selectCategory = (
    value
  ) => {
    const option =
      CATEGORY_OPTIONS.find(
        (item) =>
          item.value === value
      );

    setForm((current) => ({
      ...current,

      /*
       * IMPORTANT:
       * categoryEn now stores MILITARY
       * or CIVILIAN for the API.
       */
      categoryEn:
        option?.value || '',

      categoryAm:
        option?.am || '',
    }));
  };

  const handlePhotoChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    setPhotoError('');
    setPhotoInfo(null);

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setPhotoError(
        'Invalid photo format. Please select a JPG, JPEG, or PNG image.'
      );

      event.target.value = '';

      return;
    }

    if (
      file.size >
      PHOTO_REQUIREMENTS.maxSize
    ) {
      setPhotoError(
        'Photo is too large. The maximum allowed file size is 5 MB.'
      );

      event.target.value = '';

      return;
    }

    const image = new Image();

    const objectUrl =
      URL.createObjectURL(file);

    image.onload = () => {
      const width =
        image.naturalWidth;

      const height =
        image.naturalHeight;

      URL.revokeObjectURL(
        objectUrl
      );

      const aspectRatio =
        width / height;

      const dimensionsValid =
        width >=
          PHOTO_REQUIREMENTS.minWidth &&
        height >=
          PHOTO_REQUIREMENTS.minHeight &&
        width <=
          PHOTO_REQUIREMENTS.maxWidth &&
        height <=
          PHOTO_REQUIREMENTS.maxHeight;

      const portraitValid =
        height > width;

      const aspectRatioValid =
        aspectRatio >=
          PHOTO_REQUIREMENTS.minAspectRatio &&
        aspectRatio <=
          PHOTO_REQUIREMENTS.maxAspectRatio;

      if (
        !dimensionsValid ||
        !portraitValid ||
        !aspectRatioValid
      ) {
        setPhotoError(
          `Photo must be between ${PHOTO_REQUIREMENTS.minWidth} × ${PHOTO_REQUIREMENTS.minHeight} and ${PHOTO_REQUIREMENTS.maxWidth} × ${PHOTO_REQUIREMENTS.maxHeight} pixels, in portrait orientation. Recommended size: ${PHOTO_REQUIREMENTS.recommendedWidth} × ${PHOTO_REQUIREMENTS.recommendedHeight} pixels. Selected: ${width} × ${height} pixels.`
        );

        setPhotoInfo({
          width,
          height,
          aspectRatio,
          valid: false,
        });

        setPhotoPreview('');
        setPhotoFile(null);

        event.target.value = '';

        return;
      }

      setPhotoFile(file);

      setPhotoInfo({
        width,
        height,
        aspectRatio,
        size: file.size,
        valid: true,
      });

      const reader =
        new FileReader();

      reader.onload = () => {
        const result =
          reader.result;

        setPhotoPreview(result);

        setForm((current) => ({
          ...current,
          photoUrl: result,
        }));
      };

      reader.readAsDataURL(file);
    };

    image.onerror = () => {
      URL.revokeObjectURL(
        objectUrl
      );

      setPhotoError(
        'The selected file could not be read as an image.'
      );

      event.target.value = '';
    };

    image.src = objectUrl;
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    setPhotoError('');
    setPhotoInfo(null);

    setForm((current) => ({
      ...current,
      photoUrl: '',
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value =
        '';
    }
  };

  const validateRequiredFields =
    () => {
      const requiredFields = [
        ['Student ID', form.studentId],

        [
          'Full Name English',
          form.fullNameEn,
        ],

        [
          'Full Name Amharic',
          form.fullNameAm,
        ],

        ['Gender', form.genderEn],

        [
          'Blood Group',
          form.bloodGroupEn,
        ],

        ['Category', form.categoryEn],

        [
          'Resident Address English',
          form.residentAddressEn,
        ],

        [
          'Resident Address Amharic',
          form.residentAddressAm,
        ],

        [
          'Emergency Contact Name English',
          form.emergencyContactNameEn,
        ],

        [
          'Emergency Contact Name Amharic',
          form.emergencyContactNameAm,
        ],

        [
          'Emergency Contact Phone English',
          form.emergencyContactPhoneEn,
        ],

        [
          'Emergency Contact Phone Amharic',
          form.emergencyContactPhoneAm,
        ],

        ['Student Photo', photoFile],

        [
          'Date of Birth Gregorian',
          form.dateOfBirthGregorian,
        ],

        [
          'Date of Birth Ethiopian Year',
          form.dateOfBirthEthiopianYear,
        ],

        [
          'Date of Birth Ethiopian Month',
          form.dateOfBirthEthiopianMonth,
        ],

        [
          'Date of Birth Ethiopian Day',
          form.dateOfBirthEthiopianDay,
        ],

        [
          'Issue Date Gregorian',
          form.issueDateGregorian,
        ],

        [
          'Issue Date Ethiopian Year',
          form.issueDateEthiopianYear,
        ],

        [
          'Issue Date Ethiopian Month',
          form.issueDateEthiopianMonth,
        ],

        [
          'Issue Date Ethiopian Day',
          form.issueDateEthiopianDay,
        ],

        [
          'Expiry Date Gregorian',
          form.expiryDateGregorian,
        ],

        [
          'Expiry Date Ethiopian Year',
          form.expiryDateEthiopianYear,
        ],

        [
          'Expiry Date Ethiopian Month',
          form.expiryDateEthiopianMonth,
        ],

        [
          'Expiry Date Ethiopian Day',
          form.expiryDateEthiopianDay,
        ],
      ];

      const missing =
        requiredFields
          .filter(
            ([, value]) =>
              !String(
                value ?? ''
              ).trim()
          )
          .map(
            ([label]) => label
          );

      if (missing.length > 0) {
        setError(
          `Please complete all required fields. Missing: ${missing.join(
            ', '
          )}`
        );

        return false;
      }

      if (
        !photoInfo?.valid ||
        !photoFile
      ) {
        setError(
          `Please select a valid student photo between ${PHOTO_REQUIREMENTS.minWidth} × ${PHOTO_REQUIREMENTS.minHeight} and ${PHOTO_REQUIREMENTS.maxWidth} × ${PHOTO_REQUIREMENTS.maxHeight} pixels. Recommended size: ${PHOTO_REQUIREMENTS.recommendedWidth} × ${PHOTO_REQUIREMENTS.recommendedHeight} pixels.`
        );

        return false;
      }

      return true;
    };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (
      !validateRequiredFields()
    ) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    setLoading(true);

    try {
      const payload = {
        studentId:
          form.studentId,

        fullName:
          form.fullNameEn,

        /*
         * THIS IS THE FIX.
         *
         * form.categoryEn is now
         * MILITARY or CIVILIAN.
         */
        category:
          form.categoryEn,

        email:
          form.email,

        phone:
          form.phone,

        department:
          form.department,

        yearLevel:
          form.yearLevel,

        photoUrl:
          form.photoUrl,

        fullNameEn:
          form.fullNameEn,

        fullNameAm:
          form.fullNameAm,

        genderEn:
          form.genderEn,

        genderAm:
          form.genderAm,

        bloodGroupEn:
          form.bloodGroupEn,

        bloodGroupAm:
          form.bloodGroupAm,

        categoryEn:
          form.categoryEn,

        categoryAm:
          form.categoryAm,

        residentAddressEn:
          form.residentAddressEn,

        residentAddressAm:
          form.residentAddressAm,

        emergencyContactNameEn:
          form.emergencyContactNameEn,

        emergencyContactNameAm:
          form.emergencyContactNameAm,

        emergencyContactPhoneEn:
          form.emergencyContactPhoneEn,

        emergencyContactPhoneAm:
          form.emergencyContactPhoneAm,

        dateOfBirthGregorian:
          form.dateOfBirthGregorian,

        dateOfBirthEthiopianYear:
          form.dateOfBirthEthiopianYear,

        dateOfBirthEthiopianMonth:
          form.dateOfBirthEthiopianMonth,

        dateOfBirthEthiopianDay:
          form.dateOfBirthEthiopianDay,

        issueDateGregorian:
          form.issueDateGregorian,

        issueDateEthiopianYear:
          form.issueDateEthiopianYear,

        issueDateEthiopianMonth:
          form.issueDateEthiopianMonth,

        issueDateEthiopianDay:
          form.issueDateEthiopianDay,

        expiryDateGregorian:
          form.expiryDateGregorian,

        expiryDateEthiopianYear:
          form.expiryDateEthiopianYear,

        expiryDateEthiopianMonth:
          form.expiryDateEthiopianMonth,

        expiryDateEthiopianDay:
          form.expiryDateEthiopianDay,
      };

      const response =
        await api.post(
          '/students',
          payload
        );

      const createdStudent =
        response.data?.student ||
        response.data;

      setStudent(
        createdStudent
      );

      setSuccess(
        'Student account created successfully.'
      );

      if (
        createdStudent?.id
      ) {
        setQrLoading(true);

        try {
          const qrResponse =
            await api.get(
              `/students/${createdStudent.id}/qr`
            );

          setQr(
            qrResponse.data?.qr ||
              qrResponse.data
          );
        } catch (qrError) {
          console.error(
            'QR loading error:',
            qrError
          );
        } finally {
          setQrLoading(false);
        }
      }
    } catch (requestError) {
      console.error(
        'Student registration error:',
        requestError
      );

      setError(
        requestError?.response?.data
          ?.message ||
          'Unable to create the student account. Please check the information and try again.'
      );
    } finally {
      setLoading(false);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const resetForm = () => {
    const resetGregorianDate =
      getTodayGregorian();

    const resetEthiopianDate =
      getEthiopianFromGregorian(
        resetGregorianDate
      );

    setForm({
      studentId: '',

      fullNameEn: '',
      fullNameAm: '',

      genderEn: '',
      genderAm: '',

      bloodGroupEn: '',
      bloodGroupAm: '',

      categoryEn: '',
      categoryAm: '',

      residentAddressEn: '',
      residentAddressAm: '',

      emergencyContactNameEn: '',
      emergencyContactNameAm: '',

      emergencyContactPhoneEn: '',
      emergencyContactPhoneAm: '',

      email: '',
      phone: '',
      department: '',
      yearLevel: '',

      photoUrl: '',

      dateOfBirthGregorian: '',
      dateOfBirthEthiopianYear: '',
      dateOfBirthEthiopianMonth: '',
      dateOfBirthEthiopianDay: '',

      issueDateGregorian:
        resetGregorianDate,

      issueDateEthiopianYear:
        resetEthiopianDate.year,

      issueDateEthiopianMonth:
        resetEthiopianDate.month,

      issueDateEthiopianDay:
        resetEthiopianDate.day,

      expiryDateGregorian: '',
      expiryDateEthiopianYear: '',
      expiryDateEthiopianMonth: '',
      expiryDateEthiopianDay: '',
    });

    setPhotoFile(null);
    setPhotoPreview('');
    setPhotoError('');
    setPhotoInfo(null);

    setStudent(null);
    setQr(null);

    setError('');
    setSuccess('');

    if (fileInputRef.current) {
      fileInputRef.current.value =
        '';
    }
  };

  const copyToClipboard =
    async (value) => {
      if (!value) return;

      try {
        await navigator.clipboard.writeText(
          value
        );
      } catch {
        console.error(
          'Clipboard copy failed.'
        );
      }
    };

  const printCard = () => {
    window.print();
  };

  return (
    <div className="page-container registrar-dashboard">
      <div className="registrar-page-header">
        <div>
          <div className="registrar-eyebrow">
            ETHIOPIAN DEFENCE UNIVERSITY
          </div>

          <h1>
            Student Registration
          </h1>

          <p>
            Create a student account
            and generate an Aegis ID
            digital identity.
          </p>
        </div>

        <div className="registrar-header-status">
          <div className="registrar-status-dot" />

          <span>
            Aegis ID Registration
          </span>
        </div>
      </div>

      {error && (
        <div className="registrar-alert registrar-alert-error">
          <AlertCircle size={20} />

          <div>
            <strong>
              Registration Error
            </strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="registrar-alert registrar-alert-success">
          <CheckCircle2 size={20} />

          <div>
            <strong>Success</strong>

            <p>{success}</p>
          </div>
        </div>
      )}

      <form
        className="registrar-main-card"
        onSubmit={handleSubmit}
      >
        <SectionHeader
          number="01"
          title="Basic Student Information"
          subtitle="Bilingual student identity information"
        />

        <div className="registrar-grid">
          <div className="registrar-field">
            <div className="registrar-field-label">
              <span>
                Student ID
              </span>

              <span className="registrar-amharic-label">
                የተማሪ መለያ
              </span>

              <span className="registrar-required">
                *
              </span>
            </div>

            <input
              className="registrar-input"
              type="text"
              value={
                form.studentId
              }
              onChange={(e) =>
                setField(
                  'studentId',
                  e.target.value
                )
              }
              placeholder="Example: EDU-2026-0001"
              required
            />
          </div>

          <div />

          <BilingualInput
            labelEn="Full Name"
            labelAm="ሙሉ ስም"
            valueEn={
              form.fullNameEn
            }
            valueAm={
              form.fullNameAm
            }
            onChangeEn={(value) =>
              setField(
                'fullNameEn',
                value
              )
            }
            onChangeAm={(value) =>
              setField(
                'fullNameAm',
                value
              )
            }
            required
            placeholderEn="Student full name"
            placeholderAm="የተማሪው ሙሉ ስም"
          />

          <BilingualSelect
            labelEn="Gender"
            labelAm="ፆታ"
            value={
              form.genderEn
            }
            onChange={
              selectGender
            }
            options={
              GENDER_OPTIONS
            }
            required
          />

          <BilingualSelect
            labelEn="Blood Group"
            labelAm="የደም አይነት"
            value={
              form.bloodGroupEn
            }
            onChange={
              selectBloodGroup
            }
            options={
              BLOOD_GROUP_OPTIONS
            }
            required
          />

          <BilingualSelect
            labelEn="Category"
            labelAm="ምድብ"
            value={
              form.categoryEn
            }
            onChange={
              selectCategory
            }
            options={
              CATEGORY_OPTIONS
            }
            getValue={(option) =>
              option.value
            }
            required
          />

          <BilingualInput
            labelEn="Resident Address"
            labelAm="የመኖሪያ አድራሻ"
            valueEn={
              form.residentAddressEn
            }
            valueAm={
              form.residentAddressAm
            }
            onChangeEn={(value) =>
              setField(
                'residentAddressEn',
                value
              )
            }
            onChangeAm={(value) =>
              setField(
                'residentAddressAm',
                value
              )
            }
            required
            textarea
            placeholderEn="Student residential address"
            placeholderAm="የተማሪው የመኖሪያ አድራሻ"
          />
        </div>

        <SectionHeader
          number="02"
          title="Contact Information"
          subtitle="Emergency contact is mandatory"
        />

        <div className="registrar-grid">
          <BilingualInput
            labelEn="Emergency Contact Name"
            labelAm="የአደጋ ጊዜ ተጠሪ ስም"
            valueEn={
              form.emergencyContactNameEn
            }
            valueAm={
              form.emergencyContactNameAm
            }
            onChangeEn={(value) =>
              setField(
                'emergencyContactNameEn',
                value
              )
            }
            onChangeAm={(value) =>
              setField(
                'emergencyContactNameAm',
                value
              )
            }
            required
            placeholderEn="Emergency contact full name"
            placeholderAm="የአደጋ ጊዜ ተጠሪ ሙሉ ስም"
          />

          <BilingualInput
            labelEn="Emergency Contact Phone"
            labelAm="የአደጋ ጊዜ ተጠሪ ስልክ"
            valueEn={
              form.emergencyContactPhoneEn
            }
            valueAm={
              form.emergencyContactPhoneAm
            }
            onChangeEn={(value) =>
              setField(
                'emergencyContactPhoneEn',
                value
              )
            }
            onChangeAm={(value) =>
              setField(
                'emergencyContactPhoneAm',
                value
              )
            }
            required
            type="tel"
            placeholderEn="+251..."
            placeholderAm="+251..."
          />

          <div className="registrar-field">
            <div className="registrar-field-label">
              <span>
                Student Phone
              </span>

              <span className="registrar-amharic-label">
                የተማሪ ስልክ
              </span>

              <span className="registrar-optional">
                Optional
              </span>
            </div>

            <input
              className="registrar-input"
              type="tel"
              value={
                form.phone
              }
              onChange={(e) =>
                setField(
                  'phone',
                  e.target.value
                )
              }
              placeholder="+251..."
            />
          </div>

          <div className="registrar-field">
            <div className="registrar-field-label">
              <span>Email</span>

              <span className="registrar-amharic-label">
                ኢሜይል
              </span>

              <span className="registrar-optional">
                Optional
              </span>
            </div>

            <input
              className="registrar-input"
              type="email"
              value={
                form.email
              }
              onChange={(e) =>
                setField(
                  'email',
                  e.target.value
                )
              }
              placeholder="student@example.com"
            />
          </div>
        </div>

        <SectionHeader
          number="03"
          title="Academic Information"
          subtitle="Optional academic classification"
        />

        <div className="registrar-grid">
          <BilingualSelect
            labelEn="Department"
            labelAm="የትምህርት ክፍል"
            value={
              form.department
            }
            onChange={(value) =>
              setField(
                'department',
                value
              )
            }
            options={
              DEPARTMENT_OPTIONS
            }
          />

          <BilingualSelect
            labelEn="Year Level"
            labelAm="የትምህርት ዓመት"
            value={
              form.yearLevel
            }
            onChange={(value) =>
              setField(
                'yearLevel',
                value
              )
            }
            options={
              YEAR_OPTIONS
            }
          />
        </div>

        <SectionHeader
          number="04"
          title="Student Photo"
          subtitle="Photo must meet the Aegis ID card requirements"
        />

        <div className="registrar-photo-section">
          <div className="registrar-photo-requirements">
            <div className="registrar-photo-requirement-icon">
              <ImagePlus size={24} />
            </div>

            <div>
              <h3>
                Aegis ID Photo Requirements
              </h3>

              <ul>
                <li>
                  <strong>
                    Allowed size:
                  </strong>{' '}
                  300 × 354 to
                  1200 × 1416 pixels
                </li>

                <li>
                  <strong>
                    Recommended:
                  </strong>{' '}
                  600 × 708 pixels
                </li>

                <li>
                  <strong>
                    Orientation:
                  </strong>{' '}
                  Portrait
                </li>

                <li>
                  <strong>
                    File type:
                  </strong>{' '}
                  JPG, JPEG, or PNG
                </li>

                <li>
                  <strong>
                    Maximum file size:
                  </strong>{' '}
                  5 MB
                </li>

                <li>
                  <strong>
                    Source:
                  </strong>{' '}
                  Select directly
                  from this computer
                </li>
              </ul>
            </div>
          </div>

          <div className="registrar-photo-uploader">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={
                handlePhotoChange
              }
              hidden
            />

            {!photoPreview ? (
              <button
                type="button"
                className="registrar-photo-select-button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <Upload size={22} />

                <span>
                  Select Student Photo
                </span>

                <small>
                  300 × 354 to
                  1200 × 1416 px •
                  Recommended
                  600 × 708 •
                  JPG/PNG • Max 5 MB
                </small>
              </button>
            ) : (
              <div className="registrar-photo-preview-area">
                <div className="registrar-photo-preview">
                  <img
                    src={
                      photoPreview
                    }
                    alt="Student preview"
                  />
                </div>

                <div className="registrar-photo-details">
                  <div>
                    <strong>
                      {
                        photoFile?.name
                      }
                    </strong>

                    <span>
                      {
                        photoInfo?.width
                      }{' '}
                      ×{' '}
                      {
                        photoInfo?.height
                      } pixels
                    </span>

                    <span>
                      {photoFile
                        ? (
                            photoFile.size /
                            1024 /
                            1024
                          ).toFixed(2)
                        : '0.00'}{' '}
                      MB
                    </span>
                  </div>

                  {photoInfo?.valid && (
                    <div className="registrar-photo-valid">
                      <CheckCircle2
                        size={18}
                      />

                      <span>
                        Photo meets
                        the Aegis ID
                        requirements
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    className="registrar-photo-remove"
                    onClick={
                      removePhoto
                    }
                  >
                    <X size={16} />
                    Remove Photo
                  </button>
                </div>
              </div>
            )}

            {photoError && (
              <div className="registrar-photo-error">
                <AlertCircle
                  size={18}
                />

                <span>
                  {photoError}
                </span>
              </div>
            )}
          </div>
        </div>

        <SectionHeader
          number="05"
          title="Date Information"
          subtitle="Enter dates using both Gregorian and Ethiopian calendars"
        />

        <div className="registrar-date-stack">
          <DatePair
            labelEn="Date of Birth"
            labelAm="የትውልድ ቀን"
            gregorian={
              form.dateOfBirthGregorian
            }
            setGregorian={(value) =>
              setField(
                'dateOfBirthGregorian',
                value
              )
            }
            ethYear={
              form.dateOfBirthEthiopianYear
            }
            ethMonth={
              form.dateOfBirthEthiopianMonth
            }
            ethDay={
              form.dateOfBirthEthiopianDay
            }
            setEthYear={(value) =>
              setField(
                'dateOfBirthEthiopianYear',
                value
              )
            }
            setEthMonth={(value) =>
              setField(
                'dateOfBirthEthiopianMonth',
                value
              )
            }
            setEthDay={(value) =>
              setField(
                'dateOfBirthEthiopianDay',
                value
              )
            }
            required
          />

          <DatePair
            labelEn="Issue Date"
            labelAm="የተሰጠበት ቀን"
            gregorian={
              form.issueDateGregorian
            }
            setGregorian={(value) =>
              setField(
                'issueDateGregorian',
                value
              )
            }
            ethYear={
              form.issueDateEthiopianYear
            }
            ethMonth={
              form.issueDateEthiopianMonth
            }
            ethDay={
              form.issueDateEthiopianDay
            }
            setEthYear={(value) =>
              setField(
                'issueDateEthiopianYear',
                value
              )
            }
            setEthMonth={(value) =>
              setField(
                'issueDateEthiopianMonth',
                value
              )
            }
            setEthDay={(value) =>
              setField(
                'issueDateEthiopianDay',
                value
              )
            }
            required
          />

          <DatePair
            labelEn="Expiry Date"
            labelAm="የሚያበቃበት ቀን"
            gregorian={
              form.expiryDateGregorian
            }
            setGregorian={(value) =>
              setField(
                'expiryDateGregorian',
                value
              )
            }
            ethYear={
              form.expiryDateEthiopianYear
            }
            ethMonth={
              form.expiryDateEthiopianMonth
            }
            ethDay={
              form.expiryDateEthiopianDay
            }
            setEthYear={(value) =>
              setField(
                'expiryDateEthiopianYear',
                value
              )
            }
            setEthMonth={(value) =>
              setField(
                'expiryDateEthiopianMonth',
                value
              )
            }
            setEthDay={(value) =>
              setField(
                'expiryDateEthiopianDay',
                value
              )
            }
            required
          />
        </div>

        <div className="registrar-form-actions">
          <button
            type="button"
            className="registrar-button registrar-button-secondary"
            onClick={resetForm}
            disabled={loading}
          >
            <RefreshCw size={18} />
            Reset Form
          </button>

          <button
            type="submit"
            className="registrar-button registrar-button-primary"
            disabled={loading}
          >
            <UserPlus size={18} />

            {loading
              ? 'Creating Student...'
              : 'Create Student Account'}
          </button>
        </div>
      </form>

      {student && (
        <div className="registrar-result-card">
          <div className="registrar-result-header">
            <div>
              <div className="registrar-eyebrow">
                AEGIS ID
              </div>

              <h2>
                Student Account Created
              </h2>
            </div>

            <CheckCircle2 size={28} />
          </div>

          <div className="registrar-account-grid">
            <div>
              <span>
                Student ID
              </span>

              <strong>
                {student.student_id ||
                  student.studentId ||
                  form.studentId}
              </strong>
            </div>

            <div>
              <span>
                Full Name
              </span>

              <strong>
                {student.full_name ||
                  student.fullName ||
                  form.fullNameEn}
              </strong>
            </div>

            {student.email && (
              <div>
                <span>
                  Account Email
                </span>

                <strong>
                  {student.email}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      student.email
                    )
                  }
                >
                  <Copy size={15} />
                </button>
              </div>
            )}

            {student.tempPassword && (
              <div>
                <span>
                  Temporary Password
                </span>

                <strong>
                  {
                    student.tempPassword
                  }
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      student.tempPassword
                    )
                  }
                >
                  <Copy size={15} />
                </button>
              </div>
            )}
          </div>

          <div className="registrar-id-preview">
            <div className="registrar-id-preview-header">
              <div>
                <h3>
                  Aegis ID Preview
                </h3>

                <p>
                  Review the student's
                  digital identity card.
                </p>
              </div>

              <button
                type="button"
                className="registrar-button registrar-button-secondary"
                onClick={
                  printCard
                }
              >
                <Printer size={18} />
                Print ID
              </button>
            </div>

            <StudentIDCard
              student={{
                ...student,

                photo_url:
                  student.photo_url ||
                  student.photoUrl ||
                  form.photoUrl,

                full_name:
                  student.full_name ||
                  form.fullNameEn,

                student_id:
                  student.student_id ||
                  form.studentId,

                category:
                  student.category ||
                  form.categoryEn,

                department:
                  student.department ||
                  form.department,

                year_level:
                  student.year_level ||
                  form.yearLevel,

                gender:
                  student.gender ||
                  form.genderEn,

                blood_group:
                  student.blood_group ||
                  form.bloodGroupEn,

                resident_address:
                  student.resident_address ||
                  form.residentAddressEn,

                emergency_contact_name:
                  student.emergency_contact_name ||
                  form.emergencyContactNameEn,

                emergency_contact_phone:
                  student.emergency_contact_phone ||
                  form.emergencyContactPhoneEn,
              }}
              qr={qr}
              qrLoading={
                qrLoading
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
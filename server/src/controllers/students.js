import { query, pool } from '../config/db.js';
import QRCode from 'qrcode';
import crypto from 'crypto';

export async function list(req, res) {
  const q = (req.query.q || '').trim();

  const r = await query(
    `SELECT s.*, u.email AS account_email
     FROM students s
     LEFT JOIN users u ON u.id = s.user_id
     WHERE (
       $1 = ''
       OR s.student_id ILIKE '%' || $1 || '%'
       OR s.full_name ILIKE '%' || $1 || '%'
     )
     ORDER BY s.full_name`,
    [q]
  );

  res.json(r.rows);
}

export async function get(req, res) {
  const r = await query(
    `SELECT s.*, u.email AS account_email
     FROM students s
     LEFT JOIN users u ON u.id = s.user_id
     WHERE s.id = $1`,
    [req.params.id]
  );

  if (!r.rows[0]) {
    return res.status(404).json({
      message: 'Student not found',
    });
  }

  res.json(r.rows[0]);
}

export async function qr(req, res) {
  const r = await query(
    `SELECT student_id, qr_secret
     FROM students
     WHERE id = $1`,
    [req.params.id]
  );

  if (!r.rows[0]) {
    return res.status(404).json({
      message: 'Student not found',
    });
  }

  const token =
    `AEGIS:${r.rows[0].student_id}:${r.rows[0].qr_secret}`;

  res.json({
    dataUrl: await QRCode.toDataURL(token, {
      width: 280,
      margin: 2,
    }),
    value: token,
  });
}

export async function create(req, res) {
  const client = await pool.connect();

  try {
    const {
      studentId,
      fullName,
      category,
      email,
      phone,
      department,
      yearLevel,
      photoUrl,

      fullNameEn,
      fullNameAm,

      genderEn,
      genderAm,

      bloodGroupEn,
      bloodGroupAm,

      categoryEn,
      categoryAm,

      residentAddressEn,
      residentAddressAm,

      emergencyContactNameEn,
      emergencyContactNameAm,

      emergencyContactPhoneEn,
      emergencyContactPhoneAm,

      dateOfBirthGregorian,
      dateOfBirthEthiopianYear,
      dateOfBirthEthiopianMonth,
      dateOfBirthEthiopianDay,

      issueDateGregorian,
      issueDateEthiopianYear,
      issueDateEthiopianMonth,
      issueDateEthiopianDay,

      expiryDateGregorian,
      expiryDateEthiopianYear,
      expiryDateEthiopianMonth,
      expiryDateEthiopianDay,
    } = req.body;

    if (!studentId || !fullName || !category || !email) {
      return res.status(400).json({
        message:
          'Student ID, full name, category, and email are required',
      });
    }

    if (!['MILITARY', 'CIVILIAN'].includes(category)) {
      return res.status(400).json({
        message:
          'Category must be MILITARY or CIVILIAN',
      });
    }

    const enteredEmail = email.trim().toLowerCase();

    const emailUsername = enteredEmail.split('@')[0];

    if (!emailUsername) {
      return res.status(400).json({
        message: 'Please enter a valid email address',
      });
    }

    const normalizedEmail =
      `${emailUsername}@aegis.id`;

    const existingStudent = await query(
      `SELECT id
       FROM students
       WHERE student_id = $1`,
      [studentId]
    );

    if (existingStudent.rows[0]) {
      return res.status(409).json({
        message: 'Student ID already exists',
      });
    }

    const existingUser = await query(
      `SELECT id
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    );

    if (existingUser.rows[0]) {
      return res.status(409).json({
        message:
          `Email account ${normalizedEmail} already exists`,
      });
    }

    const firstName =
      fullName.trim().split(/\s+/)[0];

    const formattedFirstName =
      firstName.charAt(0).toUpperCase() +
      firstName.slice(1).toLowerCase();

    const randomNumber =
      crypto.randomInt(100, 1000);

    const temporaryPassword =
      `${formattedFirstName}${randomNumber}`;

    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (
        email,
        password_hash,
        role,
        status
      )
      VALUES (
        $1,
        crypt($2, gen_salt('bf')),
        'STUDENT',
        'ACTIVE'
      )
      RETURNING id, email, role, status`,
      [
        normalizedEmail,
        temporaryPassword,
      ]
    );

    const user = userResult.rows[0];

    const qrSecret = crypto.randomUUID();

    const studentResult = await client.query(
      `INSERT INTO students (
        user_id,
        student_id,
        full_name,
        date_of_birth,
        phone,
        email,
        emergency_contact_name,
        emergency_contact_phone,
        category,
        department,
        residence,
        photo_url,
        issue_date,
        expiry_date,
        campus_status,
        qr_secret,
        year_level,
        status,

        full_name_en,
        full_name_am,

        gender_en,
        gender_am,

        blood_group_en,
        blood_group_am,

        category_en,
        category_am,

        resident_address_en,
        resident_address_am,

        emergency_contact_name_en,
        emergency_contact_name_am,

        emergency_contact_phone_en,
        emergency_contact_phone_am,

        date_of_birth_gregorian,
        date_of_birth_ethiopian_year,
        date_of_birth_ethiopian_month,
        date_of_birth_ethiopian_day,

        issue_date_ethiopian_year,
        issue_date_ethiopian_month,
        issue_date_ethiopian_day,

        expiry_date_ethiopian_year,
        expiry_date_ethiopian_month,
        expiry_date_ethiopian_day
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        'INSIDE',
        $15,
        $16,
        'ACTIVE',

        $17,
        $18,

        $19,
        $20,

        $21,
        $22,

        $23,
        $24,

        $25,
        $26,

        $27,
        $28,

        $29,
        $30,

        $31,
        $32,
        $33,
        $34,

        $35,
        $36,
        $37,

        $38,
        $39,
        $40
      )
      RETURNING *`,
      [
        user.id,
        studentId,
        fullName,

        dateOfBirthGregorian || null,

        phone || null,
        normalizedEmail,

        emergencyContactNameEn || null,
        emergencyContactPhoneEn || null,

        category,
        department || null,

        residentAddressEn || null,

        photoUrl || null,

        issueDateGregorian || null,
        expiryDateGregorian || null,

        qrSecret,
        yearLevel || null,

        fullNameEn || fullName,
        fullNameAm || null,

        genderEn || null,
        genderAm || null,

        bloodGroupEn || null,
        bloodGroupAm || null,

        categoryEn || category,
        categoryAm || null,

        residentAddressEn || null,
        residentAddressAm || null,

        emergencyContactNameEn || null,
        emergencyContactNameAm || null,

        emergencyContactPhoneEn || null,
        emergencyContactPhoneAm || null,

        dateOfBirthGregorian || null,
        dateOfBirthEthiopianYear || null,
        dateOfBirthEthiopianMonth || null,
        dateOfBirthEthiopianDay || null,

        issueDateEthiopianYear || null,
        issueDateEthiopianMonth || null,
        issueDateEthiopianDay || null,

        expiryDateEthiopianYear || null,
        expiryDateEthiopianMonth || null,
        expiryDateEthiopianDay || null,
      ]
    );

    const student =
      studentResult.rows[0];

    const token =
      `AEGIS:${student.student_id}:${student.qr_secret}`;

    const qrDataUrl =
      await QRCode.toDataURL(token, {
        width: 280,
        margin: 2,
      });

    await client.query('COMMIT');

    res.status(201).json({
      message:
        'Student and login account created successfully',

      student,

      account: {
        email: user.email,
        role: user.role,
        temporaryPassword,
      },

      qr: {
        value: token,
        dataUrl: qrDataUrl,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');

    console.error(
      'Create student error:',
      error
    );

    res.status(500).json({
      message: 'Failed to create student',
    });
  } finally {
    client.release();
  }
}


/* =========================================================
   UPDATE STUDENT
   ========================================================= */

export async function update(req, res) {
  const client = await pool.connect();

  try {
    const studentId = req.params.id;

    const {
      studentIdNumber,
      fullName,
      fullNameEn,
      fullNameAm,

      genderEn,
      genderAm,

      bloodGroupEn,
      bloodGroupAm,

      category,
      categoryEn,
      categoryAm,

      residentAddressEn,
      residentAddressAm,

      emergencyContactNameEn,
      emergencyContactNameAm,

      emergencyContactPhoneEn,
      emergencyContactPhoneAm,

      email,
      newPassword,

      phone,
      department,
      yearLevel,

      photoUrl,

      dateOfBirthGregorian,
      dateOfBirthEthiopianYear,
      dateOfBirthEthiopianMonth,
      dateOfBirthEthiopianDay,

      issueDateGregorian,
      issueDateEthiopianYear,
      issueDateEthiopianMonth,
      issueDateEthiopianDay,

      expiryDateGregorian,
      expiryDateEthiopianYear,
      expiryDateEthiopianMonth,
      expiryDateEthiopianDay,
    } = req.body;

    if (!fullName && !fullNameEn) {
      return res.status(400).json({
        message: 'Full name is required',
      });
    }

    const finalFullName =
      fullName ||
      fullNameEn;

    const finalCategory =
      category ||
      categoryEn;

    if (
      finalCategory &&
      !['MILITARY', 'CIVILIAN'].includes(
        finalCategory
      )
    ) {
      return res.status(400).json({
        message:
          'Category must be MILITARY or CIVILIAN',
      });
    }

    /*
     * Password is optional during normal
     * student editing.
     *
     * If supplied, it must meet the
     * minimum security requirement.
     */
    if (
      newPassword !== undefined &&
      newPassword !== null &&
      String(newPassword).length > 0 &&
      String(newPassword).length < 8
    ) {
      return res.status(400).json({
        message:
          'New password must be at least 8 characters long',
      });
    }

    const existingStudent =
      await client.query(
        `SELECT *
         FROM students
         WHERE id = $1`,
        [studentId]
      );

    if (!existingStudent.rows[0]) {
      return res.status(404).json({
        message: 'Student not found',
      });
    }

    const current =
      existingStudent.rows[0];

    /*
     * Student ID can be edited, but it must
     * remain unique.
     */
    const finalStudentId =
      studentIdNumber ||
      current.student_id;

    if (
      finalStudentId !==
      current.student_id
    ) {
      const duplicate =
        await client.query(
          `SELECT id
           FROM students
           WHERE student_id = $1
             AND id <> $2`,
          [
            finalStudentId,
            studentId,
          ]
        );

      if (duplicate.rows[0]) {
        return res.status(409).json({
          message:
            'Student ID already exists',
        });
      }
    }

    const finalCategoryValue =
      finalCategory ||
      current.category;

    const finalCategoryAm =
      categoryAm !== undefined
        ? categoryAm
        : current.category_am;

    const finalCategoryEn =
      categoryEn ||
      finalCategoryValue ||
      current.category_en;

    /*
     * Validate email before beginning the
     * transaction.
     */
    let normalizedEmail = null;

    if (email !== undefined && email.trim()) {
      const enteredEmail =
        email.trim().toLowerCase();

      const emailUsername =
        enteredEmail.split('@')[0];

      if (!emailUsername) {
        return res.status(400).json({
          message:
            'Please enter a valid email address',
        });
      }

      normalizedEmail =
        `${emailUsername}@aegis.id`;
    }

    await client.query('BEGIN');

    const studentResult =
      await client.query(
        `UPDATE students
         SET
           student_id = $1,
           full_name = $2,
           date_of_birth = $3,
           phone = $4,
           emergency_contact_name = $5,
           emergency_contact_phone = $6,
           category = $7,
           department = $8,
           residence = $9,
           photo_url = $10,
           issue_date = $11,
           expiry_date = $12,
           year_level = $13,

           full_name_en = $14,
           full_name_am = $15,

           gender_en = $16,
           gender_am = $17,

           blood_group_en = $18,
           blood_group_am = $19,

           category_en = $20,
           category_am = $21,

           resident_address_en = $22,
           resident_address_am = $23,

           emergency_contact_name_en = $24,
           emergency_contact_name_am = $25,

           emergency_contact_phone_en = $26,
           emergency_contact_phone_am = $27,

           date_of_birth_gregorian = $28,
           date_of_birth_ethiopian_year = $29,
           date_of_birth_ethiopian_month = $30,
           date_of_birth_ethiopian_day = $31,

           issue_date_ethiopian_year = $32,
           issue_date_ethiopian_month = $33,
           issue_date_ethiopian_day = $34,

           expiry_date_ethiopian_year = $35,
           expiry_date_ethiopian_month = $36,
           expiry_date_ethiopian_day = $37

         WHERE id = $38

         RETURNING *`,
        [
          finalStudentId,
          finalFullName,

          dateOfBirthGregorian !== undefined
            ? dateOfBirthGregorian || null
            : current.date_of_birth,

          phone !== undefined
            ? phone || null
            : current.phone,

          emergencyContactNameEn !== undefined
            ? emergencyContactNameEn || null
            : current.emergency_contact_name,

          emergencyContactPhoneEn !== undefined
            ? emergencyContactPhoneEn || null
            : current.emergency_contact_phone,

          finalCategoryValue,

          department !== undefined
            ? department || null
            : current.department,

          residentAddressEn !== undefined
            ? residentAddressEn || null
            : current.residence,

          photoUrl !== undefined
            ? photoUrl || null
            : current.photo_url,

          issueDateGregorian !== undefined
            ? issueDateGregorian || null
            : current.issue_date,

          expiryDateGregorian !== undefined
            ? expiryDateGregorian || null
            : current.expiry_date,

          yearLevel !== undefined
            ? yearLevel || null
            : current.year_level,

          fullNameEn ||
            current.full_name_en ||
            finalFullName,

          fullNameAm !== undefined
            ? fullNameAm || null
            : current.full_name_am,

          genderEn !== undefined
            ? genderEn || null
            : current.gender_en,

          genderAm !== undefined
            ? genderAm || null
            : current.gender_am,

          bloodGroupEn !== undefined
            ? bloodGroupEn || null
            : current.blood_group_en,

          bloodGroupAm !== undefined
            ? bloodGroupAm || null
            : current.blood_group_am,

          finalCategoryEn,

          finalCategoryAm,

          residentAddressEn !== undefined
            ? residentAddressEn || null
            : current.resident_address_en,

          residentAddressAm !== undefined
            ? residentAddressAm || null
            : current.resident_address_am,

          emergencyContactNameEn !== undefined
            ? emergencyContactNameEn || null
            : current.emergency_contact_name_en,

          emergencyContactNameAm !== undefined
            ? emergencyContactNameAm || null
            : current.emergency_contact_name_am,

          emergencyContactPhoneEn !== undefined
            ? emergencyContactPhoneEn || null
            : current.emergency_contact_phone_en,

          emergencyContactPhoneAm !== undefined
            ? emergencyContactPhoneAm || null
            : current.emergency_contact_phone_am,

          dateOfBirthGregorian !== undefined
            ? dateOfBirthGregorian || null
            : current.date_of_birth_gregorian,

          dateOfBirthEthiopianYear !== undefined
            ? dateOfBirthEthiopianYear || null
            : current.date_of_birth_ethiopian_year,

          dateOfBirthEthiopianMonth !== undefined
            ? dateOfBirthEthiopianMonth || null
            : current.date_of_birth_ethiopian_month,

          dateOfBirthEthiopianDay !== undefined
            ? dateOfBirthEthiopianDay || null
            : current.date_of_birth_ethiopian_day,

          issueDateEthiopianYear !== undefined
            ? issueDateEthiopianYear || null
            : current.issue_date_ethiopian_year,

          issueDateEthiopianMonth !== undefined
            ? issueDateEthiopianMonth || null
            : current.issue_date_ethiopian_month,

          issueDateEthiopianDay !== undefined
            ? issueDateEthiopianDay || null
            : current.issue_date_ethiopian_day,

          expiryDateEthiopianYear !== undefined
            ? expiryDateEthiopianYear || null
            : current.expiry_date_ethiopian_year,

          expiryDateEthiopianMonth !== undefined
            ? expiryDateEthiopianMonth || null
            : current.expiry_date_ethiopian_month,

          expiryDateEthiopianDay !== undefined
            ? expiryDateEthiopianDay || null
            : current.expiry_date_ethiopian_day,

          studentId,
        ]
      );

    /*
     * Check for duplicate login email.
     */
    if (normalizedEmail) {
      const duplicateEmail =
        await client.query(
          `SELECT id
           FROM users
           WHERE email = $1
             AND id <> $2`,
          [
            normalizedEmail,
            current.user_id,
          ]
        );

      if (duplicateEmail.rows[0]) {
        await client.query('ROLLBACK');

        return res.status(409).json({
          message:
            `Email account ${normalizedEmail} already exists`,
        });
      }

      await client.query(
        `UPDATE users
         SET email = $1
         WHERE id = $2`,
        [
          normalizedEmail,
          current.user_id,
        ]
      );
    }

    /*
     * Change password only when the Registrar
     * actually enters a new password.
     *
     * The password is hashed by PostgreSQL
     * using the same pgcrypto method used
     * during account creation.
     */
    if (
      newPassword !== undefined &&
      newPassword !== null &&
      String(newPassword).trim() !== ''
    ) {
      await client.query(
        `UPDATE users
         SET password_hash = crypt($1, gen_salt('bf'))
         WHERE id = $2`,
        [
          String(newPassword),
          current.user_id,
        ]
      );
    }

    await client.query('COMMIT');

    /*
     * Return the updated login email, but
     * NEVER return the password or password hash.
     */
    const accountResult =
      await client.query(
        `SELECT
           email,
           role,
           status
         FROM users
         WHERE id = $1`,
        [current.user_id]
      );

    res.json({
      message:
        newPassword &&
        String(newPassword).trim() !== ''
          ? 'Student information and login password updated successfully'
          : 'Student information updated successfully',

      student:
        studentResult.rows[0],

      account:
        accountResult.rows[0] || null,

      passwordChanged:
        Boolean(
          newPassword &&
          String(newPassword).trim() !== ''
        ),
    });
  } catch (error) {
    await client.query('ROLLBACK');

    console.error(
      'Update student error:',
      error
    );

    res.status(500).json({
      message:
        'Failed to update student',
    });
  } finally {
    client.release();
  }
}


/* =========================================================
   PERMANENT DELETE STUDENT
   ========================================================= */

export async function remove(req, res) {
  const client = await pool.connect();

  try {
    const studentId =
      req.params.id;

    await client.query('BEGIN');

    const studentResult =
      await client.query(
        `SELECT user_id
         FROM students
         WHERE id = $1`,
        [studentId]
      );

    if (!studentResult.rows[0]) {
      await client.query('ROLLBACK');

      return res.status(404).json({
        message: 'Student not found',
      });
    }

    const userId =
      studentResult.rows[0].user_id;

    await client.query(
      `DELETE FROM students
       WHERE id = $1`,
      [studentId]
    );

    if (userId) {
      await client.query(
        `DELETE FROM users
         WHERE id = $1`,
        [userId]
      );
    }

    await client.query('COMMIT');

    res.json({
      message:
        'Student ID and associated account permanently deleted',
    });
  } catch (error) {
    await client.query('ROLLBACK');

    console.error(
      'Delete student error:',
      error
    );

    res.status(500).json({
      message:
        'Failed to delete student',
    });
  } finally {
    client.release();
  }
}
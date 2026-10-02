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

    /*
     * Convert the Registrar's entered email
     * to the official Aegis ID email domain.
     *
     * Example:
     * kingogadisa400@gmail.com
     * becomes
     * kingogadisa400@aegis.id
     */
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

    /*
     * Generate password:
     * First name + random 3 digits
     *
     * Example:
     * Henok Tesfaye -> Henok845
     */
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
        category,
        phone,
        department,
        year_level,
        photo_url,
        qr_secret,
        campus_status,
        status
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
        'INSIDE',
        'ACTIVE'
      )
      RETURNING *`,
      [
        user.id,
        studentId,
        fullName,
        category,
        phone || null,
        department || null,
        yearLevel || null,
        photoUrl || null,
        qrSecret,
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
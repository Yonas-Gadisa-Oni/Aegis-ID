import { query } from '../config/db.js';
export async function expireOverduePermissions(){
  const r=await query(`SELECT p.id,p.student_id,s.user_id,s.full_name FROM permissions p JOIN students s ON s.id=p.student_id WHERE p.status IN ('APPROVED','ACTIVE') AND s.campus_status='OUTSIDE' AND p.approved_return IS NOT NULL AND p.approved_return < now()`);
  for(const x of r.rows){
    const u=await query(`UPDATE permissions SET status='EXPIRED',updated_at=now() WHERE id=$1 AND status IN ('APPROVED','ACTIVE') RETURNING id`,[x.id]);
    if(u.rowCount){ await query(`INSERT INTO alerts(student_id,permission_id,type,message) VALUES($1,$2,'PERMISSION_EXPIRED',$3)`,[x.student_id,x.id,`${x.full_name}'s campus permission has expired without a recorded return.`]); if(x.user_id) await query(`INSERT INTO notifications(user_id,title,message,type) VALUES($1,'Permission expired',$2,'ALERT')`,[x.user_id,'Your campus permission has expired. Please contact the university administration.']); }
  }
}

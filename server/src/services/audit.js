import { query } from '../config/db.js';
export async function audit(userId,action,entityType=null,entityId=null,description=''){ await query('INSERT INTO audit_logs(user_id,action,entity_type,entity_id,description) VALUES($1,$2,$3,$4,$5)',[userId,action,entityType,entityId,description]); }
export async function notify(userId,title,message,type='INFO'){ await query('INSERT INTO notifications(user_id,title,message,type) VALUES($1,$2,$3,$4)',[userId,title,message,type]); }

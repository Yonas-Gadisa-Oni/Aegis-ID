import { query } from '../config/db.js';
import { verifyToken } from '../utils/auth.js';
export async function auth(req,res,next){
  try { const h=req.headers.authorization||''; if(!h.startsWith('Bearer ')) return res.status(401).json({message:'Authentication required'}); const p=verifyToken(h.slice(7)); const r=await query('SELECT id,email,role,status FROM users WHERE id=$1',[p.sub]); if(!r.rows[0]||r.rows[0].status!=='ACTIVE') return res.status(401).json({message:'Account inactive'}); req.user=r.rows[0]; next(); } catch(e){ return res.status(401).json({message:'Invalid or expired token'}); }
}
export const allow=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'Insufficient permissions'});

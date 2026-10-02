import express from 'express'; import cors from 'cors'; import helmet from 'helmet'; import rateLimit from 'express-rate-limit'; import dotenv from 'dotenv';
import routes from './routes/index.js'; import { errorHandler } from './middleware/error.js'; import { expireOverduePermissions } from './services/monitor.js';
dotenv.config(); const app=express();
app.use(helmet()); app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'})); app.use(express.json({limit:'1mb'})); app.use(rateLimit({windowMs:15*60*1000,max:300,standardHeaders:true,legacyHeaders:false}));
app.get('/api/health',(req,res)=>res.json({status:'ok',service:'aegis-id-api',time:new Date().toISOString()})); app.use('/api',routes); app.use(errorHandler);
const port=Number(process.env.PORT||5000); app.listen(port,()=>console.log(`Aegis ID API running on http://localhost:${port}`));
setInterval(()=>expireOverduePermissions().catch(console.error),60*1000); expireOverduePermissions().catch(console.error);

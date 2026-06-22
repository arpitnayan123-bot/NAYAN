import { createHandler } from '../../backend/core/middleware';
import { getAppointments, bookAppointment, updateAppointment } from '../../backend/services/health';

// GET/POST/PATCH /api/health/appointments
export default createHandler(
  async (req, res) => {
    const token = req.headers.authorization!.split(' ')[1];

    if (req.method === 'GET') {
      const data = await getAppointments(req.user.id, token);
      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'POST') {
      const { doctor_name, doctor_specialty, appointment_date, appointment_time } = req.body || {};
      if (!doctor_name || !doctor_specialty || !appointment_date || !appointment_time) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const data = await bookAppointment(req.user.id, token, req.body);
      return res.status(201).json({ success: true, data });
    }

    if (req.method === 'PATCH') {
      const id = (req.query.id as string) || req.body?.id;
      if (!id) return res.status(400).json({ error: 'id required' });
      const data = await updateAppointment(req.user.id, token, id, req.body);
      return res.status(200).json({ success: true, data });
    }
  },
  { methods: ['GET', 'POST', 'PATCH'], requireAuth: true }
);

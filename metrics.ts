import { createHandler } from '../../backend/core/middleware';
import { getMetrics, saveMetric } from '../../backend/services/health';

// GET/POST /api/health/metrics — Health vitals CRUD
export default createHandler(
  async (req, res) => {
    const token = req.headers.authorization!.split(' ')[1];

    if (req.method === 'GET') {
      const days = parseInt((req.query.days as string) || '30', 10);
      const data = await getMetrics(req.user.id, token, days);
      return res.status(200).json({ success: true, data, count: data?.length || 0 });
    }

    if (req.method === 'POST') {
      if (!req.body?.weight_kg || !req.body?.height_cm) {
        return res.status(400).json({ error: 'weight_kg and height_cm required' });
      }
      const data = await saveMetric(req.user.id, token, req.body);
      return res.status(201).json({ success: true, data });
    }
  },
  { methods: ['GET', 'POST'], requireAuth: true }
);

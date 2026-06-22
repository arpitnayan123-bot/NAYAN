import { createHandler } from '../../backend/core/middleware';
import { getProfile, updateProfile, getHealthScore } from '../../backend/services/auth';

// GET/PUT /api/auth/me — User profile + health score
export default createHandler(
  async (req, res) => {
    const token = req.headers.authorization!.split(' ')[1];

    if (req.method === 'GET') {
      const [profile, healthScore] = await Promise.all([
        getProfile(req.user.id, token),
        getHealthScore(req.user.id, token),
      ]);
      return res.status(200).json({
        success: true,
        data: { user: { id: req.user.id, email: req.user.email }, profile, health_score: healthScore },
      });
    }

    if (req.method === 'PUT') {
      const profile = await updateProfile(req.user.id, token, req.body);
      return res.status(200).json({ success: true, data: profile });
    }
  },
  { methods: ['GET', 'PUT'], requireAuth: true }
);

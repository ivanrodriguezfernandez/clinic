import express from 'express';
import { Container } from './Container';
import { createClinicRoutes } from './clinic/presentation/clinicRoutes';
import { createPatientRoutes } from './patient/presentation/patientRoutes';
import { createSampleRoutes } from './sample/presentation/sampleRoutes';
import { errorHandler } from './shared/middleware/errorHandler';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Container
const container = new Container();

// Routes
app.use('/api/clinics', createClinicRoutes(container.getClinicController()));
app.use('/api/patients', createPatientRoutes(container.getPatientController()));
app.use('/api/samples', createSampleRoutes(container.getSampleController()));

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
      statusCode: 404,
    },
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

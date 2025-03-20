import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('ReservationsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Mock user tokens for different roles
  const clientToken = 'mock-client-token'; // Replace with actual token generation logic
  const employerToken = 'mock-employer-token';
  const adminToken = 'mock-admin-token';

  describe('/reservations (POST)', () => {
    it('should create a reservation (role: client)', async () => {
      const createReservationDto = {
        userId: 1,
        parkingId: 1,
        vehicleId: 1,
        reservationStart: new Date(Date.now() + 3600 * 1000).toISOString(),
        reservationEnd: new Date(Date.now() + 7200 * 1000).toISOString(),
      };

      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${clientToken}`) // Simulate client role
        .send(createReservationDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toMatchObject(createReservationDto);
    });

    it('should fail to create a reservation if spots are unavailable', async () => {
      const createReservationDto = {
        userId: 1,
        parkingId: 1,
        vehicleId: 1,
        reservationStart: new Date(Date.now() + 3600 * 1000).toISOString(),
        reservationEnd: new Date(Date.now() + 7200 * 1000).toISOString(),
      };

      // Simulate a scenario where parking spots are full
      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(createReservationDto)
        .expect(400); // Expect BadRequestException
    });

    it('should deny access to non-client users', async () => {
      const createReservationDto = {
        userId: 1,
        parkingId: 1,
        vehicleId: 1,
        reservationStart: new Date(Date.now() + 3600 * 1000).toISOString(),
        reservationEnd: new Date(Date.now() + 7200 * 1000).toISOString(),
      };

      // Try with an unauthorized role (e.g., employer)
      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(createReservationDto)
        .expect(403); // Expect ForbiddenException
    });
  });

  describe('/reservations (GET)', () => {
    it('should retrieve all reservations with pagination (role: employer)', async () => {
      const paginationDto = {
        page: 1,
        perPage: 10,
        reservationStart: new Date(Date.now() - 86400 * 1000).toISOString(), // 1 day ago
        reservationEnd: new Date(Date.now() + 86400 * 1000).toISOString(), // 1 day ahead
      };

      const response = await request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${employerToken}`) // Simulate employer role
        .query(paginationDto)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.total).toBeGreaterThanOrEqual(0);
    });

    it('should handle missing filters and default pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${employerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.total).toBeGreaterThanOrEqual(0);
    });

    it('should deny access to non-authorized users', async () => {
      await request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${clientToken}`) // Simulate client role
        .expect(403); // Expect ForbiddenException
    });
  });
});

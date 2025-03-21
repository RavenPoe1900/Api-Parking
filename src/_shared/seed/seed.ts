import { createConnection } from 'typeorm';
import { hashPassword } from '../applications/hash';
import { Parking } from '../../../src/parkings/domain/parking.entity';
import { Role } from '../../../src/roles/domain/role.entity';
import { User } from '../../../src/users/domain/user.entity';
import { Reservation } from '../../../src/reservations/domain/reservation.entity';
import { VehicleDetail } from '../../../src/vehicleDetails/domain/vehicleDetail.entity';
import { ReservationStatus } from '../../../src/reservations/domain/reservationStatus.enum';

async function seedDatabase() {
  try {
    // Connect to the database
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'], // Load all entity files
      synchronize: process.env.NODE_ENV === 'development', // Enable synchronization in development mode
    });

    console.log('Database connection established');

    // Get repositories for each entity
    const parkingRepository = connection.getRepository(Parking);
    const roleRepository = connection.getRepository(Role);
    const userRepository = connection.getRepository(User);
    const reservationRepository = connection.getRepository(Reservation);
    const vehicleDetailRepository = connection.getRepository(VehicleDetail);

    // Create roles if they don't exist
    let adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      adminRole = roleRepository.create({ name: 'admin' });
      await roleRepository.save(adminRole);
      console.log('Admin role created');
    }

    let employerRole = await roleRepository.findOne({
      where: { name: 'employer' },
    });
    if (!employerRole) {
      employerRole = roleRepository.create({ name: 'employer' });
      await roleRepository.save(employerRole);
      console.log('Employer role created');
    }

    let clientRole = await roleRepository.findOne({
      where: { name: 'client' },
    });
    if (!clientRole) {
      clientRole = roleRepository.create({ name: 'client' });
      await roleRepository.save(clientRole);
      console.log('Client role created');
    }

    // Create admin user if it doesn't exist
    let adminUser = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });
    if (!adminUser) {
      const hashedPassword = await hashPassword('adminpassword');
      adminUser = userRepository.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        roleId: adminRole.id,
      });
      await userRepository.save(adminUser);
      console.log('Admin user created');
    }

    // Create regular user if it doesn't exist
    let regularUser = await userRepository.findOne({
      where: { email: 'user@example.com' },
    });
    if (!regularUser) {
      const hashedPassword = await hashPassword('regularuserpassword');
      regularUser = userRepository.create({
        name: 'Regular User',
        email: 'user@example.com',
        password: hashedPassword,
        roleId: employerRole.id,
      });
      await userRepository.save(regularUser);
      console.log('Regular user created');
    }

    // Create parking lots if they don't exist
    let parking1 = await parkingRepository.findOne({
      where: { name: 'Parking A' },
    });
    if (!parking1) {
      parking1 = parkingRepository.create({
        name: 'Parking A',
        totalSpots: 50,
        parkingId: 1,
        createdBy: adminUser.id,
        createdAt: new Date(),
      });
      await parkingRepository.save(parking1);
      console.log('Parking A created');
    }

    let parking2 = await parkingRepository.findOne({
      where: { name: 'Parking B' },
    });
    if (!parking2) {
      parking2 = parkingRepository.create({
        name: 'Parking B',
        totalSpots: 30,
        parkingId: 2,
        createdBy: adminUser.id,
        createdAt: new Date(),
      });
      await parkingRepository.save(parking2);
      console.log('Parking B created');
    }

    // Create vehicle details if they don't exist
    let vehicle1 = await vehicleDetailRepository.findOne({
      where: { licensePlate: 'ABC123' },
    });
    if (!vehicle1) {
      vehicle1 = vehicleDetailRepository.create({
        licensePlate: 'ABC123',
        brand: 'Toyota',
        model: 'Corolla',
        userId: regularUser.id,
        createdBy: regularUser.id,
        createdAt: new Date(),
      });
      await vehicleDetailRepository.save(vehicle1);
      console.log('Vehicle ABC123 created');
    }

    let vehicle2 = await vehicleDetailRepository.findOne({
      where: { licensePlate: 'XYZ789' },
    });
    if (!vehicle2) {
      vehicle2 = vehicleDetailRepository.create({
        licensePlate: 'XYZ789',
        brand: 'Honda',
        model: 'Civic',
        userId: regularUser.id,
        createdBy: regularUser.id,
        createdAt: new Date(),
      });
      await vehicleDetailRepository.save(vehicle2);
      console.log('Vehicle XYZ789 created');
    }

    // Create reservations if they don't exist
    let reservation1 = await reservationRepository.findOne({
      where: { vehicleId: vehicle1.id },
    });
    if (!reservation1) {
      reservation1 = reservationRepository.create({
        userId: regularUser.id,
        vehicleId: vehicle1.id,
        parkingId: parking1.id,
        reservationStart: new Date(),
        reservationEnd: new Date(Date.now() + 3600 * 1000), // 1 hour later
        status: ReservationStatus.RESERVED,
        createdBy: regularUser.id,
        createdAt: new Date(),
      });
      await reservationRepository.save(reservation1);
      console.log('Reservation for vehicle ABC123 created');
    }

    let reservation2 = await reservationRepository.findOne({
      where: { vehicleId: vehicle2.id },
    });
    if (!reservation2) {
      reservation2 = reservationRepository.create({
        userId: regularUser.id,
        vehicleId: vehicle2.id,
        parkingId: parking2.id,
        reservationStart: new Date(),
        reservationEnd: new Date(Date.now() + 7200 * 1000), // 2 hours later
        status: ReservationStatus.RESERVED,
        createdBy: regularUser.id,
        createdAt: new Date(),
      });
      await reservationRepository.save(reservation2);
      console.log('Reservation for vehicle XYZ789 created');
    }

    console.log('Database successfully seeded');
    await connection.close();
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
}

seedDatabase();

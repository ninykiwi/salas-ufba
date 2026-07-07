import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('AuthController & InstitutesController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let superadminToken: string;
  let adminToken: string;
  let professorToken: string;
  let instituteId: string;

  const defaultSuperadmin = {
    email: 'superadmin@ufba.br',
    password: 'SuperAdminPassword123!',
  };

  const testAdmin = {
    name: 'Admin Test',
    email: 'admin.test@ufba.br',
    password: 'AdminPassword123!',
    role: 'ADMIN',
  };

  const testProfessor = {
    name: 'Prof. Test',
    email: 'prof.test@ufba.br',
    siape: '9999999',
    password: 'Password123!',
    role: 'PROFESSOR',
  };

  const testProfessor2 = {
    name: 'Prof. Test 2',
    email: 'prof.test2@ufba.br',
    siape: '8888888',
    password: 'Password123!',
    role: 'PROFESSOR',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    
    // Clear all relations and tables
    await prisma.user.deleteMany();
    await prisma.institute.deleteMany();

    // Seed the superadmin specifically for this test run
    const hashedPassword = await bcrypt.hash(defaultSuperadmin.password, 10);
    await prisma.user.create({
      data: {
        name: 'Super Administrador',
        email: defaultSuperadmin.email,
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });

    // Obtain superadmin token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(defaultSuperadmin)
      .expect(200);
    superadminToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    // Clean up database tables
    await prisma.user.deleteMany();
    await prisma.institute.deleteMany();
    await app.close();
  });

  describe('/institutes (POST & GET)', () => {
    it('SUPERADMIN should successfully create a new institute', async () => {
      const response = await request(app.getHttpServer())
        .post('/institutes')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({ name: 'Instituto de Computação' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Instituto de Computação');
      expect(response.body.slug).toBe('instituto-de-computacao');
      
      instituteId = response.body.id;
    });

    it('ADMIN or PROFESSOR should fail to create an institute (403 Forbidden)', async () => {
      // First register a temp user without role checks temporarily or use superadmin token to create one
      const tempUserRes = await request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({
          name: 'Temp Admin',
          email: 'temp.admin@ufba.br',
          password: 'Password123!',
          role: 'ADMIN',
        })
        .expect(201);

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'temp.admin@ufba.br',
          password: 'Password123!',
        })
        .expect(200);
      const tempToken = loginRes.body.access_token;

      // Try creating institute with ADMIN token
      await request(app.getHttpServer())
        .post('/institutes')
        .set('Authorization', `Bearer ${tempToken}`)
        .send({ name: 'Instituto de Matematica' })
        .expect(403);
    });
  });

  describe('/auth/register (POST)', () => {
    it('SUPERADMIN should successfully register a new ADMIN associated with an institute', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({
          ...testAdmin,
          instituteIds: [instituteId],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testAdmin.email);
      expect(response.body.role).toBe(testAdmin.role);
      expect(response.body.institutes).toHaveLength(1);
      expect(response.body.institutes[0].id).toBe(instituteId);

      // Login as the new admin to get admin token
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testAdmin.email,
          password: testAdmin.password,
        })
        .expect(200);
      
      adminToken = loginRes.body.access_token;
      expect(loginRes.body.user.institutes).toHaveLength(1);
      expect(loginRes.body.user.institutes[0].slug).toBe('instituto-de-computacao');
    });

    it('SUPERADMIN should successfully register a new PROFESSOR with institute association', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({
          ...testProfessor,
          instituteIds: [instituteId],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testProfessor.email);
      expect(response.body.siape).toBe(testProfessor.siape);
      expect(response.body.role).toBe(testProfessor.role);
      expect(response.body.institutes).toHaveLength(1);

      // Login as the new professor to get professor token
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testProfessor.email,
          password: testProfessor.password,
        })
        .expect(200);
      professorToken = loginRes.body.access_token;
    });

    it('ADMIN should successfully register a new PROFESSOR associated with the same institute', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testProfessor2,
          instituteIds: [instituteId],
        })
        .expect(201);

      expect(response.body.email).toBe(testProfessor2.email);
      expect(response.body.role).toBe(testProfessor2.role);
      expect(response.body.institutes[0].id).toBe(instituteId);
    });

    it('ADMIN should FAIL to register a new PROFESSOR associated with an institute they do not manage (403 Forbidden)', async () => {
      // Create another institute using superadmin
      const anotherInstRes = await request(app.getHttpServer())
        .post('/institutes')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({ name: 'Instituto de Direito' })
        .expect(201);
      
      const anotherInstId = anotherInstRes.body.id;

      // Try registering a professor under anotherInstId using ADMIN token (who only manages instituteId)
      await request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Law Prof',
          email: 'law.prof@ufba.br',
          password: 'Password123!',
          siape: '6655443',
          role: 'PROFESSOR',
          instituteIds: [anotherInstId],
        })
        .expect(403);
    });

    it('ADMIN should successfully register a new user without role (should default to PROFESSOR)', async () => {
      const noRoleUser = {
        name: 'No Role User',
        email: 'norole.user@ufba.br',
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(noRoleUser)
        .expect(201);

      expect(response.body.email).toBe(noRoleUser.email);
      expect(response.body.role).toBe('PROFESSOR');
    });

    it('ADMIN should FAIL to register a new ADMIN (403 Forbidden)', async () => {
      const anotherAdmin = {
        name: 'Another Admin',
        email: 'another.admin@ufba.br',
        password: 'Password123!',
        role: 'ADMIN',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(anotherAdmin)
        .expect(403);
    });

    it('PROFESSOR should FAIL to register any user (403 Forbidden)', async () => {
      const someProf = {
        name: 'Some Prof',
        email: 'some.prof@ufba.br',
        password: 'Password123!',
        role: 'PROFESSOR',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${professorToken}`)
        .send(someProf)
        .expect(403);
    });

    it('should fail to register user with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({
          ...testProfessor,
          siape: '7777777',
        })
        .expect(409);
    });

    it('should fail to register without token (401 Unauthorized)', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testProfessor2)
        .expect(401);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with email and receive a JWT token and user details with institutes', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testProfessor.email,
          password: testProfessor.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.email).toBe(testProfessor.email);
      expect(response.body.user.institutes).toHaveLength(1);
      expect(response.body.user.institutes[0].name).toBe('Instituto de Computação');
    });
  });

  describe('/auth/me (GET)', () => {
    it('should retrieve user profile with valid JWT token including institutes', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${professorToken}`)
        .expect(200);

      expect(response.body.email).toBe(testProfessor.email);
      expect(response.body.role).toBe(testProfessor.role);
      expect(response.body.institutes).toHaveLength(1);
      expect(response.body.institutes[0].slug).toBe('instituto-de-computacao');
    });
  });

  describe('/users (GET)', () => {
    it('SUPERADMIN should list all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${superadminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // We have multiple users registered in previous tests: superadmin, testAdmin, testProfessor, testProfessor2, etc.
      expect(response.body.length).toBeGreaterThanOrEqual(3);
      expect(response.body[0]).not.toHaveProperty('password');
    });

    it('ADMIN should list users linked to the same institute', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Admin is linked to 'instituto-de-computacao'. The professors are also linked to it.
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body.every(u => u.role === 'PROFESSOR')).toBe(true); // Admins can only see professors
    });

    it('PROFESSOR should fail to list users (403 Forbidden)', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${professorToken}`)
        .expect(403);
    });
  });

  describe('/users/:id (PATCH)', () => {
    let professorUserId: string;
    let adminUserId: string;

    beforeAll(async () => {
      // Find a professor and admin to test with
      const users = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${superadminToken}`)
        .expect(200);

      const prof = users.body.find(u => u.role === 'PROFESSOR');
      const adm = users.body.find(u => u.role === 'ADMIN');
      professorUserId = prof.id;
      adminUserId = adm.id;
    });

    it('ADMIN should successfully edit a PROFESSOR in the same institute', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${professorUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Professor Editado por Admin',
        })
        .expect(200);

      expect(response.body.name).toBe('Professor Editado por Admin');
    });

    it('ADMIN should FAIL to edit a SUPERADMIN or another ADMIN', async () => {
      await request(app.getHttpServer())
        .patch(`/users/${adminUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Tentando Mudar Nome do Admin',
        })
        .expect(403);
    });

    it('ADMIN should FAIL to change role to ADMIN', async () => {
      await request(app.getHttpServer())
        .patch(`/users/${professorUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role: 'ADMIN',
        })
        .expect(403);
    });

    it('PROFESSOR should FAIL to edit any user', async () => {
      await request(app.getHttpServer())
        .patch(`/users/${professorUserId}`)
        .set('Authorization', `Bearer ${professorToken}`)
        .send({
          name: 'Prof tentou mudar',
        })
        .expect(403);
    });
  });

  describe('/users/:id (DELETE)', () => {
    let deletableProfId: string;
    let adminUserId: string;

    beforeAll(async () => {
      // Create a fresh professor to delete
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Professor Deletavel',
          email: 'deletavel@ufba.br',
          password: 'Password123!',
          role: 'PROFESSOR',
          instituteIds: [instituteId],
        })
        .expect(201);
      deletableProfId = response.body.id;

      const users = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${superadminToken}`)
        .expect(200);

      adminUserId = users.body.find(u => u.role === 'ADMIN').id;
    });

    it('PROFESSOR should FAIL to delete a user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${deletableProfId}`)
        .set('Authorization', `Bearer ${professorToken}`)
        .expect(403);
    });

    it('ADMIN should FAIL to delete another ADMIN', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${adminUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });

    it('ADMIN should successfully delete a PROFESSOR in the same institute', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${deletableProfId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });
  });
});

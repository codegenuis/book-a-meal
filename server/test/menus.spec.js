import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;

const meals = [
  {
    id: 1,
    name: 'Spaghetti with meat balls',
    description: 'Some dummy description',
    imageUrl: 'https://mydummyimgurl.com',
  },
  {
    id: 2,
    name: 'Vegetable Soup',
    description: 'Made with vegetable and palm oil',
    imageUrl: 'http://img.com/vegetable.jpg',
  },
];

const emptyMenu = {
  name: `Menu for ${(new Date()).toDateString()}`,
  meals: [],
};

const menu = {
  name: `Menu for ${(new Date()).toDateString()}`,
  meals,
};

const menuUrl = '/api/v1/menu';
const signUpUrl = '/api/v1/auth/signup';
const catererSignUpUrl = '/api/v1/caterer/auth/signup';

const admin = {
  name: 'Walter Okwa',
  email: 'waltermenu@gmail.com',
  password: '1234567890',
  confirmPassword: '1234567890',
};

const user = {
  name: 'Ann Ihe',
  email: 'annihemenu@gmail.com',
  password: '1234567890',
  confirmPassword: '1234567890',
};

let token;
let adminToken;

describe('Menu', () => {
  // Setup user(admin)
  before(async () => {
    const res = await chai.request(app).post(catererSignUpUrl)
      .send(admin);
    adminToken = res.body.token;
  });
  // Setup user(customer)
  before(async () => {
    const res = await chai.request(app).post(signUpUrl)
      .send(user);
    token = res.body.token;
  });

  // Test Setup Menu for specific day
  describe('Setup Menu', () => {
    it('should not get menu if menu is not set', async () => {
      const res = await chai.request(app).get(menuUrl)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body.error.message).to
        .equal('Menu for today have not been set');
    });
    it('should only allow admin setup menu', async () => {
      const res = await chai.request(app).post(menuUrl)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(menu);
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('success');
      expect(res.body.menu).to.be.an('object');
      expect(res.body.menu.name).to.equal(menu.name);
    });
    it('should not allow non auth admin to setup menu', async () => {
      const res = await chai.request(app).post(menuUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(menu);
      expect(res.status).to.equal(403);
      expect(res.body.error.message).to.equal('Forbidden');
    });
    it('should not setup menu without meals', async () => {
      const res = await chai.request(app).post(menuUrl)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(emptyMenu);
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.error.meals).to
        .include('No meal have been added to menu');
    });
    it('should not setup menu without a name', async () => {
      const res = await chai.request(app).post(menuUrl)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ meals });
      expect(res.status).to.equal(400);
      expect(res.body.error.name).to
        .include('Menu name is required');
    });
  });

  // Test Get Menu for specific day
  describe('Get Menu', () => {
    it('should get menu for specific day', async () => {
      const res = await chai.request(app).get(menuUrl)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('success');
      expect(res.body.menu).to.be.an('object');
    });
  });
});
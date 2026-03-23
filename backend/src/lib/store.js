import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const users = [];
const courses = [];
const enrollments = [];
const payments = [];

function seedUsers() {
  if (users.length > 0) return;

  users.push(
    {
      id: uuidv4(),
      name: "Focus Admin",
      email: "admin@focusacademy.test",
      passwordHash: bcrypt.hashSync("Admin@123", 10),
      role: "admin",
      plan: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Focus Learner",
      email: "user@focusacademy.test",
      passwordHash: bcrypt.hashSync("User@123", 10),
      role: "learner",
      plan: "physical",
      createdAt: new Date().toISOString(),
    }
  );
}

function seedCourses() {
  if (courses.length > 0) return;

  courses.push(
    {
      id: uuidv4(),
      title: "Complete Individual & Business Tax Preparation Program",
      type: "virtual",
      price: 999,
      currency: "USD",
      capacity: null,
      seatsUsed: 0,
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "US Tax Bootcamp (Kathmandu Cohort)",
      type: "physical",
      price: 1200,
      currency: "USD",
      capacity: 40,
      seatsUsed: 0,
      status: "published",
      createdAt: new Date().toISOString(),
    }
  );
}

seedUsers();
seedCourses();

export const db = {
  users,
  courses,
  enrollments,
  payments,
};

export function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

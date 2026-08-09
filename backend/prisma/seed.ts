import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const seedPassword = process.env.SEED_PASSWORD || "password123";
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.invalid";

  // --- Categories (8 total) ---
  const categoryData = [
    { name: "Plumbing", slug: "plumbing", description: "Professional plumbing services including repairs, installations, and maintenance." },
    { name: "Electrical", slug: "electrical", description: "Licensed electrical services for residential and commercial properties." },
    { name: "Cleaning", slug: "cleaning", description: "Deep cleaning, regular maintenance, and specialized cleaning services." },
    { name: "Painting", slug: "painting", description: "Interior and exterior painting services for homes and businesses." },
    { name: "HVAC", slug: "hvac", description: "Heating, ventilation, and air conditioning installation and repair." },
    { name: "Carpentry", slug: "carpentry", description: "Custom woodworking, furniture repair, and cabinetry services." },
    { name: "Landscaping", slug: "landscaping", description: "Lawn care, garden design, and outdoor maintenance services." },
    { name: "Pest Control", slug: "pest-control", description: "Professional pest inspection, treatment, and prevention services." },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created.id;
  }
  console.log("  Created 8 categories");

  // --- Users ---
  const adminPassword = await bcrypt.hash(seedPassword, 12);
  const userPassword = await bcrypt.hash(seedPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword },
    create: {
      email: adminEmail,
      password: adminPassword,
      name: "System Administrator",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // --- Customers ---
  const customerData = [
    { email: "customer1@test.com", name: "Alice Johnson", phone: "+1-555-0101", location: "123 Main St, Springfield" },
    { email: "customer2@test.com", name: "Bob Smith", phone: "+1-555-0102", location: "456 Oak Ave, Shelbyville" },
    { email: "customer3@test.com", name: "Carol White", phone: "+1-555-0103", location: "789 Pine Rd, Capital City" },
  ];

  const customers = [];
  for (const c of customerData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        password: userPassword,
        name: c.name,
        phone: c.phone,
        location: c.location,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
    });
    customers.push(user);
  }
  console.log("  Created 3 customers");

  // --- Technicians ---
  const techData = [
    { email: "tech1@test.com", name: "Dave Builder", phone: "+1-555-0201", location: "321 Elm St, Springfield" },
    { email: "tech2@test.com", name: "Eve Electrician", phone: "+1-555-0202", location: "654 Maple Dr, Shelbyville" },
    { email: "tech3@test.com", name: "Frank Fixer", phone: "+1-555-0203", location: "987 Cedar Ln, Capital City" },
  ];

  const technicians = [];
  for (const t of techData) {
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
      create: {
        email: t.email,
        password: userPassword,
        name: t.name,
        phone: t.phone,
        location: t.location,
        role: "TECHNICIAN",
        status: "ACTIVE",
      },
    });
    technicians.push(user);
  }
  console.log("  Created 3 technicians");

  // --- Technician Profiles ---
  const techProfileData = [
    { userId: technicians[0].id, bio: "Expert plumber with 10 years of experience in residential and commercial plumbing.", experienceYears: 10, skills: ["Pipe Repair", "Drain Cleaning", "Water Heater Installation", "Leak Detection"], baseHourlyRate: 75 },
    { userId: technicians[1].id, bio: "Licensed electrician specializing in home rewiring and smart home installations.", experienceYears: 8, skills: ["Wiring", "Circuit Breaker Repair", "Lighting Installation", "Smart Home"], baseHourlyRate: 85 },
    { userId: technicians[2].id, bio: "Handyman with broad skills covering carpentry, painting, and general repairs.", experienceYears: 5, skills: ["Furniture Assembly", "Drywall Repair", "Painting", "Door Installation"], baseHourlyRate: 55 },
  ];

  for (const tp of techProfileData) {
    await prisma.technicianProfile.upsert({
      where: { userId: tp.userId },
      update: {},
      create: tp,
    });
  }
  console.log("  Created 3 technician profiles");

  // --- Customer Profiles ---
  for (const c of customers) {
    await prisma.customerProfile.upsert({
      where: { userId: c.id },
      update: {},
      create: {
        userId: c.id,
        bio: `Homeowner looking for quality ${c.name.split(" ")[0]}'s services.`,
        emergencyContact: "+1-555-9999",
      },
    });
  }
  console.log("  Created 3 customer profiles");

  // --- Wallets ---
  const allUsers = [admin, ...customers, ...technicians];
  for (const u of allUsers) {
    await prisma.wallet.upsert({
      where: { userId: u.id },
      update: {},
      create: {
        userId: u.id,
        balance: u.role === "ADMIN" ? 0 : 150,
        totalEarned: 0,
        totalSpent: 0,
      },
    });
  }
  console.log("  Created 7 wallets");

  // --- Services (6 across categories) ---
  const serviceData = [
    { technicianId: technicians[0].id, categoryId: categories["plumbing"], title: "Emergency Pipe Repair", description: "Fast and reliable pipe repair service available 24/7.", price: 120 },
    { technicianId: technicians[0].id, categoryId: categories["plumbing"], title: "Drain Cleaning", description: "Professional drain cleaning to prevent clogs and backups.", price: 95 },
    { technicianId: technicians[1].id, categoryId: categories["electrical"], title: "Home Electrical Inspection", description: "Comprehensive electrical safety inspection for your home.", price: 150 },
    { technicianId: technicians[1].id, categoryId: categories["hvac"], title: "AC Tune-Up", description: "Seasonal air conditioning maintenance and tune-up.", price: 110 },
    { technicianId: technicians[2].id, categoryId: categories["painting"], title: "Interior Room Painting", description: "Professional interior painting for one room up to 200 sq ft.", price: 200 },
    { technicianId: technicians[2].id, categoryId: categories["carpentry"], title: "Furniture Assembly", description: "Expert assembly of flat-pack or custom furniture.", price: 80 },
  ];

  const services = [];
  for (const s of serviceData) {
    const existing = await prisma.service.findFirst({
      where: { title: s.title, technicianId: s.technicianId },
    });
    if (existing) {
      services.push(existing);
    } else {
      const service = await prisma.service.create({ data: s });
      services.push(service);
    }
  }
  console.log("  Created 6 services");

  // --- Bookings ---
  const bookingData = [
    { customerId: customers[0].id, technicianId: technicians[0].id, serviceId: services[0].id, scheduledAt: new Date("2026-07-20T10:00:00Z"), totalAmount: 120, status: "REQUESTED" as const },
    { customerId: customers[1].id, technicianId: technicians[0].id, serviceId: services[1].id, scheduledAt: new Date("2026-07-18T14:00:00Z"), totalAmount: 95, status: "ACCEPTED" as const },
    { customerId: customers[2].id, technicianId: technicians[1].id, serviceId: services[2].id, scheduledAt: new Date("2026-07-15T09:00:00Z"), totalAmount: 150, status: "COMPLETED" as const },
    { customerId: customers[0].id, technicianId: technicians[1].id, serviceId: services[3].id, scheduledAt: new Date("2026-07-16T11:00:00Z"), totalAmount: 110, status: "IN_PROGRESS" as const },
    { customerId: customers[1].id, technicianId: technicians[2].id, serviceId: services[4].id, scheduledAt: new Date("2026-07-14T08:00:00Z"), totalAmount: 200, status: "COMPLETED" as const },
    { customerId: customers[2].id, technicianId: technicians[2].id, serviceId: services[5].id, scheduledAt: new Date("2026-07-22T15:00:00Z"), totalAmount: 80, status: "REQUESTED" as const },
  ];

  const bookings = [];
  for (const b of bookingData) {
    const existing = await prisma.booking.findFirst({
      where: { customerId: b.customerId, serviceId: b.serviceId, scheduledAt: b.scheduledAt },
    });
    if (existing) {
      bookings.push(existing);
    } else {
      const booking = await prisma.booking.create({ data: b });
      bookings.push(booking);
    }
  }
  console.log("  Created 6 bookings");

  // --- Payments for completed/in-progress bookings ---
  for (const b of bookings) {
    if (["COMPLETED", "IN_PROGRESS", "PAID"].includes(b.status)) {
      const existing = await prisma.payment.findUnique({ where: { bookingId: b.id } });
      if (!existing) {
        await prisma.payment.create({
          data: {
            bookingId: b.id,
            transactionId: `txn_${b.id.slice(0, 8)}`,
            amount: b.totalAmount,
            status: "COMPLETED",
            paidAt: new Date(),
          },
        });
      }
    }
  }
  console.log("  Created payments for completed/in-progress bookings");

  // --- Reviews for completed bookings ---
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const reviewComments = [
    { rating: 5, comment: "Excellent work! Very professional and quick." },
    { rating: 4, comment: "Great service, would recommend to others." },
  ];

  for (let i = 0; i < completedBookings.length; i++) {
    const b = completedBookings[i];
    const existing = await prisma.review.findUnique({ where: { bookingId: b.id } });
    if (!existing) {
      const reviewData = reviewComments[i % reviewComments.length];
      await prisma.review.create({
        data: {
          bookingId: b.id,
          customerId: b.customerId,
          technicianId: b.technicianId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
      });
    }
  }
  console.log("  Created reviews for completed bookings");

  // --- Notifications ---
  const existingNotifications = await prisma.notification.count();
  if (existingNotifications === 0) {
    const notificationData = [
      { userId: customers[0].id, title: "Booking Created", message: "Your emergency pipe repair booking has been created.", type: "info" },
      { userId: customers[0].id, title: "Booking Update", message: "Your AC tune-up is now in progress.", type: "success" },
      { userId: technicians[0].id, title: "New Booking Request", message: "You have a new drain cleaning booking request.", type: "info" },
      { userId: technicians[1].id, title: "Booking Completed", message: "Your electrical inspection booking has been marked as completed.", type: "success" },
      { userId: customers[1].id, title: "Review Reminder", message: "You have a completed booking. Leave a review!", type: "warning" },
    ];

    for (const n of notificationData) {
      await prisma.notification.create({ data: n });
    }
    console.log("  Created 5 notifications");
  } else {
    console.log("  Notifications already exist, skipping");
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

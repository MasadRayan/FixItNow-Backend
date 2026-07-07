// booking.service.ts
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateBooking } from "./booking.interface";

const createBookingIntoDB = async (customerId: string, payload: ICreateBooking) => {
  const { serviceId, scheduledAt, address, notes } = payload;

  const isValidUser = await prisma.user.findUnique({
    where: { id: customerId },
  });

  if (!isValidUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (isValidUser.status === "BANNED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
  }

  if (!serviceId || !scheduledAt || !address) {
    throw new AppError(httpStatus.BAD_REQUEST, "serviceId, scheduledAt, and address are required");
  }

  const scheduledDate = new Date(scheduledAt);
  if (isNaN(scheduledDate.getTime())) {
    throw new AppError(httpStatus.BAD_REQUEST, "scheduledAt must be a valid date");
  }

  if (scheduledDate <= new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "scheduledAt must be a future date/time");
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  if (!service.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "This service is not currently active");
  }

  // Prevent a technician from "booking" their own service
  const customerProfile = await prisma.technicianProfile.findUnique({
    where: { userId: customerId },
  });
  if (customerProfile && customerProfile.id === service.technicianId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot book your own service");
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianId: service.technicianId,
      serviceId: service.id,
      scheduledAt: scheduledDate,
      address,
      notes,
      priceAtBooking: service.price,
    },
    include: {
      service: {
        include: {
            category: true
        }
      },
      technician: { 
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true
                }
            }
        }
       },
    },
  });

  return booking;
};

export const bookingService = {
  createBookingIntoDB,
};
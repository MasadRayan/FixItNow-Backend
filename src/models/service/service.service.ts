import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { ICreateService } from "./service.interface";

const createServiceIntoDB = async (userId: string, payload: ICreateService) => {
  const { category, description, durationMins, price, title } = payload;

  const createServiceTransaction = await prisma.$transaction(async (tx) => {
    const isCategoryExists = await tx.category.findFirst({
      where: {
        name: {
          equals: category,
          mode: "insensitive",
        },
      },
    });

    if (!isCategoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    const technicianProfile = await tx.technicianProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!technicianProfile) {
      throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
    }

    const categoryId = isCategoryExists.id;

    const service = await tx.service.create({
      data: {
        title,
        description,
        durationMins,
        price,
        category: {
          connect: {
            id: categoryId,
          },
        },
        technician: {
          connect: {
            userId,
          },
        },
      },
    });
    return service;
  });
  return createServiceTransaction;
};

export const serviceService = {
  createServiceIntoDB,
};
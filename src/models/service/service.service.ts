import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { ICreateService, IGetAllServiceFilters } from "./service.interface";
import { Prisma } from "../../../generated/prisma/client";
import { ServiceWhereInput } from "../../../generated/prisma/models";

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

const getAllServicesFromDB = async (query: IGetAllServiceFilters) => {
  const {
    category,
    location,
    minPrice,
    minRating,
    maxPrice,
    search,
    page,
    limit,
  } = query;
  const pageShowing = page ? Number(page) : 1;
  const limitInAPage = limit ? Number(limit) : 10;
  const skip = (pageShowing - 1) * limitInAPage;
  const andConditions: ServiceWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (category) {
    andConditions.push({
      category: {
        name: {
          contains: category,
          mode: "insensitive",
        },
      },
    });
  }

  if (location) {
    andConditions.push({
      technician: {
        location: {
          contains: location,
          mode: "insensitive",
        },
      },
    });
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    andConditions.push({
      price: {
        ...(minPrice !== undefined && { gte: Number(minPrice) }),
        ...(maxPrice !== undefined && { lte: Number(maxPrice) }),
      },
    });
  }
  if (minRating !== undefined) {
    andConditions.push({
      technician: { avgRating: { gte: Number(minRating) } },
    });
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where: {
        AND: andConditions,
      },
      include: {
        category: true,
        technician: {
          select: {
            id: true,
            bio: true,
            location: true,
            avgRating: true,
            totalReviews: true,
            user: {
              select: {
                name: true,
                avatarUrl: true,
                email: true,
              },
            },
          },
        },
        bookings: {
          select: {
            status: true,
            address: true,
            notes: true,
            priceAtBooking: true,
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      take: limitInAPage,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.service.count({
      where: {
        AND: andConditions,
      },
    }),
  ]);

  return {
    data: services,
    meta: {
      page: pageShowing,
      limit: limitInAPage,
      total,
      totalPages: Math.ceil(total / Number(limitInAPage)),
    },
  };
};

export const serviceService = {
  createServiceIntoDB,
  getAllServicesFromDB,
};

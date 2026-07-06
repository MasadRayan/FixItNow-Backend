import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateCategory, IUserFilters } from "./admin.interface";
import httpStatus from "http-status";

const createCategoryInDb = async (payload : ICreateCategory) => {
    const {name, description, iconUrl} = payload
    const normalizedName = name.trim()
    const isCategoryExists =await prisma.category.findFirst({
        where: {
            name: {
                equals: normalizedName,
                mode: "insensitive"
            }
        }
    })

    if (isCategoryExists) {
        throw new AppError(httpStatus.CONFLICT, "Category already exists")
    }

    const result = await prisma.category.create({
        data: {
            name: normalizedName,
            description,
            iconUrl
        }
    })
    return result
}

const getAllCategory = async () => {
    const result = await prisma.category.findMany({
        include: {
            services: true,
            _count: {
                select: {
                    services: true
                }
            } 
        },
        orderBy: {
            createdAt: "desc"
        },
    })
    return result
}

const getAllUsersFromDB = async (filters: IUserFilters) => {
  const { role, status, search, page = 1, limit = 10 } = filters;

  const conditions: Prisma.UserWhereInput[] = [];

  if (role) {
    conditions.push({ role });
  }

  if (status) {
    conditions.push({ status });
  }

  if (search) {
    conditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  const whereClause: Prisma.UserWhereInput =
    conditions.length > 0 ? { AND: conditions } : {};

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      include: {
        technicianProfile: {
          select: {
            id: true,
            avgRating: true,
            totalReviews: true,
            isVerified: true,
            location: true,
            
          },
        },
      },
      omit: {
        password: true,
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
    data: users,
  };
};

export const adminService = {
    createCategoryInDb,
    getAllCategory,
    getAllUsersFromDB
}
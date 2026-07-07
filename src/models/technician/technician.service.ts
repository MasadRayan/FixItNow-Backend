import { Prisma } from "../../../generated/prisma/client";
import { TechnicianProfileWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import {
  ITechnicianFilters,
  IupdateTechnicianProfile,
} from "./technician.interface";
import httpStatus from "http-status";

const updateTEchnicianProfileINDB = async (
  userId: string,
  payload: IupdateTechnicianProfile,
) => {
  const {
    name,
    phone,
    address,
    avatarUrl,
    skills,
    hourlyRate,
    bio,
    experienceYrs,
    location,
  } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (isUserExists.status === "BANNED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      phone,
      address,
      avatarUrl,
      technicianProfile: {
        update: {
          skills,
          hourlyRate,
          bio,
          experienceYrs,
          location,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      technicianProfile: true,
    },
  });
  return updatedUser;
};

const getAllTechniciansFromDB = async (query: ITechnicianFilters) => {
  const {
    category,
    limit = 10,
    location,
    minExperience,
    minRating,
    page = 1,
    search,
    skill,
  } = query;
  const andCondition: TechnicianProfileWhereInput[] = [];
  const skip = (Number(page) - 1) * Number(limit);

  if (location) {
    andCondition.push({
      location: {
        contains: location,
        mode: "insensitive",
      },
    });
  }

  if (skill) {
    andCondition.push({
      skills: {
        has: skill,
      },
    });
  }

  if (minExperience !== undefined) {
    andCondition.push({
      experienceYrs: {
        gte: Number(minExperience),
      },
    });
  }

  if (minRating !== undefined) {
    andCondition.push({
      avgRating: {
        gte: Number(minRating),
      },
    });
  }

  if (search) {
    andCondition.push({
      OR: [
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          bio: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  andCondition.push({
    isVerified: true,
  });

  if (category) {
    andCondition.push({
      services: {
        some: {
          category: {
            name: {
              equals: category,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  const [technician, total] = await Promise.all([
    prisma.technicianProfile.findMany({
      where: {
        AND: andCondition,
      },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
            address: true,
          },
        },
        services: true,
        reviews: true,
        _count: {
          select: {
            services: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        avgRating: "desc",
      },
      take: Number(limit),
      skip,
    }),

    prisma.technicianProfile.count({
      where: {
        AND: andCondition,
      },
    }),
  ]);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
    data: technician,
  };
};

export const technicianService = {
  updateTEchnicianProfileINDB,
  getAllTechniciansFromDB,
};

import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateCategory } from "./admin.interface";
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

export const adminService = {
    createCategoryInDb,
    getAllCategory
}
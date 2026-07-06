import { th } from "zod/v4/locales/index.js";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { IupdateTechnicianProfile } from "./technician.interface";
import httpStatus from "http-status";

const updateTEchnicianProfileINDB = async (userId: string, payload: IupdateTechnicianProfile) => {
    const {name, phone, address, avatarUrl, skills, hourlyRate, bio, experienceYrs, location} = payload
    const isUserExists = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    if (isUserExists.status === "BANNED") {
        throw new AppError(httpStatus.FORBIDDEN, "User is blocked")
    }
    const updatedUser = await prisma.user.update({
        where: {
            id: userId
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
                    location
                }
            }
        },
        omit: {
            password: true
        },
        include: {
            technicianProfile: true
        }
    })
    return updatedUser
}


export const  technicianService = {
    updateTEchnicianProfileINDB
}
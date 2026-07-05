import { prisma } from "../../lib/prisma";
import { ICreateUser } from "./auth.interface";

const createUserIntoDB = async (payload: ICreateUser) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    })

    if (isUserExists) {
        throw new Error("User already exists")
    }

    //bcrypt the pass
    //validate is the email is a valid
    //restrict roles to only customer and technician
}


export const authService = {
    createUserIntoDB
}
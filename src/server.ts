import app from "./app";

const main = async () => {
    try {
        app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
    } catch (error: any) {
        console.log("Error Starting in the serevr" , error);
        process.exit(1);
    }
}

main()
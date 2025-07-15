export const healthcheck = async () => {
    return {
        status: "ok",
        message: "Health check passed, server up and running",
        timestamp: new Date().toISOString(),
    };
}

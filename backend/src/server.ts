import app from "./app.ts";
import { logger } from "./utils/logger.ts";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
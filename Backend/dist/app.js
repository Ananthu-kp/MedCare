"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const userRoute_1 = __importDefault(require("./Routes/userRoute"));
const adminRoute_1 = __importDefault(require("./Routes/adminRoute"));
const doctorRoute_1 = __importDefault(require("./Routes/doctorRoute"));
const dbConnect_1 = __importDefault(require("./Config/dbConnect"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = require("./Middleware/errorHandler");
(0, dbConnect_1.default)();
app.use((0, morgan_1.default)(':method :url :status :response-time ms'));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("Public"));
app.use('/Public', express_1.default.static(path_1.default.join(__dirname, 'Public')));
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: 'GET, POST, PUT, DELETE, PATCH',
    credentials: true
}));
app.use('/', userRoute_1.default);
app.use('/admin', adminRoute_1.default);
app.use('/doctor', doctorRoute_1.default);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is Running on: http://localhost:${PORT}`));

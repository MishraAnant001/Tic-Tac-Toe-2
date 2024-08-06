"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
exports.dashboardRouter = (0, express_1.Router)();
const controller = new controllers_1.DashboardController();
exports.dashboardRouter.get("/admin", middlewares_1.authenticate, (0, middlewares_1.authorize)(['admin']), controller.getAdminDashboard);

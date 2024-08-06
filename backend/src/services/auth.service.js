"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateSocialUser = void 0;
const models_1 = require("../models");
const findOrCreateSocialUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield models_1.User.findOne({ socialLoginId: payload.socialLoginId, socialLoginProvider: payload.socialLoginProvider });
    if (!user) {
        user = new models_1.User({
            name: payload.name,
            email: payload.email,
            socialLoginId: payload.socialLoginId,
            socialLoginProvider: payload.socialLoginProvider,
            role: 'user',
        });
        yield user.save();
    }
    return user;
});
exports.findOrCreateSocialUser = findOrCreateSocialUser;

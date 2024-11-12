"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.solveCaptcha = solveCaptcha;
const TwoCaptcha = __importStar(require("2captcha"));
// API Key từ 2Captcha
const API_KEY = "ebdb5a6bf76da6887db60ef2041ab946|964635241a3e5e76980f2572e5f63452|http://back10.keycaptcha.com/swfs/ckc/5bded85426de3c57a7529a84bd0d4d08-|9ff29e0176e78eb7ba59314f92dbac1b|1";
const solver = new TwoCaptcha.Solver(API_KEY);
function solveCaptcha(page) {
    return __awaiter(this, void 0, void 0, function* () {
        // Lấy sitekey từ trang (sitekey là thông tin cần để giải reCAPTCHA)
        const siteKey = yield page.evaluate(() => {
            var _a;
            return (_a = document.querySelector(".g-recaptcha")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-sitekey");
        });
        if (!siteKey) {
            console.log("Không tìm thấy reCAPTCHA sitekey");
            return;
        }
        // Lấy URL của trang chứa CAPTCHA
        const url = page.url();
        try {
            // Gửi yêu cầu giải CAPTCHA cho 2Captcha API
            const res = yield solver.recaptcha(siteKey, url);
            // Nhận giải pháp và đưa vào input g-recaptcha-response
            const captchaResponse = res.data;
            // Điền vào trường 'g-recaptcha-response' với token đã giải
            yield page.fill('textarea[name="g-recaptcha-response"]', captchaResponse);
            console.log("Captcha solved successfully");
        }
        catch (error) {
            console.error("Error solving captcha:", error);
        }
    });
}

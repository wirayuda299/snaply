"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserCountry {
    static async getUserCountry() {
        try {
            const userIpAddress = await fetch('https://api.ipify.org/?format=json');
            // @ts-ignore
            const { ip } = await userIpAddress.json();
            const userCountry = await fetch(`https://ipapi.co/${ip}/json/`);
            return await userCountry.json();
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = UserCountry;
//# sourceMappingURL=userCountry.js.map
import Module from "../../module";
import hooks from "../../../hooks";
import stores from "../../../utils/stores";
import moduleManager from "../../moduleManager";

export default class FreeCoupons extends Module {
    constructor() {
        super("FreeCoupons", "Misc");
        
    }

    onEnable() {
        fetch("https://api.vectaria.io/v2/users/getAdCoupons", {
            "credentials": "include"
        }).then(response => {
            if (!response.ok) {
                alert("Reached Daily limit");
            } else {
                stores.userStore.user.coupons += 10;
            }
        })
        moduleManager.modules["FreeCoupons"].disable();
    }
}
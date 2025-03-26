import Module from "../../module";
import hooks from "../../../hooks";
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
                hooks.stores.user.user.coupons += 10;
            }
        })
        moduleManager.modules["FreeCoupons"].disable();
    }
}
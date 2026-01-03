import Module from "../../Module";
import hooks from "../../../hooks";

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
                hooks.stores.get("user").user.coupons += 10;
            }
        })

        this.disable();
    }
}
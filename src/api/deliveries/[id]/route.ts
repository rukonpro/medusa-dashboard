import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import DeliveryModuleService from "../../../modules/delivery/service";
import {DELIVERY_MODULE} from "../../../modules/delivery";


export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const deliveryModuleService: DeliveryModuleService =
        req.scope.resolve(DELIVERY_MODULE)

    const delivery = await deliveryModuleService.retrieveDelivery(
        req.params.id
    )

    res.json({
        delivery,
    })
}
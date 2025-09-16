import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { DeliveryStatus } from "../../../../modules/delivery/types"
import {
    awaitDeliveryStepId,
} from "../../../../workflows/delivery/steps/await-delivery"
import {updateDeliveryWorkflow} from "../../../../workflows/delivery/steps/update-delivery";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const { id } = req.params

    const data = {
        id,
        delivery_status: DeliveryStatus.DELIVERED,
        delivered_at: new Date(),
    }

    const updatedDelivery = await updateDeliveryWorkflow(req.scope)
        .run({
            input: {
                data,
                stepIdToSucceed: awaitDeliveryStepId,
            },
        })
        .catch((error) => {
            return MedusaError.Types.UNEXPECTED_STATE
        })

    return res.status(200).json({ delivery: updatedDelivery })
}
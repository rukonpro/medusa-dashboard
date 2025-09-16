import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { DeliveryStatus } from "../../../../modules/delivery/types"
import {
    awaitPreparationStepId,
} from "../../../../workflows/delivery/steps/await-preparation"
import {updateDeliveryWorkflow} from "../../../../workflows/delivery/steps/update-delivery";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const { id } = req.params

    const data = {
        id,
        delivery_status: DeliveryStatus.READY_FOR_PICKUP,
    }

    const updatedDelivery = await updateDeliveryWorkflow(req.scope)
        .run({
            input: {
                data,
                stepIdToSucceed: awaitPreparationStepId,
            },
        })
        .catch((error) => {
            console.log(error)
            return MedusaError.Types.UNEXPECTED_STATE
        })

    return res.status(200).json({ delivery: updatedDelivery })
}
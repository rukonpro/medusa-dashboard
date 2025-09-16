import {createStep, createWorkflow, StepResponse, when, WorkflowResponse} from "@medusajs/framework/workflows-sdk"
import { DELIVERY_MODULE } from "../../../modules/delivery"
import { UpdateDelivery } from "../../../modules/delivery/types"
import DeliveryModuleService from "../../../modules/delivery/service"
import {setStepSuccessStep} from "./set-step-success";
import {setStepFailedStep} from "./set-step-failed";

type UpdateDeliveryStepInput = {
    data: UpdateDelivery;
};
export type WorkflowInput = {

    data: UpdateDelivery;

    stepIdToSucceed?: string;

    stepIdToFail?: string;

};
export const updateDeliveryStep = createStep(
    "update-delivery-step",
    async function ({ data }: UpdateDeliveryStepInput, { container }) {
        const deliveryModuleService: DeliveryModuleService =
            container.resolve(DELIVERY_MODULE)

        const prevDeliveryData = await deliveryModuleService.retrieveDelivery(data.id)

        const delivery = await deliveryModuleService
            .updateDeliveries([data])
            .then((res) => res[0])

        return new StepResponse(delivery, {
            prevDeliveryData,
        })
    },
    async ({ prevDeliveryData }, { container }) => {
        const deliverModuleService: DeliveryModuleService =
            container.resolve(DELIVERY_MODULE)

        const {
            driver,
            ...prevDeliveryDataWithoutDriver
        } = prevDeliveryData

        await deliverModuleService.updateDeliveries(prevDeliveryDataWithoutDriver)
    }
)



export const updateDeliveryWorkflow = createWorkflow(

    "update-delivery-workflow",

    function (input: WorkflowInput) {

        // Update the delivery with the provided data

        const updatedDelivery = updateDeliveryStep({

            data: input.data,

        })


        // If a stepIdToSucceed is provided, we will set that step as successful

        when(input, ({ stepIdToSucceed }) => stepIdToSucceed !== undefined)

            .then(() => {

                setStepSuccessStep({

                    stepId: input.stepIdToSucceed,

                    updatedDelivery,

                })

            })


        // If a stepIdToFail is provided, we will set that step as failed

        when(input, ({ stepIdToFail }) => stepIdToFail !== undefined)

            .then(() => {

                setStepFailedStep({

                    stepId: input.stepIdToFail,

                    updatedDelivery,

                })

            })


        // Return the updated delivery

        return new WorkflowResponse(updatedDelivery)

    }

)
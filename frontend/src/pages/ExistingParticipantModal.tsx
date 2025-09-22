import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    ModalProps,
    useToast
} from "@chakra-ui/react";
import {Form, Formik} from "formik";
import {InputControl, SubmitButton} from "formik-chakra-ui";
import {useTravel} from "../provider/TravelProvider.tsx";
import {object, string} from "yup";

export type ExistingParticipantModalProps = Omit<ModalProps, "children">;

type ParticipantModalFormValues = {
    name: string;

};

const initialValues: ParticipantModalFormValues = {
    name: "",
};

const validationSchema = object({
    name: string().required("Name is required"),
});

export const ExistingParticipantModal = ({isOpen, onClose}: ExistingParticipantModalProps) => {
    const toast = useToast();

    const {selectedTravel} = useTravel();


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <Formik<ParticipantModalFormValues>
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values) => {

                    const httpRes = await fetch(`/api/participants/${selectedTravel}/${values.name}`, {
                        method: "POST",

                    });

                    if (httpRes.status === 404) {
                        toast({
                            title: "Error",
                            description: "This Participant does not exist",
                            status: "error",
                            duration: 3000,
                            isClosable: true
                        });
                        return;
                    } else if (httpRes.status === 400) {
                        toast({
                            title: "Error",
                            description: "This Participant already exist in this Travel",
                            status: "error",
                            duration: 3000,
                            isClosable: true
                        });
                        return;
                    } else if (!httpRes.ok) {
                        const res = await httpRes.json();
                        console.log(res.error);
                        return;
                    } else {
                        toast({
                            title: "success",
                            description: "Participant was added to the travel",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        });
                        onClose();
                    }
                }}
            >
                <Form>
                    <ModalContent>
                        <ModalHeader>Existing Participant</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <InputControl name="name" label="Name"/>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <SubmitButton>Submit</SubmitButton>
                        </ModalFooter>
                    </ModalContent>
                </Form>
            </Formik>
        </Modal>
    );
};

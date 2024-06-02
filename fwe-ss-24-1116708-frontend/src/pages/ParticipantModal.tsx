import {
    Button, FormLabel,
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
import React, {useState} from "react";
import {Participant} from "./TravelDetailsPage.tsx"

export type ParticipantModalProps = Omit<ModalProps, "children"> & {
    participant: Participant | null;
};

export type ParticipantModalFormValues = {
    id?: string;
    name: string;
    image: File | null;
};

const initialValues: ParticipantModalFormValues = {
    name: "",
    image: null
};

export const validationSchema = object({
    name: string().required("Name is required"),
});

export const ParticipantModal = ({isOpen, onClose, participant}: ParticipantModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const toast = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const {selectedTravel} = useTravel();

    // Set initial form values if editing an existing participant
    const getInitialValues = () => {
        if (participant) {
            return {
                name: participant.name,
                image: null
            };
        }
        return initialValues;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <Formik<ParticipantModalFormValues>
                initialValues={getInitialValues()}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    let formData: FormData | string;
                    let headers: HeadersInit | undefined;

                    if (participant) {
                        // Updating an existing participant
                        if (file) {
                            // If a new file is uploaded
                            formData = new FormData();
                            formData.append("name", values.name);
                            formData.append("image", file);
                        } else {
                            // If no new file is uploaded, send JSON
                            formData = JSON.stringify({ name: values.name });
                            headers = {
                                'Content-Type': 'application/json'
                            };
                        }
                    } else {
                        // Creating a new participant
                        if (!file) {
                            toast({
                                title: "Error",
                                description: "Please add an Image",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                            });
                            return
                        }
                        formData = new FormData();
                        formData.append("name", values.name);
                        formData.append("image", file);

                    }

                    const url = participant ? `/api/participants/${participant.id}` : `/api/participants/${selectedTravel}`;
                    const method = participant ? "PUT" : "POST";

                    const httpRes = await fetch(url, {
                        method: method,
                        headers: headers,
                        body: formData
                    });

                    if (httpRes.status === 400) {
                        toast({
                            title: "Error",
                            description: "This Name already exists",
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
                            title: participant ? "Participant updated." : "Participant added.",
                            description: participant ? "The participant has been updated successfully." : "The participant has been added successfully.",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        });
                        onClose();
                        setFile(null);
                    }
                }}
            >
                <Form>
                    <ModalContent>
                        <ModalHeader>{participant ? "Edit Participant" : "New Participant"}</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <InputControl name="name" label="Name"/>
                            <FormLabel htmlFor="image">Image</FormLabel>
                            <input type="file" name="image" onChange={handleFileChange}/>
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

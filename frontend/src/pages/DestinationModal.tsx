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
import React, {useState} from "react";
import {validationSchema} from "./TravelModal.tsx";
import "react-datepicker/dist/react-datepicker.css";
import {Destination} from "./TravelDetailsPage.tsx";
import {formatDate} from "./TravelPage.tsx";

export type DestinationModalProps = Omit<ModalProps, "children"> & {
    destination: Destination | null;
};

export type DestinationModalFormValues = {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    image: File | null;
};

const initialValues: DestinationModalFormValues = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    image: null
};
export const DestinationModal = ({isOpen, onClose, destination}: DestinationModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const toast = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };
    const {selectedTravel} = useTravel();

    const getInitialValues = () => {
        if (destination) {
            return {
                name: destination.name,
                description: destination.description,
                startDate: formatDate(destination.startDate),
                endDate: formatDate(destination.endDate),
                image: null
            };
        }
        return initialValues;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>

            <Formik<DestinationModalFormValues>
                initialValues={getInitialValues()}
                validationSchema={validationSchema}
                onSubmit={async (values) => {

                    let formData: FormData | string;
                    let headers: HeadersInit | undefined;

                    if (destination) {
                        // Updating an existing Destination
                        if (file) {
                            // If a new file is uploaded
                            formData = new FormData();
                            formData.append("name", values.name);
                            formData.append("description", values.description);
                            formData.append("startDate", values.startDate);
                            formData.append("endDate", values.endDate);
                            formData.append("image", file);
                        } else {
                            // If no new file is uploaded, send JSON
                            formData = JSON.stringify({
                                name: values.name,
                                description: values.description,
                                startDate: values.startDate,
                                endDate: values.endDate
                            });
                            headers = {
                                'Content-Type': 'application/json'
                            };
                        }
                    } else {
                        // Creating a new Destination
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
                        formData.append("description", values.description);
                        formData.append("startDate", values.startDate);
                        formData.append("endDate", values.endDate);
                        formData.append("image", file);

                    }

                    const url = destination ? `/api/destinations/${destination.id}` : `/api/destinations/${selectedTravel}`;
                    const method = destination ? "PUT" : "POST";

                    const httpRes = await fetch(url, {
                        method: method,
                        headers: headers,
                        body: formData
                    });

                    if (!httpRes.ok) {
                        const res = await httpRes.json();
                        console.log(res.error);
                    } else {
                        toast({
                            title: destination ? "Destination updated." : "Destination added.",
                            description: destination ? "The destination has been updated successfully." : "The destination has been added successfully.",
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
                        <ModalHeader>{destination ? "Edit Destination" : "New Destination"}</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <InputControl name="name" label="Name"/>
                            <InputControl name="description" label="Description"/>
                            <InputControl name="startDate" label="Start Date" inputProps={{type: 'date'}}/>
                            <InputControl name="endDate" label="End Date" inputProps={{type: 'date'}}/>
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

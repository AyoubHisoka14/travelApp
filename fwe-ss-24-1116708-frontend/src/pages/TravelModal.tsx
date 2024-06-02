import React, {useState} from 'react';
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
    FormLabel,
    useToast
} from "@chakra-ui/react";
import {Form, Formik} from "formik";
import {InputControl, SubmitButton} from "formik-chakra-ui";
import {date, object, string} from "yup";
import {Travel} from "./TravelDetailsPage.tsx";
import {formatDate} from "./TravelPage.tsx";

export type TravelModalProps = Omit<ModalProps, "children">& {
    travel: Travel | null;
};

export type TravelModalFormValues = {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    image: File | null;
};

const initialValues: TravelModalFormValues = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    image: null
};

// Validation schema using Yup
export const validationSchema = object({
    name: string().required("Name is required"),
    description: string().required("Description is required"),
    startDate: date().required("Start date is required"),
    endDate: date().required("End date is required"),

});

export const TravelModal = ({isOpen, onClose, travel}: TravelModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const toast = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const getInitialValues = () => {
        if (travel) {
            return {
                name: travel.name,
                description: travel.description,
                startDate: formatDate(travel.startDate),
                endDate: formatDate(travel.endDate),
                image: null
            };
        }
        return initialValues;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <Formik<TravelModalFormValues>
                initialValues={getInitialValues()}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    let formData: FormData | string;
                    let headers: HeadersInit | undefined;

                    if (travel) {
                        // Updating an existing Travel
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

                    const url = travel ? `/api/travels/${travel.id}` : `/api/travels`;
                    const method = travel ? "PUT" : "POST";
                    console.log(url);

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
                            title: travel ? "Travel updated." : "Travel added.",
                            description: travel ? "The travel has been updated successfully." : "The travel has been added successfully.",
                            status: "success",
                            duration: 2000,
                            isClosable: true,
                        });
                        onClose();
                        setFile(null);
                    }
                }}
            >
                <Form>
                    <ModalContent>
                        <ModalHeader>{travel ? "Edit Travel" : "New Travel"}</ModalHeader>
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

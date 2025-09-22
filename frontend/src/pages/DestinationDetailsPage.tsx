import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {BaseLayout} from "../layout/BaseLayout.tsx";
import {
    Box,
    Text,
    Image,
    Heading,
    Flex,
    Button,
    Center,
    SimpleGrid,
    useDisclosure
} from "@chakra-ui/react";

import {formatDate} from "./TravelPage.tsx";
import {DestinationModal} from "./DestinationModal.tsx";
import {useDestination} from "../provider/DestinationProvider.tsx";
import {Destination, onDeleteDestination} from "./TravelDetailsPage.tsx";


export const DestinationDetailsPage = () => {
    const {selectedDestination, resetSelectedDestination} = useDestination();
    const [destinationDetail, setDestinationDetail] = useState<Destination | null>(null);
    const navigate = useNavigate();
    const disclosure = useDisclosure();

    const fetchDestinationDetail = async () => {
        try {
            const res = await fetch(`/api/destinations/${selectedDestination}`);
            const data = await res.json();
            setDestinationDetail(data);
        } catch (error) {
            console.error("Failed to load travel details:", error);
        }
    };

    useEffect(() => {
        if (!selectedDestination) {
            navigate('/destinations');
            return;
        }
        fetchDestinationDetail();
    }, [selectedDestination, navigate, resetSelectedDestination]);

    if (!destinationDetail) {
        navigate('/destinations');
        return;
    }


    const handleDeleteDestination = async (id: string) => {
        await onDeleteDestination(id);
        navigate('/destinations')
    };


    return (
        <BaseLayout>
            <Box p={4}>
                <Center>
                    <Box
                        key={destinationDetail.id}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        p={5}
                        _hover={{shadow: 'md'}}
                        bg="white"
                        width={1000}
                    >
                        <Center>
                            <Image
                                src={`http://localhost:3000${destinationDetail.image}`}
                                alt={destinationDetail.name}
                                borderRadius="md"
                                mb={4}
                            />
                        </Center>
                        <Box>
                            <Text fontWeight="bold" fontSize="xl">
                                {destinationDetail.name}
                            </Text>
                            <Text mt={2}>{destinationDetail.description}</Text>
                            <Text mt={2}>Start Date: {formatDate(destinationDetail.startDate)}</Text>
                            <Text mt={2}>End Date: {formatDate(destinationDetail.endDate)}</Text>
                            <Flex justify="space-between" mt={4}>
                                <Button colorScheme="blue" width="48%" onClick={disclosure.onOpen}
                                        mr={2}>Edit</Button>
                                <Button colorScheme="red" width="48%"
                                        onClick={() => handleDeleteDestination(destinationDetail.id)}>Delete</Button>
                            </Flex>
                        </Box>
                    </Box>
                    <DestinationModal
                        isOpen={disclosure.isOpen}
                        onClose={() => {
                            fetchDestinationDetail()
                            disclosure.onClose();
                        }}
                        destination={destinationDetail}
                    />
                </Center>

                <Heading as="h2" size="lg" mt={8} mb={4}>
                    Travels
                </Heading>
                <Box mt={4} mb={4}>

                </Box>
                <SimpleGrid columns={[1, 2, 3]} spacing={10} mt={4}>

                    <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        p={5}
                        _hover={{shadow: 'md'}}
                        bg="white"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                    >

                        <Box flex="1">
                            <Center>
                                <Image
                                    src={`http://localhost:3000${destinationDetail.travel.image}`}
                                    alt={destinationDetail.travel.name}
                                    borderRadius="md"
                                    mb={4}
                                />
                            </Center>
                        </Box>
                        <Box>
                            <Text fontWeight="bold" fontSize="xl">
                                {destinationDetail.travel.name}
                            </Text>
                            <Text mt={2}>{destinationDetail.travel.description}</Text>
                            <Text mt={2}>Start Date: {formatDate(destinationDetail.travel.startDate)}</Text>
                            <Text mt={2}>End Date: {formatDate(destinationDetail.travel.endDate)}</Text>

                        </Box>
                    </Box>

                </SimpleGrid>


            </Box>
        </BaseLayout>
    );
};


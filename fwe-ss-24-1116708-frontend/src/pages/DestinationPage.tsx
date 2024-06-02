import {useCallback, useEffect, useState} from "react";
import {
    Box,
    Image,
    Text,
    Button,
    SimpleGrid,
    Flex, Center,
} from "@chakra-ui/react";
import {BaseLayout} from "../layout/BaseLayout.tsx";
import {useNavigate} from "react-router-dom";
import {Destination, onDeleteDestination,} from "./TravelDetailsPage.tsx";
import {useDestination} from "../provider/DestinationProvider.tsx";
import {formatDate} from "./TravelPage.tsx";


export const DestinationPage = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const {setSelectedParticipant} = useDestination();
    const navigate = useNavigate();

    const loadDestinations = useCallback(async () => {
        try {
            const httpRes = await fetch("/api/destinations", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const res = await httpRes.json();
            setDestinations(res);
        } catch (error) {
            console.error("Failed to load travels:", error);
            setDestinations([]);
        }
    }, []);

    useEffect(() => {
        loadDestinations();
    }, [loadDestinations]);

    const onViewDestinations = (entry: Destination) => {
        setSelectedParticipant(entry.id);
        navigate('/destinationDetail');
    };

    const handleDeleteDestination = async (destination: Destination) => {
        await onDeleteDestination(destination.id);
        loadDestinations();
    };

    return (
        <BaseLayout>
            <SimpleGrid columns={[1, 2, 3]} spacing={10} mt={12}>
                {destinations.map((entry) => (
                    <Box
                        key={entry.id}
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
                        <Box
                            onClick={() => onViewDestinations(entry)}
                            cursor="pointer"
                            flex="1"
                        >
                            <Center>
                                <Image
                                    src={`http://localhost:3000${entry.image}`}
                                    alt={entry.name}
                                    borderRadius="md"
                                    mb={4}
                                />
                            </Center>
                        </Box>
                        <Box>
                            <Text fontWeight="bold" fontSize="xl">
                                {entry.name}
                            </Text>
                            <Text mt={2}>{entry.description}</Text>
                            <Text mt={2}>Start Date: {formatDate(entry.startDate)}</Text>
                            <Text mt={2}>End Date: {formatDate(entry.endDate)}</Text>
                        </Box>
                        <Flex justify="center" mt={4}>
                            <Button colorScheme="red" width="90%"
                                    onClick={() => handleDeleteDestination(entry)}>Delete
                            </Button>
                        </Flex>
                    </Box>
                ))}
            </SimpleGrid>
        </BaseLayout>
    );
};

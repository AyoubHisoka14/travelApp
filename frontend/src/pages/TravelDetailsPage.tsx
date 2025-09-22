import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTravel} from "../provider/TravelProvider.tsx";
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
import {ParticipantModal} from "./ParticipantModal.tsx";
import {TravelModal} from "./TravelModal.tsx";
import {ExistingParticipantModal} from "./ExistingParticipantModal.tsx";

export interface Travel {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    image: string,
    travelDestinations: Destination[];
    participants: Participant[];
}

export interface Destination {
    id: string;
    name: string;
    description: string;
    startDate: string;
    image: string,
    endDate: string;
    travel: Travel
}

export interface Participant {
    id: string;
    name: string;
    image: string;
    travels: Travel[]
}

export const onDeleteDestination = async (id: string) => {
    try {
        const httpRes = await fetch(`/api/destinations/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        await httpRes.json();
    } catch (error) {
        console.error("Failed to delete destination:", error);
    }
}

export const onDeleteTravel = async (id: string) => {
    try {
        const httpRes = await fetch(`/api/travels/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        await httpRes.json();
    } catch (error) {
        console.error("Failed to delete travel:", error);
    }
}

export const onDeleteParticipant = async (id: string) => {
    try {
        const httpRes = await fetch(`/api/participants/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        await httpRes.json();
    } catch (error) {
        console.error("Failed to delete participant:", error);
    }
}

const TravelDetailsPage = () => {
    const {selectedTravel, resetSelectedTravel} = useTravel();
    const [travelDetail, setTravelDetail] = useState<Travel | null>(null);
    const navigate = useNavigate();
    const disclosureDestination = useDisclosure();
    const disclosureParticipant = useDisclosure();
    const disclosureExistingParticipant = useDisclosure();
    const disclosureTravel = useDisclosure();
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

    const fetchTravelDetail = async () => {
        try {
            const res = await fetch(`/api/travels/${selectedTravel}`);
            const data = await res.json();
            setTravelDetail(data);
        } catch (error) {
            console.error("Failed to load travel details:", error);
        }
    };

    useEffect(() => {
        if (!selectedTravel) {
            navigate('/'); // Redirect to travels page if no travel is selected
            return;
        }
        fetchTravelDetail();
    }, [selectedTravel, navigate, resetSelectedTravel]);

    if (!travelDetail) {
        navigate('/');
        return;
    }

    const handleDeleteTravel = async () => {
        await onDeleteTravel(travelDetail.id);
        navigate('/');
    };

    const handleDeleteDestination = async (id: string) => {
        await onDeleteDestination(id);
        fetchTravelDetail();
    };

    const handleDeleteParticipant = async (id: string) => {
        await onDeleteParticipant(id);
        fetchTravelDetail();
    };

    const handleEditParticipant = (participant: Participant) => {
        setSelectedParticipant(participant);
        disclosureParticipant.onOpen();
    };

    const handleEditDestination = (destination: Destination) => {
        setSelectedDestination(destination);
        disclosureDestination.onOpen();
    };

    return (
        <BaseLayout>
            <Box p={4}>
                <Center>
                    <Box
                        key={travelDetail.id}
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
                                src={`http://localhost:3000${travelDetail.image}`}
                                alt={travelDetail.name}
                                borderRadius="md"
                                mb={4}
                            />
                        </Center>
                        <Box>
                            <Text fontWeight="bold" fontSize="xl">
                                {travelDetail.name}
                            </Text>
                            <Text mt={2}>{travelDetail.description}</Text>
                            <Text mt={2}>Start Date: {formatDate(travelDetail.startDate)}</Text>
                            <Text mt={2}>End Date: {formatDate(travelDetail.endDate)}</Text>
                            <Flex justify="space-between" mt={4}>
                                <Button colorScheme="blue" width="48%" onClick={disclosureTravel.onOpen}
                                        mr={2}>Edit</Button>
                                <Button colorScheme="red" width="48%" onClick={handleDeleteTravel}>Delete</Button>
                            </Flex>
                        </Box>
                    </Box>
                    <TravelModal
                        isOpen={disclosureTravel.isOpen}
                        onClose={() => {
                            fetchTravelDetail()
                            disclosureTravel.onClose();
                        }}
                        travel={travelDetail}
                    />
                </Center>

                <Heading as="h2" size="lg" mt={8} mb={4}>
                    Destinations
                </Heading>
                <Box mt={4} mb={4}>
                    <Center>
                        <Button bg="white" width="50%" onClick={disclosureDestination.onOpen}>Add New
                            Destination</Button>
                    </Center>
                    <DestinationModal
                        isOpen={disclosureDestination.isOpen}
                        onClose={() => {
                            disclosureDestination.onClose();
                            fetchTravelDetail();
                            setSelectedDestination(null)
                        }}
                        destination={selectedDestination}
                    />
                </Box>
                <SimpleGrid columns={[1, 2, 3]} spacing={10} mt={4}>
                    {travelDetail.travelDestinations.map((entry) => (
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
                            <Box flex="1">
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
                                <Flex justify="space-between" mt={4}>
                                    <Button colorScheme="blue" width="48%" onClick={() => {
                                        handleEditDestination(entry)
                                    }} mr={2}>Edit
                                    </Button>
                                    <Button colorScheme="red" width="48%"
                                            onClick={() => handleDeleteDestination(entry.id)}>Delete
                                    </Button>
                                </Flex>
                            </Box>
                        </Box>
                    ))}
                </SimpleGrid>

                <Heading as="h2" size="lg" mt={4}>
                    Participants
                </Heading>
                <Box mt={4} mb={4}>
                    <Center>
                        <Flex width="80%" justifyContent="center" gap={4}>
                            <Button bg="white" width="50%" onClick={disclosureParticipant.onOpen}>
                                Add New Participant
                            </Button>
                            <Button bg="white" width="50%" onClick={disclosureExistingParticipant.onOpen}>
                                Add Existing Participant
                            </Button>
                        </Flex>
                    </Center>

                    <ParticipantModal
                        isOpen={disclosureParticipant.isOpen}
                        onClose={() => {
                            disclosureParticipant.onClose();
                            fetchTravelDetail();
                            setSelectedParticipant(null);
                        }}
                        participant={selectedParticipant}
                    />
                    <ExistingParticipantModal
                        isOpen={disclosureExistingParticipant.isOpen}
                        onClose={() => {
                            disclosureExistingParticipant.onClose();
                            fetchTravelDetail();
                        }}

                    />
                </Box>
                <SimpleGrid columns={[1, 2, 3]} spacing={10} mt={4}>
                    {travelDetail.participants.map((entry) => (
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
                            <Box flex="1">
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
                                <Flex justify="space-between" mt={4}>
                                    <Button colorScheme="blue" width="48%" onClick={() => {
                                        handleEditParticipant(entry)
                                    }} mr={2}>Edit</Button>
                                    <Button colorScheme="red" width="48%"
                                            onClick={() => handleDeleteParticipant(entry.id)}>Delete</Button>
                                </Flex>
                            </Box>
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>
        </BaseLayout>
    );
};

export default TravelDetailsPage;

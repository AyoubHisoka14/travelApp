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
import {
    onDeleteParticipant,
    Participant
} from "./TravelDetailsPage.tsx";
import {useParticipant} from "../provider/ParticipantProvider.tsx";
import {ParticipantModal} from "./ParticipantModal.tsx";


export const ParticipantDetailsPage = () => {

    const {selectedParticipant, resetSelectedParticipant} = useParticipant();
    const [participantDetail, setParticipantDetail] = useState<Participant | null>(null);
    const navigate = useNavigate();
    const disclosure = useDisclosure();

    const fetchParticipantDetail = async () => {
        try {
            const res = await fetch(`/api/participants/${selectedParticipant}`);
            const data = await res.json();
            setParticipantDetail(data);
        } catch (error) {
            console.error("Failed to load participant details:", error);
        }
    };

    useEffect(() => {
        if (!selectedParticipant) {
            navigate('/participants'); // Redirect to participants page
            return;
        }
        fetchParticipantDetail();
    }, [selectedParticipant, navigate, resetSelectedParticipant]);

    if (!participantDetail) {
        navigate('/participants');
        return;
    }

    const handleDeleteParticipant = async (id: string) => {
        await onDeleteParticipant(id);
        navigate('/participants')
    };

    return (
        <BaseLayout>
            <Box p={4}>
                <Center>
                    <Box
                        key={participantDetail.id}
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
                                src={`http://localhost:3000${participantDetail.image}`}
                                alt={participantDetail.name}
                                borderRadius="md"
                                mb={4}
                            />
                        </Center>
                        <Box>
                            <Text fontWeight="bold" fontSize="xl">
                                {participantDetail.name}
                            </Text>

                            <Flex justify="space-between" mt={4}>
                                <Button colorScheme="blue" width="48%" onClick={disclosure.onOpen}
                                        mr={2}>Edit</Button>
                                <Button colorScheme="red" width="48%"
                                        onClick={() => handleDeleteParticipant(participantDetail.id)}>Delete</Button>
                            </Flex>
                        </Box>
                    </Box>
                    <ParticipantModal
                        isOpen={disclosure.isOpen}
                        onClose={() => {
                            fetchParticipantDetail()
                            disclosure.onClose();
                        }}
                        participant={participantDetail}
                    />
                </Center>

                <Heading as="h2" size="lg" mt={8} mb={4}>
                    Travels
                </Heading>
                <Box mt={4} mb={4}>

                </Box>
                <SimpleGrid columns={[1, 2, 3]} spacing={10} mt={4}>

                    {participantDetail.travels.map((entry) => (
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

                            </Box>
                        </Box>
                    ))}

                </SimpleGrid>


            </Box>
        </BaseLayout>
    );
};


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
import {onDeleteParticipant, Participant} from "./TravelDetailsPage.tsx";
import {useParticipant} from "../provider/ParticipantProvider.tsx";


export const ParticipantPage = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const {setSelectedParticipant} = useParticipant();
    const navigate = useNavigate();

    const loadparticipants = useCallback(async () => {
        try {
            const httpRes = await fetch("/api/participants", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const res = await httpRes.json();
            setParticipants(res);
        } catch (error) {
            console.error("Failed to load travels:", error);
            setParticipants([]);
        }
    }, []);

    useEffect(() => {
        loadparticipants();
    }, [loadparticipants]);

    const onViewParticipants = (entry: Participant) => {
        setSelectedParticipant(entry.id);
        navigate('/participantDetail');
    };

    const handleDeleteParticipant = async (participant: Participant) => {
        await onDeleteParticipant(participant.id);
        loadparticipants();
    };

    return (
        <BaseLayout>
            <SimpleGrid columns={[1, 2, 3]} spacing={10} mt={12}>
                {participants.map((entry) => (
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
                            onClick={() => onViewParticipants(entry)}
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
                        </Box>
                        <Flex justify="center" mt={4}>
                            <Button colorScheme="red" width="90%"
                                    onClick={() => handleDeleteParticipant(entry)}>Delete
                            </Button>
                        </Flex>
                    </Box>
                ))}
            </SimpleGrid>
        </BaseLayout>
    );
};

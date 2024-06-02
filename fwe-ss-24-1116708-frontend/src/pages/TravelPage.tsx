import {useCallback, useEffect, useState} from "react";
import {
    Box,
    Image,
    Text,
    Button,
    Center,
    SimpleGrid,
    useDisclosure, Flex, InputGroup, InputLeftElement, Input,
} from "@chakra-ui/react";
import {useTravel} from "../provider/TravelProvider.tsx";
import {BaseLayout} from "../layout/BaseLayout.tsx";
import {TravelModal} from "./TravelModal.tsx";
import {useNavigate} from "react-router-dom";
import {onDeleteTravel, Travel} from "./TravelDetailsPage.tsx";
import { SearchIcon, CalendarIcon } from '@chakra-ui/icons';


export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const TravelPage = () => {

    const [travels, setTravels] = useState<Travel[]>([]);
    const {setSelectedTravel} = useTravel();
    const disclosure = useDisclosure();
    const navigate = useNavigate();
    const [searchName, setSearchName] = useState<string>('');
    const [searchStartDate, setSearchStartDate] = useState<string>('');


    const loadTravels = useCallback(async () => {
        try {
            const httpRes = await fetch("/api/travels", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const res = await httpRes.json();
            setTravels(res);
        } catch (error) {
            console.error("Failed to load travels:", error);
            setTravels([]);
        }
    }, []);

    useEffect(() => {
        loadTravels();
    }, [loadTravels]);

    const onViewTravel = (entry: Travel) => {
        setSelectedTravel(entry.id);
        navigate('/travelDetail');
    };

    const handleDeleteTravel = async (travel: Travel) => {
        await onDeleteTravel(travel.id);
        loadTravels();
    };

    const filteredTravels = travels.filter((travel) => {
        return (
            (searchName === '' || travel.name.toLowerCase().includes(searchName.toLowerCase())) &&
            (searchStartDate === '' || formatDate(travel.startDate) === searchStartDate)
        );
    });

    return (
        <BaseLayout>

            <Box mb={4} mt="8">
                <Flex width="80%" mx="auto" justifyContent="space-between" alignItems="center">
                    <InputGroup mb={2} bg="white" flex="1" mr={2}>
                        <InputLeftElement children={<SearchIcon color="gray.300" />} />
                        <Input
                            type="text"
                            placeholder="Search by name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                    </InputGroup>
                    <InputGroup bg="white" flex="1" ml={2}>
                        <InputLeftElement pointerEvents="none" children={<CalendarIcon color="gray.300" />} />
                        <Input
                            type="date"
                            placeholder="Search by start date"
                            value={searchStartDate}
                            onChange={(e) => setSearchStartDate(e.target.value)}
                        />
                    </InputGroup>
                </Flex>
            </Box>

            <Box mt={4} mb={4}>
                <Center>
                    <Button width="50%" bg="white" onClick={disclosure.onOpen}>Add New Travel</Button>
                </Center>
                <TravelModal
                    isOpen={disclosure.isOpen}
                    onClose={() => {
                        loadTravels();
                        disclosure.onClose();
                    }}
                    travel={null}
                />
            </Box>

            <SimpleGrid columns={[1, 2, 3]} spacing={10} mt={4}>
                {filteredTravels.map((entry) => (
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
                            onClick={() => onViewTravel(entry)}
                            cursor="pointer"
                            flex="1"
                        >
                            <Center>
                                <Image
                                    src={`http://localhost:3000${entry.image}`} // Use the imageUrl from the entry, or a fallback image
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
                                    onClick={() => handleDeleteTravel(entry)}>Delete
                            </Button>
                        </Flex>
                    </Box>
                ))}
            </SimpleGrid>
        </BaseLayout>
    );
};

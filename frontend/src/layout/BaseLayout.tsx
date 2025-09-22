import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import {Link} from "react-router-dom";

export type BaseLayoutProps = {
  children: React.ReactNode;
};
export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
      <Flex
          width="100vw"
          minHeight="100vh"
          bg="#F5CAAC"
          flexDirection="column"
      >

        <Box p={4} flex={1}>
          <Flex as="nav" bg="#001F3F" p={4} color="white" justifyContent="space-around">
            <Link to="/">Travels</Link>
            <Link to="/destinations">Destinations</Link>
            <Link to="/participants">Participants</Link>
          </Flex>

          <Box>{children}</Box>
        </Box>
      </Flex>
  );
};

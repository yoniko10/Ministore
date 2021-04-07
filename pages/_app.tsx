import React from "react";
import {ChakraProvider, Divider, Box, Heading, Text, Image, Container, VStack} from "@chakra-ui/react"
import {AppProps} from "next/app";
import theme from "../theme";


const App: React.FC<AppProps> = ({Component, pageProps}) => {
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4}>
        <Container borderRadius="sm" backgroundColor="white" boxShadow="md" marginY={4} maxWidth="container.xl" padding={4}>
          <VStack marginBottom={6}>
            <Image borderRadius={9999} src="//place-hold.it/128x128"></Image>
            <Heading>Almacency</Heading>
            <Text>Tu almacén de confianza</Text>
          </VStack>
          <Divider marginY={6}/>
          <Component {...pageProps} />
        </Container>
      </Box>
      
    </ChakraProvider>
  );
};

export default App;
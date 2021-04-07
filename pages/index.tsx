import React from "react";
import {GetStaticProps} from "next";
import {Product} from "../product/types";
import api from "../product/api";
import { Button, Flex, Grid, Link, Stack, Text} from "@chakra-ui/react";

interface Props {
    products: Product[];
}

function parseCurrency(value: number): string{
    return value.toLocaleString('es-AR', {
        style: "currency",
        currency: "ARS",  
    })
}

const IndexRoute: React.FC<Props> = ({products}) => {
    const [cart, setCart] = React.useState<Product[]>([]);
    const text = React.useMemo(
        () =>
            cart
                .reduce(
                    (message, product) => message.concat(`* ${product.title} - ${parseCurrency(product.price)}\n`),
                    ``,
                )
                .concat(`\nTotal: ${parseCurrency(cart.reduce((total, product) => total + product.price, 0))}`),
            [cart]
        ); 
    
        return (
        <Stack spacing={6}>
            <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
                {products.map((product) => (
                    <Stack padding={4} key={product.id} backgroundColor="gray.100" borderRadius="md">
                        <Stack spacing={1}>
                            <Text fontSize="md">{product.title}</Text>
                            <Text fontSize="sm">{product.description}</Text>
                            <Text color="green.500" fontSize="sm" fontWeight="500">{parseCurrency(product.price)}</Text>
                        </Stack>
                        <Button onClick={() => setCart(cart => cart.concat(product))} colorScheme="primary" size="sm">
                            Agregar
                        </Button>
                    </Stack>
                ))}    
            </Grid>
            {Boolean(cart.length) && (
                <Flex alignItems="center" bottom={4} justifyContent="center" position="sticky">
                    <Button
                        width="fit-content"
                        isExternal
                        as={Link}
                        colorScheme="whatsapp"
                        href={`https://wa.me/543886050010?text=${encodeURIComponent(text)}`}>
                        Ver carrito ({cart.length} producto)
                    </Button>
                </Flex>
                )}
        </Stack>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const products = await api.list();
    
    return {
        revalidate: 10,
        props: {
            products,
        },
    };
};

export default IndexRoute;


import React from "react";
import { GetStaticProps } from "next";
import { Product } from "../product/types";
import api from "../product/api";
import { Image, Button, Flex, Grid, Link, Stack, Text } from "@chakra-ui/react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";

interface Props {
    products: Product[];
}

function parseCurrency(value: number): string {
    return value.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
    });
}

const IndexRoute: React.FC<Props> = ({ products }) => {
    const [cart, setCart] = React.useState<Product[]>([]);
    const [selectedImage, setSelectedImage] = React.useState<string>(null);
    const text = React.useMemo(
        () =>
            cart
                .reduce(
                    (message, product) =>
                        message.concat(
                            `* ${product.title} - ${parseCurrency(product.price)}\n`
                        ),
                    ``
                )
                .concat(
                    `\nTotal: ${parseCurrency(
                        cart.reduce((total, product) => total + product.price, 0)
                    )}`
                ),
        [cart],
    );

    
    /* custom comment  React.useEffect(() => {
        setTimeout(() => setCart([]), 5000);
    }, [cart]);*/

    return (
        <AnimateSharedLayout type="crossfade">
            <Stack spacing={6}>
                <Grid
                    gridGap={6}
                    templateColumns="repeat(auto-fill, minmax(240px, 1fr))"
                >
                    {products.map((product) => (
                        <Stack
                            padding={4}
                            key={product.id}
                            backgroundColor="gray.100"
                            borderRadius="md"
                        >
                            <Stack spacing={1}>
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    as={motion.img}
                                    cursor="pointer"
                                    layoutId={product.image}
                                    borderTopRadius="md"
                                    maxHeight={128}
                                    objectFit="cover"
                                    onClick={() => setSelectedImage(product.image)}
                                />
                                <Text fontSize="md">{product.title}</Text>
                                <Text fontSize="sm">{product.description}</Text>
                                <Text color="green.500" fontSize="sm" fontWeight="500">
                                    {parseCurrency(product.price)}
                                </Text>
                            </Stack>
                            <Button
                                onClick={() => setCart((cart) => cart.concat(product))}
                                colorScheme="primary"
                                size="sm"
                            >
                                Agregar
                            </Button>
                        </Stack>
                    ))}
                </Grid>
                <AnimatePresence>
                    {Boolean(cart.length) && (
                        <Flex
                            initial={{scale:0}}
                            animate={{scale:1}}
                            exit={{scale:0}}
                            as={motion.div}
                            alignItems="center"
                            bottom={4}
                            justifyContent="center"
                            position="sticky"
                        >
                            <Button
                                width="fit-content"
                                isExternal
                                as={Link}
                                colorScheme="whatsapp"
                                size="lg"
                                leftIcon={<Image src="https://icongr.am/fontawesome/whatsapp.svg?size=32&color=ffffff"/>}
                                href={`https://wa.me/543886050010?text=Hola!%20Me%20gustaría%20realizar%20este%20pedido:%0A${encodeURIComponent(
                                    text
                                )}`}
                            >
                                Hacer pedido ({cart.length} producto)
                            </Button>
                        </Flex>
                    )}
                </AnimatePresence>
            </Stack>
            <AnimatePresence>
                {selectedImage && (
                    <Flex
                        key="backdrop"
                        alignItems="center"
                        as={motion.div}
                        backgroundColor="rgba(0,0,0,0.5)"
                        justifyContent="center"
                        layoutId={selectedImage}
                        left={0}
                        position="fixed"
                        top={0}
                        height="100%"
                        width="100%"
                        onClick={() => setSelectedImage(null)}
                    >
                        <Image key="image" src={selectedImage} />
                    </Flex>
                )}
            </AnimatePresence>
        </AnimateSharedLayout>
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

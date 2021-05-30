import React from "react";
import { GetStaticProps } from "next";
import { Product } from "../product/types";
import api from "../product/api";
import { Image, Button, Flex, Grid, Link, HStack, Stack, Text, useDisclosure} from "@chakra-ui/react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";
import { List, ListItem, ListIcon, OrderedList, UnorderedList } from "@chakra-ui/react"

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
    const [cart, setCart] = React.useState<CartItem[]>([]);
    const [selectedImage, setSelectedImage] = React.useState<string>(null);
    const total = React.useMemo(() => parseCurrency(cart.reduce((total, product) => total + product.price, 0)),
    [cart],
    );
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
                    `\nTotal: ${total}`
                ),
        [cart, total],
    );

    function handleAddToCart(product: Product) {
        setCart((cart) => {
            if (cart.some((item) => item.id == product.id)) {
                return cart.map((item) =>
                    item.id == product.id
                    ?   {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                    : item,
                );
            }
            return cart.concat({...product, quantity: 1});
        });
    }

    function handleRemoveFromCart(index){
        setCart((cart) => cart.filter((_, _index) => _index != index));
    }
    
    /* constantes definidas para que funcione el Drawer*/
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    
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
                                leftIcon={<Image src="https://icongr.am/fontawesome/shopping-cart.svg?size=24&color=ffffff"/>}
                            ref={btnRef} colorScheme="teal" onClick={onOpen}
                                >Carrito ({cart.length} producto)</Button>
                            <Drawer
        isOpen={isOpen}
        size="md"
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        >
        <DrawerOverlay>
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Carrito</DrawerHeader>

            <DrawerBody>
                <List spacing={4}>
                    {cart.map((product, index) => <ListItem key={product.id}>
                            <HStack justifyContent="space-between">
                                <Text fontWeight="500">{product.title}</Text>
                                <HStack spacing={3}>
                                    <Text color="green.400">{parseCurrency(product.price)}</Text>
                                    <Button colorScheme="red" onClick={() => handleRemoveFromCart(index) } size="xs">X</Button>
                                </HStack>
                            </HStack>
                        </ListItem>)}
                </List>
            </DrawerBody>

            <DrawerFooter>
                <Button
                                width="100%"
                                isExternal
                                as={Link}
                                colorScheme="whatsapp"
                                size="lg"
                                leftIcon={<Image src="https://icongr.am/fontawesome/whatsapp.svg?size=24&color=ffffff"/>}
                                href={`https://wa.me/543886050010?text=Hola!%20Me%20gustaría%20realizar%20este%20pedido:%0A${encodeURIComponent(
                                    text
                                )}`}
                            >
                                Hacer pedido ({total})
                            </Button>
            </DrawerFooter>
            </DrawerContent>
        </DrawerOverlay>
        </Drawer>
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

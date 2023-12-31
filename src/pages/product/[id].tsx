import { stripe } from "@/src/lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "@/src/styles/pages/product";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Stripe from "stripe";

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
    description: string;
    defaultPriceId: string;
  }
}

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSession(true);

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    }
    catch {
      // TODO: conectar ao Sentry
      alert("Erro ao adicionar o produto ao carrinho");

      setIsCreatingCheckoutSession(false);
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} | James Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image
            src={product.imageUrl}
            width={520}
            height={480}
            alt=""
          />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct} type="button">
            Adicionar ao carrinho
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  });

  const paths = response.data.map(product => ({
    params: {
      id: product.id
    }
  }));

  return {
    paths,
    fallback: "blocking" // true: if the product is not found, it will be generated on the fly
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  });

  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price.unit_amount ? price.unit_amount / 100 : 0),
        imageUrl: product.images[0],
        description: product.description,
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1 // 1 hour
  }
}
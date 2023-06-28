import Link from "next/link";
import { ImageContainer, SuccessContainer } from "../styles/pages/success";
import { GetServerSideProps } from "next";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";
import Image from "next/image";
import Head from "next/head";

interface SuccessProps {
  customerName: string;
  product: {
    name: string;
    imageUrl: string;
  }
}

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra finalizada | James Shop</title>

        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <SuccessContainer>
        <h1>Compra realizada com sucesso!</h1>

        <ImageContainer>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={120}
            height={110}
          />
        </ImageContainer>

        <p>
          Aí sim, <strong>{customerName}</strong>, agora é só relaxar e esperar <strong>{product.name}</strong> chegar na sua casa.
        </p>

        <Link href="/">
          Voltar para a página inicial
        </Link>
      </SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const sessionId = String(query.session_id);

  const session = await stripe.checkout.sessions.retrieve(sessionId,
    { expand: ['line_items', 'line_items.data.price.product'] }
  );

  const customerName = session.customer_details.name.split(' ')[0];
  const product = session.line_items.data[0].price.product as Stripe.Product;

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      }
    }
  }
}

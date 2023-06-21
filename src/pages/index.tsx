import Image from "next/image"
import { useKeenSlider } from "keen-slider/react"
import { GetStaticProps } from "next"
import Stripe from "stripe"

import { HomeContainer, Product } from "../styles/pages/home"
import { stripe } from "../lib/stripe"

import "keen-slider/keen-slider.min.css"

interface HomeProps {
  products: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  }[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map(product => (
        <Product key={product.id} className="keen-slider__slide">
          <Image
            src={product.imageUrl}
            width={520}
            height={480}
            alt="product"
          />
          <footer>
            <strong>{product.name}</strong>
            <span>{product.price}</span>
          </footer>
        </Product>
      ))}
    </HomeContainer>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  });

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price.unit_amount ? price.unit_amount / 100 : 0),
      imageUrl: product.images[0],
    }
  });

  return {
    props: {
      products
    },
    revalidate: 60 * 60 // 1 hour
  }
}

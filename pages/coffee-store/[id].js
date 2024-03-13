import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import coffeeStoresData from '../../data/coffee-stores.json'

export async function getStaticProps({ params }) {
  return {
    props: {
      coffeeStore: coffeeStoresData.find(
        coffeeStore => coffeeStore.id.toString() === params.id
      ),
    },
  }
}

export async function getStaticPaths() {
  const paths = coffeeStoresData.map(coffeeStore => ({
    params: { id: coffeeStore.id.toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

const CoffeeStore = ({ coffeeStore }) => {
  const router = useRouter()

  const { address, name, neighbourhood } = coffeeStore

  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <Link href='/'>Back to home</Link>
      <p>{address}</p>
      <p>{name}</p>
      <p>{neighbourhood}</p>
    </div>
  )
}

export default CoffeeStore

import { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import cls from 'classnames'

import { StoreContext } from '@/context/storeContext'
import { fetchCoffeeStores } from '@/lib/coffee-stores'
import { fetcher } from '@/lib/swr'
import styles from '@/styles/coffee-store.module.css'
import { isEmpty } from '@/utils'

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores()
  const findCoffeeStoreById = coffeeStores.find(
    coffeeStore => coffeeStore.id.toString() === params.id
  )

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  }
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores()
  const paths = coffeeStores.map(coffeeStore => ({
    params: { id: coffeeStore.id.toString() },
  }))

  return {
    paths,
    fallback: true,
  }
}

const CoffeeStore = props => {
  const router = useRouter()
  const id = router.query.id
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)
  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore ?? {})
  const [votingCount, setVotingCount] = useState(0)
  const {
    state: { coffeeStores },
  } = useContext(StoreContext)
  const { name, address, neighbourhood, imgUrl } = coffeeStore

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0])
      setVotingCount(data[0].voting)
    }
  }, [data])

  useEffect(() => {
    if (isEmpty(coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find(
          coffeeStore => coffeeStore.id.toString() === id
        )
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext)
          handleCreateCoffeStore(coffeeStoreFromContext)
        }
      }
    } else {
      handleCreateCoffeStore(coffeeStore)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch('/api/favouriteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      const dbCoffeeStore = await response.json()

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        setVotingCount(prev => prev + 1)
      }

      return dbCoffeeStore
    } catch (err) {
      console.error('Error upvoting the coffee store', err)
    }
  }

  const handleCreateCoffeStore = async coffeeStore => {
    try {
      const { id, name, address, neighbourhood, imgUrl } = coffeeStore
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          address: address ?? '',
          neighbourhood: neighbourhood ?? '',
          voting: 0,
          imgUrl,
        }),
      })
      const dbCoffeeStore = await response.json()

      return dbCoffeeStore
    } catch (err) {
      console.error('Error creating the coffee store', err)
    }
  }

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta
          name='description'
          content={`${name} coffee store`}
        />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>&larr; Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            className={styles.storeImg}
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            }
            width={600}
            height={360}
            alt='banner image'
            priority
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/places.svg'
                width='24'
                height='24'
                alt='address icon'
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}

          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/nearMe.svg'
                width='24'
                height='24'
                alt='arrow icon'
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}

          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/star.svg'
              width='24'
              height='24'
              alt='star icon'
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button
            className={styles.upvoteButton}
            onClick={handleUpvoteButton}
          >
            Up vote!
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore

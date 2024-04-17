import Head from 'next/head'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'

import Banner from '@/components/Banner'
import Card from '@/components/Card'
import { ACTION_TYPES, StoreContext } from '@/context/storeContext'
import useTrackLocation from '@/hooks/useTrackLocation'
import { fetchCoffeeStores } from '@/lib/coffee-stores'
import styles from '@/styles/Home.module.css'

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores()

  return {
    props: {
      coffeeStores,
    },
  }
}

export default function Home({ coffeeStores }) {
  const { state, dispatch } = useContext(StoreContext)
  const { latLong, coffeeStores: fetchedCoffeeStores } = state
  const { locationErrorMsg, isFindingLocation, handleTrackLocation } =
    useTrackLocation()
  const [coffeeStoresError, setCoffeeStoresError] = useState('')

  const handleOnBannerBtnClick = () => {
    handleTrackLocation()
  }

  useEffect(() => {
    const fetchData = async () => {
      if (latLong && fetchedCoffeeStores.length === 0) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=12`
          )
          const data = await response.json()
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: data,
          })
          setCoffeeStoresError('')
        } catch (error) {
          console.log(error)
          setCoffeeStoresError(error.message)
        }
      }
    }
    fetchData()
  }, [dispatch, fetchedCoffeeStores.length, latLong])

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta
          name='description'
          content='allows you to discover coffee stores'
        />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}

        <div className={styles.heroImage}>
          <Image
            src='/static/hero-image.png'
            width={700}
            height={400}
            alt='hero image'
            priority
          />
        </div>

        {fetchedCoffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {fetchedCoffeeStores.map(coffeeStore => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                />
              ))}
            </div>
          </div>
        )}

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Kyiv stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(coffeeStore => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

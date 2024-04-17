import { createApi } from 'unsplash-js'

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
})

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

const getListOfCoffeeStoresPhotos = async limit => {
  const photos = await unsplash.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: limit,
    orientation: 'landscape',
  })
  const unsplashResults = photos.response.results

  return unsplashResults.map(result => result.urls['small'])
}

export const fetchCoffeeStores = async (
  latLong = '50.4502594466002,30.523900744535226',
  limit = 6
) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  }

  const photos = await getListOfCoffeeStoresPhotos(limit)

  const response = await fetch(
    getUrlForCoffeeStores(latLong, 'coffee', limit),
    options
  )
  const data = await response.json()

  return data.results.map((result, idx) => {
    const neighborhood = result.location.neighborhood
    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.address,
      neighbourhood: neighborhood?.length > 0 ? neighborhood[0] : '',
      imgUrl: photos.length > 0 ? photos[idx] : null,
    }
  })
}

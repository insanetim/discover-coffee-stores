const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

export const fetchCoffeeStores = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  }

  const response = await fetch(
    getUrlForCoffeeStores(
      '48.39459843076644%2C35.034111801292326',
      'coffee',
      6
    ),
    options
  )
  const data = await response.json()

  return data.results
}

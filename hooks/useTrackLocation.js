import { useContext, useState } from 'react'

import { ACTION_TYPES, StoreContext } from '@/context/storeContext'

const useTrackLocation = () => {
  const { dispatch } = useContext(StoreContext)
  const [locationErrorMsg, setLocationErrorMsg] = useState('')
  const [isFindingLocation, setIsFindingLocation] = useState(false)

  const success = position => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude

    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: `${latitude},${longitude}`,
    })
    setLocationErrorMsg('')
    setIsFindingLocation(false)
  }

  const error = () => {
    setLocationErrorMsg('Unable to retrieve your location')
    setIsFindingLocation(false)
  }

  const handleTrackLocation = () => {
    setIsFindingLocation(true)
    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is not supported by your browser')
      setIsFindingLocation(false)
    } else {
      navigator.geolocation.getCurrentPosition(success, error)
    }
  }

  return { locationErrorMsg, isFindingLocation, handleTrackLocation }
}

export default useTrackLocation

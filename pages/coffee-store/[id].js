import { useRouter } from 'next/router'

const CoffeeStore = () => {
  const router = useRouter()

  return <div>coffee store page: {router.query.id}</div>
}

export default CoffeeStore

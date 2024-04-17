import { findRecordByFilter } from '@/lib/airtable'

const getCoffeeStoreById = async (req, res) => {
  try {
    const { id } = req.query

    if (id) {
      const records = await findRecordByFilter(id)

      if (records.length !== 0) {
        res.json(records)
      } else {
        res.status(400).json({ message: 'Store not found' })
      }
    } else {
      res.status(400).json({ message: 'Id is missing' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
}

export default getCoffeeStoreById

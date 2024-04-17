import { table, getMinifiedRecords, findRecordByFilter } from '@/lib/airtable'

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, address, neighbourhood, voting, imgUrl } = req.body

    try {
      if (id) {
        const findRecords = await findRecordByFilter(id)

        if (findRecords.length !== 0) {
          res.json(findRecords)
        } else {
          if (name) {
            const createRecords = await table.create([
              { fields: { id, name, address, neighbourhood, voting, imgUrl } },
            ])
            const records = getMinifiedRecords(createRecords)
            res.status(201).json({ message: 'create a record', records })
          } else {
            res.status(400).json({ message: 'Id or name is missing' })
          }
        }
      } else {
        res.status(400).json({ message: 'Id is missing' })
      }
    } catch (err) {
      console.error('Error creating or finding a store', err)
      res
        .status(500)
        .json({ message: 'Error creating or finding a store', err })
    }
  }
}

export default createCoffeeStore

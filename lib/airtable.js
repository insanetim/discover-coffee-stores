import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
)

const table = base('coffee-stores')

const getMinifiedRecord = record => ({ recordId: record.id, ...record.fields })

const getMinifiedRecords = records => records.map(getMinifiedRecord)

const findRecordByFilter = async id => {
  const records = await table
    .select({ filterByFormula: `id="${id}"` })
    .firstPage()

  return getMinifiedRecords(records)
}

export { table, getMinifiedRecords, findRecordByFilter }

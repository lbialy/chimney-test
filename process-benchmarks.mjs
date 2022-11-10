import { argv } from 'node:process'
import { promises as fs } from 'node:fs'

const metaFileName = 'meta.json'

const pathToResultFile = argv[2]
const commitSha = argv[3]

const metadata = JSON.parse(await fs.readFile(metaFileName, 'utf8'))

metadata.push({
    file: `${commitSha}.json`
})

await fs.writeFile(metaFileName, JSON.stringify(metadata, null, 2))

console.log(metadata)


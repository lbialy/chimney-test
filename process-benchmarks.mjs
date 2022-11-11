import { argv } from 'node:process'
import { promises as fs } from 'node:fs'

const metaFileName = 'meta.json'

const githubContext = JSON.parse(argv[2])
const gitDescribe = argv[3]

const metadata = JSON.parse(await fs.readFile(metaFileName, 'utf8'))

const { compare, head_commit, event, event_name, ref } = githubContext
console.log('compare:', compare)
console.log('head_commit:', head_commit)
console.log('event:', event)
console.log('event_name:', event_name)
console.log('ref:', ref)

delete head_commit.url

metadata.push({
    file: `${githubContext.sha}.json`,
    compare,
    prevCommit: event.before,
    sha: event.after,
    eventName: event_name,
    ref,
    commit: head_commit,
    describe: gitDescribe
})

await fs.writeFile(metaFileName, JSON.stringify(metadata, null, 2))

console.log(metadata)


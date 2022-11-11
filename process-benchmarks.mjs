import { argv } from 'node:process'
import { promises as fs } from 'node:fs'
import { inspect } from 'node:util'

const metaFileName = 'meta.json'

const githubContext = JSON.parse(argv[2])
const gitDescribe = argv[3]

const metadata = JSON.parse(await fs.readFile(metaFileName, 'utf8'))

const { event, event_name, ref } = githubContext
const { head_commit, compare } = event

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

console.log(inspect(metadata, {showHidden: false, depth: null, colors: true}))


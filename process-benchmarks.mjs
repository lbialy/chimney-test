import { argv } from 'node:process'
import { promises as fs } from 'node:fs'
import { inspect } from 'node:util'

const metaFileName = 'meta.json'
const triggerLabel = 'benchmark'

const githubContext = JSON.parse(argv[2])
const gitDescribe = argv[3]

const metadata = JSON.parse(await fs.readFile(metaFileName, 'utf8'))

if (githubContext.event_name === 'push') {
    const { event, event_name, ref } = githubContext

    const { head_commit, compare } = event

    delete head_commit.url

    metadata.push({
        file: `${githubContext.sha}.json`,
        sha: event.after,
        event: event_name,
        describe: gitDescribe,
        ref,
        prevCommit: event.before,
        commit: head_commit,
        compare,
    })

    await fs.writeFile(metaFileName, JSON.stringify(metadata, null, 2))
}

if (githubContext.event_name === 'pull_request') {
    const { event, event_name, ref, head_ref } = githubContext

    if (event.action === 'labeled' && event.label.name === triggerLabel) { // only fire for labelling as 'benchmark'
        const { label, pull_request } = event

        metadata.push({
            file: `${githubContext.sha}.json`,
            sha: githubContext.sha,
            event: event_name,
            describe: gitDescribe,
            ref,
            sourceBranch: head_ref,
            label: label.name,
            prTitle: pull_request.title,
        })
    }

    if (event.action === 'synchronize') {
        const { pull_request } = event
        console.log(inspect(githubContext, {showHidden: false, depth: null, colors: true}))

        metadata.push({
            file: `${githubContext.sha}.json`,
            sha: githubContext.sha,
            event: event_name,
            describe: gitDescribe,
            ref,
            sourceBranch: head_ref,
            prTitle: pull_request.title,
        })
    }

    if (event.action === 'opened') {
        const { pull_request } = event
        console.log(inspect(githubContext, {showHidden: false, depth: null, colors: true}))

        metadata.push({
            file: `${githubContext.sha}.json`,
            sha: githubContext.sha,
            event: event_name,
            describe: gitDescribe,
            ref,
            sourceBranch: head_ref,
            prTitle: pull_request.title,
        })
    }

    if (event.action === 'reopened') {
        const { pull_request } = event
        console.log(inspect(githubContext, {showHidden: false, depth: null, colors: true}))

        metadata.push({
            file: `${githubContext.sha}.json`,
            sha: githubContext.sha,
            event: event_name,
            describe: gitDescribe,
            ref,
            sourceBranch: head_ref,
            prTitle: pull_request.title,
        })
    }

    await fs.writeFile(metaFileName, JSON.stringify(metadata, null, 2))
}

console.log(inspect(metadata, {showHidden: false, depth: null, colors: true}))


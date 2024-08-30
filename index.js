const core = require('@actions/core');
const fs = require('node:fs');

async function run() {
  const inputs = {
    key: core.getInput('key', {required: true}),
    needle: core.getInput('needle', {required: true}),
    haystack: core.getInput('haystack', {required: true}),
    asString : core.getInput('asString', {required: false}),
    taskKey: core.getInput('taskKey', {required: false}),
  }

  const haystack = await fs.promises.readFile(inputs.haystack, 'utf8')

  if (!haystack) {
    core.setFailed('No content in the list');
    return;
  }

  // noinspection JSCheckFunctionSignatures
  const haystackList = JSON.parse(haystack);

  if (!haystackList) {
    core.setFailed('Invalid haystack content');
    return;
  }

  const resultHaystack = haystackList.find((haystackItem) => {
    return haystackItem[inputs.key] === inputs.needle;
  });

  if (!resultHaystack) {
    core.setFailed('No matching key found');
    return
  }

  const taskKeys = resultHaystack[inputs.taskKey];

  if (!taskKeys) {
    core.setFailed('No tasks found');
    return
  }

  if (!resultHaystack) {
    core.setFailed('No matching key found');
    return
  }

  const innerJsonStrings = inputs.asString.split(',');
  if (innerJsonStrings.length !== 0) {
    innerJsonStrings.forEach((shouldBeString) => {
      taskKeys.forEach((taskKeys) => {
        taskKeys[shouldBeString] = JSON.stringify(taskKeys[shouldBeString]);
      })
    })
  }

  const result = JSON.stringify(taskKeys);

  core.setOutput('filtered', result);
}

run().catch((error) => {
  core.setFailed(error.message);
});


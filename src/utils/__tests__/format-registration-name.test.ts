import path from 'path'

import formatRegistrationName from '../format-registration-name'

const tests = [
  [['mydir', 'models', 'delivery-request'], 'deliveryRequestModel'],
  [['mydir', 'services', 'user'], 'userService'],
  [['mydir', 'repositorys', 'it-is-a-long-file'], 'itIsALongFileRepository'],
  [['mydir', 'repositories', 'it-is-a-long-file'], 'itIsALongFileRepository'],
  [['medusa-test-dir', 'dist', 'services', 'my-test.js'], 'myTestService'],
  [['medusa-test-dir', 'dist', 'services', 'my.js'], 'myService'],
  [['services', 'my-quite-long-file.js'], 'myQuiteLongFileService'],
  [['/', 'Users', 'seb', 'com.medusa.js', 'services', 'dot.js'], 'dotService'],
  [['/', 'Users', 'seb.rin', 'com.medusa.js', 'services', 'dot.js'], 'dotService'],
  [['/', 'Users', 'seb.rin', 'com.medusa.js', 'repositories', 'dot.js'], 'dotRepository'],
  [['/', 'Users', 'seb.rin', 'com.medusa.js', 'models', 'dot.js'], 'dotModel'],
  [['C:', 'server', 'services', 'dot.js'], 'dotService'],
]

describe('test format name util', () => {
  it.each(tests)('test format registration name', (pathParts, res) => {
    const registrationPath = path.join(...(Array.isArray(pathParts) ? pathParts : [pathParts]))

    expect(formatRegistrationName(registrationPath)).toBe(res)
  })
})

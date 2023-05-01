import loadConfig from '../config'

describe('loading config test', () => {
  const result = loadConfig(process.cwd())

  it('test config', () => {
    expect(result.projectConfig).toBeDefined()
    expect(result.projectConfig.cookie_secret).toBe('cookieSecret')
  })
})

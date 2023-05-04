import path from 'node:path'

type Result = {
  coreMigrations: string[]
}

/**
 * Get the migrations to run
 * @param directory Location to get migrations from
 */
export function getMigrations(): Result {
  const migrationDirs: string[] = []
  const corePackageMigrations = path.resolve(path.join(__dirname, '..', '..', 'migrations'))

  migrationDirs.push(path.join(corePackageMigrations, '*.js'))

  return {
    coreMigrations: migrationDirs,
  }
}

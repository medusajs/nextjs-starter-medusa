#!/usr/bin/env node

/**
 * Filter System Test Runner
 * 
 * Provides convenient commands to run specific filter system tests
 * Usage: node scripts/test-filters.js [command] [options]
 */

const { spawn } = require('child_process')
const path = require('path')

const commands = {
  all: {
    description: 'Run all filter system tests',
    command: 'npm',
    args: ['test', '--', '__tests__']
  },
  unit: {
    description: 'Run unit tests (server-side logic)',
    command: 'npm',
    args: ['test', '--', '__tests__/lib/data/products.test.ts']
  },
  component: {
    description: 'Run component tests (React components)', 
    command: 'npm',
    args: ['test', '--', '__tests__/modules/store/components/filtered-products-container/client.test.tsx', '__tests__/modules/layout/components/filter-panel-content/index.test.tsx']
  },
  integration: {
    description: 'Run integration tests (end-to-end workflows)',
    command: 'npm', 
    args: ['test', '--', '__tests__/modules/store/components/filtered-products-container/integration.test.tsx']
  },
  utils: {
    description: 'Run utility function tests',
    command: 'npm',
    args: ['test', '--', '__tests__/modules/store/components/filtered-products-container/utils.test.ts']
  },
  coverage: {
    description: 'Run all tests with coverage report',
    command: 'npm',
    args: ['run', 'test:coverage', '--', '__tests__']
  },
  watch: {
    description: 'Run tests in watch mode',
    command: 'npm',
    args: ['run', 'test:watch', '--', '__tests__']
  },
  ci: {
    description: 'Run tests for CI (no watch, with coverage)',
    command: 'npm',
    args: ['test', '--', '__tests__', '--coverage', '--watchAll=false']
  }
}

function showHelp() {
  console.log('🧪 Filter System Test Runner\n')
  console.log('Usage: npm run test:filters [command]\n')
  console.log('Available commands:')
  
  Object.entries(commands).forEach(([name, config]) => {
    console.log(`  ${name.padEnd(12)} ${config.description}`)
  })
  
  console.log('\nExamples:')
  console.log('  npm run test:filters all        # Run all filter tests')
  console.log('  npm run test:filters unit       # Run only unit tests')
  console.log('  npm run test:filters coverage   # Run with coverage report')
  console.log('  npm run test:filters watch      # Run in watch mode')
  console.log('')
  console.log('📁 Test Structure:')
  console.log('  __tests__/')
  console.log('  ├── lib/data/products.test.ts                               # Server-side filtering')
  console.log('  └── modules/')
  console.log('      ├── layout/components/filter-panel-content/index.test.tsx  # Filter panel UI')
  console.log('      └── store/components/filtered-products-container/')
  console.log('          ├── client.test.tsx                                    # React component')
  console.log('          ├── integration.test.tsx                               # End-to-end workflows')
  console.log('          └── utils.test.ts                                      # Utility functions')
  console.log('')
}

function runCommand(commandName) {
  const config = commands[commandName]
  
  if (!config) {
    console.error(`❌ Unknown command: ${commandName}`)
    showHelp()
    process.exit(1)
  }
  
  console.log(`🚀 Running: ${config.description}`)
  console.log(`📝 Command: ${config.command} ${config.args.join(' ')}\n`)
  
  const child = spawn(config.command, config.args, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  })
  
  child.on('close', (code) => {
    if (code === 0) {
      console.log(`\n✅ Tests completed successfully`)
    } else {
      console.log(`\n❌ Tests failed with exit code ${code}`)
    }
    process.exit(code)
  })
  
  child.on('error', (err) => {
    console.error(`❌ Failed to run command: ${err.message}`)
    process.exit(1)
  })
}

// Parse command line arguments
const args = process.argv.slice(2)
const command = args[0]

if (!command || command === 'help' || command === '-h' || command === '--help') {
  showHelp()
  process.exit(0)
}

// Check if it's a valid command
if (!commands[command]) {
  console.error(`❌ Unknown command: ${command}`)
  showHelp()
  process.exit(1)
}

// Run the command
runCommand(command)